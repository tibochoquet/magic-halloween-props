"use client";

import { useState } from "react";
import type { Order } from "@/lib/orders/types";

export default function ReviewForm({
  order,
  reviewedProductIds,
  onDone,
  onCancel,
}: {
  order: Order;
  reviewedProductIds: string[];
  onDone: (productId: string) => void;
  onCancel: () => void;
}) {
  const available = order.lines.filter((l) => !reviewedProductIds.includes(l.productId));
  const [productId, setProductId] = useState(available[0]?.productId ?? "");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body, displayName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
        return;
      }
      onDone(productId);
    } catch {
      setError("We konden geen verbinding maken. Probeer het opnieuw.");
    } finally {
      setSaving(false);
    }
  }

  if (available.length === 0) {
    return (
      <div className="border border-horror-border bg-horror-card p-5">
        <p className="text-horror-text-secondary text-sm">
          Je hebt voor alle producten uit deze bestelling al een review geschreven. Bedankt!
        </p>
        <button type="button" onClick={onCancel} className="btn-outline justify-center mt-4">
          Sluiten
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-horror-orange/40 bg-horror-card p-5 md:p-6">
      <h3 className="font-cinzel text-base font-bold text-horror-text-primary mb-5">Review schrijven</h3>

      {available.length > 1 && (
        <div className="flex flex-col gap-1.5 mb-5">
          <label htmlFor="reviewProduct" className="text-horror-text-muted text-xs tracking-widest uppercase">
            Product
          </label>
          <select
            id="reviewProduct"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="input-horror"
          >
            {available.map((l) => (
              <option key={l.productId} value={l.productId}>{l.name}</option>
            ))}
          </select>
        </div>
      )}

      <fieldset className="mb-5">
        <legend className="text-horror-text-muted text-xs tracking-widest uppercase mb-2">Beoordeling</legend>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} van 5 sterren`}
              aria-pressed={rating === n}
              className={`w-11 h-11 border text-lg transition-colors duration-200 ${
                n <= rating
                  ? "border-horror-orange/60 bg-horror-orange/10 text-horror-orange"
                  : "border-horror-border text-horror-text-muted hover:border-horror-orange/40"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5 mb-4">
        <label htmlFor="reviewTitle" className="text-horror-text-muted text-xs tracking-widest uppercase">Titel</label>
        <input
          id="reviewTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          placeholder="Bijvoorbeeld: indrukwekkend groot en heel eng"
          className="input-horror"
        />
      </div>

      <div className="flex flex-col gap-1.5 mb-4">
        <label htmlFor="reviewBody" className="text-horror-text-muted text-xs tracking-widest uppercase">Je review</label>
        <textarea
          id="reviewBody"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          maxLength={4000}
          placeholder="Hoe beviel het product? Waar heb je hem neergezet?"
          className="input-horror resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label htmlFor="reviewName" className="text-horror-text-muted text-xs tracking-widest uppercase">
          Weergavenaam
        </label>
        <input
          id="reviewName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          maxLength={60}
          placeholder="Bijvoorbeeld: Jan uit Utrecht"
          className="input-horror"
        />
        <p className="text-horror-text-muted text-xs">Deze naam is zichtbaar bij je review.</p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400 bg-red-950/30 border border-red-700/50 px-4 py-3 mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="submit" disabled={saving} className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? "Bezig met versturen…" : "Review versturen"}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline justify-center">
          Annuleren
        </button>
      </div>
    </form>
  );
}
