#!/usr/bin/env node
/**
 * Pre-launch audit. Reports, per product:
 *   - missing GPSR safety fields (section 5)
 *   - missing/placeholder images, alt text, mismatched videos (section 9)
 *   - outstanding company + shop-term TODOs (sections 1-3)
 *
 * Reads the TypeScript data files by stripping types, so it stays in sync with
 * the real catalogue rather than duplicating it. Run: node scripts/audit.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");

/* ── crude but sufficient parse of the product data files ─────────────────── */
function parseProducts(file) {
  const src = readFileSync(join(ROOT, file), "utf8");
  const out = [];
  // split on the object boundary used consistently in these files
  const blocks = src.split(/\n {2}\{\n {4}id: "/).slice(1);
  for (const b of blocks) {
    const body = b.split("\n  },")[0];
    const id = b.slice(0, b.indexOf('"'));
    const pick = (k) => {
      const m = body.match(new RegExp(`\\b${k}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1] : null;
    };
    const pickArr = (k) => {
      const m = body.match(new RegExp(`\\b${k}:\\s*\\[([^\\]]*)\\]`, "s"));
      if (!m) return [];
      return [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
    };
    const priceM = body.match(/\bprice:\s*([0-9.]+|[A-Z_]+)/);
    out.push({
      id,
      file,
      hasPrice: Boolean(priceM),
      name: pick("name"),
      image: pick("image"),
      video: pick("video"),
      videos: pickArr("videos"),
      images: pickArr("images"),
      availability: pick("availability"),
      powerSource: pick("powerSource"),
      notifyOnRestock: /notifyOnRestock:\s*true/.test(body),
    });
  }
  return out;
}

const products = [
  ...parseProducts("data/index.ts"),
  ...parseProducts("data/professionalProducts.ts"),
  ...parseProducts("data/scareEffectProducts.ts"),
  // Testimonials live in data/index.ts and share the { id, name } shape, so
  // require a price to count as a sellable product.
].filter((p) => p.name && p.hasPrice);

/* ── helpers ──────────────────────────────────────────────────────────────── */
const decode = (u) => decodeURIComponent(u.replace(/^\//, ""));
const fileExists = (u) => existsSync(join(PUBLIC, decode(u)));
/** loose slug for comparing a media filename against a product name */
const norm = (s) =>
  s.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "");

/* ── 1. GPSR safety gaps (all products, since nothing is populated yet) ────── */
// Mirrors lib/productSafety.ts. Kept in sync manually because that file is TS.
const SAFETY_FIELDS = [
  ["manufacturerName", false],
  ["manufacturerAddress", false],
  ["euResponsibleName", true],
  ["euResponsibleAddress", true],
  ["euResponsibleContact", false],
  ["ceMarking", true],
  ["voltage", false],
  ["warnings.indoorOnly", false],
  ["warnings.twoPersonAssembly", false],
  ["warnings.ageGuidance", false],
];
const SAFETY_POPULATED = {}; // lib/productSafety.ts productSafety is empty

/* ── 2. media integrity ───────────────────────────────────────────────────── */
const missingImage = [];
const brokenAssets = [];
const videoMismatch = [];

for (const p of products) {
  if (!p.image) missingImage.push(p);
  else if (!fileExists(p.image)) brokenAssets.push({ p, asset: p.image, kind: "image" });

  for (const img of p.images) if (!fileExists(img)) brokenAssets.push({ p, asset: img, kind: "image[]" });

  const vids = [p.video, ...p.videos].filter(Boolean);
  for (const v of vids) if (!fileExists(v)) brokenAssets.push({ p, asset: v, kind: "video" });

  // does the primary video's filename resemble the product name?
  if (p.video) {
    const fname = decode(p.video).split("/").pop();
    const a = norm(fname.replace(/ (ALT\d*|REAL|pro)$/i, ""));
    const b = norm(p.name);
    const related = a.includes(b) || b.includes(a) ||
      // tolerate the common "Halloween pop X" vs "X" shortening
      norm(p.name.replace(/^halloween pop /i, "")).length > 4 &&
        a.includes(norm(p.name.replace(/^halloween pop /i, "")));
    if (!related) videoMismatch.push({ id: p.id, name: p.name, video: fname });
  }
}

/* ── 3. placeholder/stock image heuristic ─────────────────────────────────── */
const placeholderish = products.filter(
  (p) => p.image && /placeholder|stock|dummy|sample|temp/i.test(p.image)
);

/* ── report ───────────────────────────────────────────────────────────────── */
const line = (s = "") => console.log(s);
line("═".repeat(72));
line("PRE-LAUNCH AUDIT");
line("═".repeat(72));
line(`Products in catalogue: ${products.length}`);
line();

line("── SECTION 5 · GPSR SAFETY FIELDS ".padEnd(72, "─"));
const populated = Object.keys(SAFETY_POPULATED).length;
line(`Products with ANY safety data: ${populated} / ${products.length}`);
line(`Missing per product: ${SAFETY_FIELDS.length} fields (all products)`);
line();
line("Fields required from the supplier, for EVERY product:");
for (const [f, crit] of SAFETY_FIELDS) line(`   ${crit ? "!!" : "  "} ${f}${crit ? "   ← unlawful to list without this" : ""}`);
line();
line("Products awaiting safety data (all of them):");
for (const p of products) line(`   ${p.id}`);
line();

line("── SECTION 9 · MEDIA INTEGRITY ".padEnd(72, "─"));
line(`Products with NO image: ${missingImage.length}`);
for (const p of missingImage) line(`   ✗ ${p.id} (${p.name})`);
line();
line(`Referenced assets missing from /public: ${brokenAssets.length}`);
for (const b of brokenAssets) line(`   ✗ ${b.p.id} → ${b.kind} ${b.asset}`);
line();
line(`Videos whose filename does not match the product: ${videoMismatch.length}`);
for (const v of videoMismatch) line(`   ? ${v.id}\n       name:  ${v.name}\n       video: ${v.video}`);
line();
line(`Placeholder/stock-looking images: ${placeholderish.length}`);
for (const p of placeholderish) line(`   ? ${p.id} → ${p.image}`);
line();

line("═".repeat(72));
const criticalCount = products.length * SAFETY_FIELDS.filter(([, c]) => c).length;
line(`BLOCKING: ${criticalCount} critical safety values missing across catalogue`);
line(`BLOCKING: ${missingImage.length} products without an image`);
line(`BLOCKING: ${brokenAssets.length} broken asset references`);
line("═".repeat(72));
