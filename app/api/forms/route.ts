import { NextRequest, NextResponse } from "next/server";
import { company } from "@/lib/companyInfo";
import { getProductById } from "@/lib/catalogue";
import { escapeHtml, sendEmail } from "@/lib/email";

/**
 * The site's three forms — contact, pre-order and notify-me — post here.
 *
 * All three used to fake it: a setTimeout, then a success screen. A visitor
 * who filled one in believed they had reached the shop while nothing had been
 * sent or stored anywhere. So the rule this route exists to enforce is: the
 * form may only claim success once the message has actually reached the shop.
 *
 * Which is why the two mails are not equal. The mail to the shop IS the
 * delivery — if it fails, this returns an error and the visitor is told to
 * mail us directly. The confirmation to the visitor is a courtesy: if that one
 * fails the message still arrived, so it is logged and the response stays 2xx.
 */

type FormType = "contact" | "preorder" | "notify";
type FormLanguage = "nl" | "en";

const MAX = { name: 100, email: 200, subject: 50, message: 5000, phone: 40 };
const MAX_QUANTITY = 99;

type Payload = {
  type?: unknown;
  language?: unknown;
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  phone?: unknown;
  productId?: unknown;
  quantity?: unknown;
  /** Honeypot. A real visitor never sees this field; a bot fills it in. */
  website?: unknown;
};

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return fail("Ongeldige aanvraag.", 400);
  }

  const type = body.type;
  if (type !== "contact" && type !== "preorder" && type !== "notify") {
    return fail("Onbekend formuliertype.", 400);
  }
  const formType: FormType = type;
  const nl = body.language !== "en";
  const language: FormLanguage = nl ? "nl" : "en";

  // Honeypot: accept and drop. Answering with an error would tell a bot which
  // field gave it away, and the rare human whose password manager fills a
  // hidden field should not be handed a failure they cannot act on.
  if (str(body.website, 200) !== "") {
    console.warn("Formulier: honeypot gevuld, niet verstuurd.", { type: formType });
    return NextResponse.json({ ok: true });
  }

  const email = str(body.email, MAX.email);
  if (!isEmail(email)) {
    return fail(nl ? "Vul een geldig e-mailadres in." : "Enter a valid email address.", 400);
  }

  const name = str(body.name, MAX.name);
  const message = str(body.message, MAX.message);
  const subject = str(body.subject, MAX.subject);
  const phone = str(body.phone, MAX.phone);

  // Pre-order and notify are about a specific product; it has to be one we list.
  const productId = str(body.productId, 120);
  const product = productId ? getProductById(productId) : undefined;
  if ((formType === "preorder" || formType === "notify") && !product) {
    return fail(nl ? "Onbekend product." : "Unknown product.", 400);
  }

  let quantity = 1;
  if (formType === "preorder") {
    const raw = typeof body.quantity === "number" ? body.quantity : Number(body.quantity);
    if (!Number.isInteger(raw) || raw < 1 || raw > MAX_QUANTITY) {
      return fail(nl ? "Vul een geldig aantal in." : "Enter a valid quantity.", 400);
    }
    quantity = raw;
  }

  if (formType === "contact" && (!name || !message)) {
    return fail(nl ? "Vul je naam en bericht in." : "Fill in your name and message.", 400);
  }
  if (formType === "preorder" && !name) {
    return fail(nl ? "Vul je naam in." : "Fill in your name.", 400);
  }

  const from = company.orderConfirmationFrom;
  if (!from) {
    console.error("Formulier: company.orderConfirmationFrom ontbreekt, kan niets versturen.");
    return fail(nl ? "Verzenden is nu niet mogelijk." : "Sending is not possible right now.", 500);
  }
  const sender = `${company.tradeName} <${from}>`;

  const rows: [string, string][] = [
    [nl ? "Naam" : "Name", name],
    ["E-mail", email],
    [nl ? "Telefoon" : "Phone", phone],
    [nl ? "Onderwerp" : "Subject", subject],
    [nl ? "Product" : "Product", product ? product.name : ""],
    [nl ? "Aantal" : "Quantity", formType === "preorder" ? String(quantity) : ""],
    [nl ? "Taal" : "Language", language],
  ].filter(([, value]) => value !== "") as [string, string][];

  const heading =
    formType === "contact"
      ? `Contactformulier — ${name}`
      : formType === "preorder"
        ? `Pre-order — ${quantity}× ${product!.name}`
        : `Voorraadmelding — ${product!.name}`;

  const shopHtml = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0A0A;color:#E8E8E8;padding:24px;">
      <h2 style="color:#FF6B00;margin:0 0 4px 0;font-size:18px;">${escapeHtml(heading)}</h2>
      <p style="color:#9CA3AF;margin:0 0 20px 0;font-size:13px;">${escapeHtml(company.tradeName)} — via het ${formType}-formulier op de site</p>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `<tr>
            <td style="padding:6px 12px 6px 0;font-size:13px;color:#6B7280;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
            <td style="padding:6px 0;font-size:13px;color:#E8E8E8;">${escapeHtml(value)}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
      ${
        message
          ? `<h3 style="font-size:13px;color:#6B7280;margin:20px 0 6px 0;font-weight:normal;">${nl ? "Bericht" : "Message"}</h3>
             <p style="font-size:14px;color:#E8E8E8;line-height:1.6;white-space:pre-line;margin:0;">${escapeHtml(message)}</p>`
          : ""
      }
      <p style="font-size:12px;color:#6B7280;margin-top:24px;">${nl ? "Antwoorden gaat rechtstreeks naar de afzender." : "Replying goes straight to the sender."}</p>
    </div>
  `;

  const shopSubject =
    formType === "contact"
      ? `Contactformulier${subject ? ` (${subject})` : ""} — ${name}`
      : formType === "preorder"
        ? `Pre-order: ${quantity}× ${product!.name} — ${name}`
        : `Voorraadmelding: ${product!.name} — ${email}`;

  // This send is the actual delivery of the message. It must succeed.
  try {
    await sendEmail({
      from: sender,
      to: company.email,
      replyTo: email,
      subject: shopSubject,
      html: shopHtml,
    });
  } catch (err) {
    console.error("Formulier: bericht naar de shop versturen mislukt:", err);
    return fail(
      nl
        ? `Verzenden is mislukt. Mail ons rechtstreeks op ${company.email}.`
        : `Sending failed. Please email us directly at ${company.email}.`,
      502
    );
  }

  // Courtesy confirmation. A failure here does not undo the message above.
  try {
    await sendEmail({
      from: sender,
      to: email,
      replyTo: company.email,
      subject: customerSubject(formType, language, product?.name),
      html: customerHtml(formType, language, { name, quantity, productName: product?.name, message }),
    });
  } catch (err) {
    console.error("Formulier: bevestiging naar de klant versturen mislukt:", err);
  }

  return NextResponse.json({ ok: true });
}

function customerSubject(type: FormType, language: FormLanguage, productName?: string): string {
  const nl = language === "nl";
  if (type === "contact") return nl ? "We hebben je bericht ontvangen" : "We received your message";
  if (type === "preorder") {
    return nl ? `Je reservering voor ${productName}` : `Your reservation for ${productName}`;
  }
  return nl ? `Voorraadmelding voor ${productName}` : `Stock alert for ${productName}`;
}

function customerHtml(
  type: FormType,
  language: FormLanguage,
  data: { name: string; quantity: number; productName?: string; message: string }
): string {
  const nl = language === "nl";
  const hello = data.name ? `${nl ? "Hoi" : "Hi"} ${escapeHtml(data.name)},` : nl ? "Hoi," : "Hi,";

  let title: string;
  let bodyLines: string[];

  if (type === "contact") {
    title = nl ? "Je bericht is binnen" : "Your message has arrived";
    bodyLines = [
      nl
        ? "Bedankt voor je bericht. We hebben het ontvangen en reageren doorgaans binnen één werkdag."
        : "Thanks for your message. We have received it and usually reply within one business day.",
      ...(data.message
        ? [
            `<span style="color:#6B7280;">${nl ? "Je bericht" : "Your message"}:</span><br><em style="color:#9CA3AF;">${escapeHtml(data.message)}</em>`,
          ]
        : []),
    ];
  } else if (type === "preorder") {
    title = nl ? "Je reservering is genoteerd" : "Your reservation is noted";
    bodyLines = [
      nl
        ? `We hebben je reservering voor <strong style="color:#E8E8E8;">${data.quantity}× ${escapeHtml(data.productName ?? "")}</strong> genoteerd.`
        : `We have noted your reservation for <strong style="color:#E8E8E8;">${data.quantity}× ${escapeHtml(data.productName ?? "")}</strong>.`,
      // The one thing this mail must be unambiguous about.
      nl
        ? "<strong style=\"color:#FF6B00;\">Dit is een reservering, geen betaling.</strong> Er is niets afgeschreven en er komt met deze reservering nog geen koopovereenkomst tot stand."
        : "<strong style=\"color:#FF6B00;\">This is a reservation, not a payment.</strong> Nothing has been charged, and this reservation does not yet form a purchase agreement.",
      nl
        ? "We nemen contact met je op zodra we meer weten over de beschikbaarheid."
        : "We will contact you as soon as we know more about availability.",
    ];
  } else {
    title = nl ? "We houden je op de hoogte" : "We'll keep you posted";
    bodyLines = [
      nl
        ? `We laten het je weten zodra <strong style="color:#E8E8E8;">${escapeHtml(data.productName ?? "")}</strong> weer op voorraad is.`
        : `We will let you know as soon as <strong style="color:#E8E8E8;">${escapeHtml(data.productName ?? "")}</strong> is back in stock.`,
    ];
  }

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0A0A0A;color:#E8E8E8;padding:28px 24px;">
      <div style="font-family:Georgia,serif;font-size:17px;letter-spacing:2px;margin-bottom:22px;">
        <span style="color:#E8E8E8;">&#128128; MAGIC HALLOWEEN</span><span style="color:#FF6B00;"> PROPS</span>
      </div>
      <h1 style="font-family:Georgia,serif;font-size:21px;font-weight:normal;color:#E8E8E8;margin:0 0 16px 0;">${title}</h1>
      <p style="font-size:14px;color:#9CA3AF;margin:0 0 14px 0;">${hello}</p>
      ${bodyLines.map((line) => `<p style="font-size:14px;color:#9CA3AF;line-height:1.7;margin:0 0 14px 0;">${line}</p>`).join("")}
      <p style="font-size:13px;color:#6B7280;line-height:1.7;margin:22px 0 0 0;border-top:1px solid rgba(255,107,0,0.18);padding-top:16px;">
        ${nl ? "Vragen? Antwoord gewoon op deze mail of stuur een bericht naar" : "Questions? Just reply to this email or write to"}
        <a href="mailto:${escapeHtml(company.email)}" style="color:#FF6B00;text-decoration:none;">${escapeHtml(company.email)}</a>.
      </p>
    </div>
  `;
}
