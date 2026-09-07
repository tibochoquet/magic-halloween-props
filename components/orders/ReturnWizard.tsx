"use client";

import { useState } from "react";
import type { Order, ReturnReason, ReturnRequest } from "@/lib/orders/types";
import { RETURN_REASON_LABELS } from "@/lib/orders/validation";
import { returnPolicy } from "@/lib/shopTerms";

type Step = 1 | 2 | 3;

export default function ReturnWizard({
  order,
  onDone,
  onCancel,
}: {
  order: Order;
  onDone: (r: ReturnRequest) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selected = Object.entries(qty).filter(([, q]) => q > 0);

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: selected.map(([productId, quantity]) => ({ productId, quantity })),
          reason,
          note: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
        return;
      }
      onDone(data.returnRequest as ReturnRequest);
    } catch {
      setError("We konden geen verbinding maken. Probeer het opnieuw.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-horror-orange/40 bg-horror-card p-5 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h3 className="font-cinzel text-base font-bold text-horror-text-primary">Retour aanmelden</h3>
        <span className="text-horror-text-muted text-xs tracking-widest uppercase">Stap {step} van 3</span>
      </div>

      {/* progress */}
      <div className="flex gap-1.5 mb-6" aria-hidden="true">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 ${s <= step ? "bg-horror-orange" : "bg-horror-border"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="text-horror-text-secondary text-sm mb-4">
            Welke producten wil je retourneren, en hoeveel?
          </p>
          <div className="space-y-3">
            {order.lines.map((l) => (
              <div key={l.productId} className="flex items-center justify-between gap-4 p-3 border border-horror-border">
                <div className="min-w-0">
                  <p className="text-horror-text-primary text-sm font-medium leading-snug">{l.name}</p>
                  <p className="text-horror-text-muted text-xs mt-0.5">Besteld: {l.quantity}×</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <label htmlFor={`qty-${l.productId}`} className="text-horror-text-muted text-xs uppercase tracking-wide">
                    Aantal
                  </label>
                  <input
                    id={`qty-${l.productId}`}
                    type="number"
                    min={0}
                    max={l.quantity}
                    value={qty[l.productId] ?? 0}
                    onChange={(e) =>
                      setQty((p) => ({
                        ...p,
                        [l.productId]: Math.max(0, Math.min(l.quantity, Number(e.target.value) || 0)),
                      }))
                    }
                    className="input-horror w-20 text-center"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
              className="btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Volgende
            </button>
            <button type="button" onClick={onCancel} className="btn-outline justify-center">
              Annuleren
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-horror-text-secondary text-sm mb-4">Wat is de reden van je retour?</p>
          <div className="space-y-2 mb-5">
            {(Object.keys(RETURN_REASON_LABELS) as ReturnReason[]).map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors duration-200 ${
                  reason === r ? "border-horror-orange/60 bg-horror-orange/5" : "border-horror-border hover:border-horror-border/70"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-horror-orange"
                />
                <span className="text-horror-text-primary text-sm">{RETURN_REASON_LABELS[r]}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label htmlFor="returnNote" className="text-horror-text-muted text-xs tracking-widest uppercase">
              Toelichting (optioneel)
            </label>
            <textarea
              id="returnNote"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bijvoorbeeld: welk onderdeel beschadigd is."
              className="input-horror resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!reason}
              className="btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Volgende
            </button>
            <button type="button" onClick={() => setStep(1)} className="btn-outline justify-center">
              Terug
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="text-horror-text-secondary text-sm mb-4">Controleer je retouraanvraag.</p>
          <div className="border border-horror-border divide-y divide-horror-border mb-5">
            {selected.map(([pid, q]) => {
              const line = order.lines.find((l) => l.productId === pid);
              return (
                <div key={pid} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-horror-text-secondary">{line?.name}</span>
                  <span className="text-horror-text-primary font-medium">{q}×</span>
                </div>
              );
            })}
            <div className="flex justify-between gap-4 px-4 py-3 text-sm">
              <span className="text-horror-text-muted">Reden</span>
              <span className="text-horror-text-primary text-right">
                {reason ? RETURN_REASON_LABELS[reason] : ""}
              </span>
            </div>
            {note.trim() && (
              <div className="px-4 py-3 text-sm">
                <span className="text-horror-text-muted block mb-1">Toelichting</span>
                <span className="text-horror-text-secondary">{note.trim()}</span>
              </div>
            )}
          </div>

          {returnPolicy.paidBy === null && (
            <p className="text-horror-text-muted text-xs mb-4 leading-relaxed">
              We nemen contact met je op over de verzendkosten van deze retour.
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-400 bg-red-950/30 border border-red-700/50 px-4 py-3 mb-4">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Bezig met versturen…" : "Retour aanmelden"}
            </button>
            <button type="button" onClick={() => setStep(2)} className="btn-outline justify-center">
              Terug
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
