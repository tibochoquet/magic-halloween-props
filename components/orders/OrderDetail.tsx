"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order, ReturnRequest } from "@/lib/orders/types";
import { OrderStatusBadge, PaymentStatusBadge, ReturnStatusBadge } from "@/components/orders/StatusBadge";
import {
  formatCents,
  formatDate,
  RETURN_STATUS_FLOW,
  RETURN_STATUS_LABELS,
} from "@/lib/orders/labels";
import { RETURN_REASON_LABELS } from "@/lib/orders/validation";
import ReturnWizard from "@/components/orders/ReturnWizard";
import ReviewForm from "@/components/orders/ReviewForm";
import { company } from "@/lib/companyInfo";
import { returnPolicy } from "@/lib/shopTerms";

type Payload = {
  order: Order & { totalCents: number };
  tracking: { carrierLabel: string; code: string; url: string; shippedAt: string | null } | null;
  returns: ReturnRequest[];
  reviewedProductIds: string[];
  canReview: boolean;
  canRequestReturn: boolean;
};

export default function OrderDetail({ orderId }: { orderId: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"none" | "return" | "review">("none");
  const [justReturned, setJustReturned] = useState<ReturnRequest | null>(null);
  const [reviewThanks, setReviewThanks] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "We konden deze bestelling niet laden.");
        return;
      }
      setData(json as Payload);
    } catch {
      setError("We konden geen verbinding maken. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-horror-text-muted text-sm py-16">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Bestelling laden…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12">
        <div role="alert" className="p-5 border border-red-700/50 bg-red-950/20 mb-6">
          <p className="font-cinzel text-base font-bold text-red-400 mb-1.5">Geen toegang</p>
          <p className="text-horror-text-secondary text-sm leading-relaxed">
            {error ?? "We konden deze bestelling niet vinden."} Zoek je bestelling opnieuw op met je
            bestelnummer en e-mailadres.
          </p>
        </div>
        <Link href="/mijn-bestelling" className="btn-primary justify-center inline-flex">
          Bestelling opzoeken
        </Link>
      </div>
    );
  }

  const { order, tracking, returns, reviewedProductIds, canReview, canRequestReturn } = data;
  const activeReturn = returns.find((r) => r.status !== "rejected") ?? null;
  const subtotal = order.lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="border border-horror-border bg-horror-card p-5 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-horror-text-primary">
              Bestelling {order.orderNumber}
            </h1>
            <p className="text-horror-text-muted text-sm mt-1">
              Geplaatst op {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {/* Track & Trace — the most prominent element when available */}
        {tracking ? (
          <div className="p-4 md:p-5 border border-horror-orange/40 bg-horror-orange/5">
            <p className="font-cinzel text-base font-bold text-horror-text-primary mb-1">
              {order.status === "delivered" ? "Je bestelling is afgeleverd 📦" : "Je bestelling is onderweg 📦"}
            </p>
            <p className="text-horror-text-secondary text-sm mb-4">
              Verzonden met {tracking.carrierLabel} · Trackingcode{" "}
              <span className="font-mono text-horror-text-primary">{tracking.code}</span>
            </p>
            <a
              href={tracking.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center inline-flex"
            >
              Track &amp; Trace bekijken
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="p-4 border border-horror-border bg-horror-black/40">
            <p className="text-horror-text-primary text-sm font-medium mb-1">Nog geen Track &amp; Trace</p>
            <p className="text-horror-text-muted text-sm leading-relaxed">
              Zodra je pakket is overgedragen aan de vervoerder verschijnt de trackingcode hier.
            </p>
          </div>
        )}
      </div>

      {/* Products */}
      <div className="border border-horror-border bg-horror-card p-5 md:p-7">
        <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-4">
          Producten
        </h2>
        <div className="border border-horror-border divide-y divide-horror-border">
          {order.lines.map((l) => (
            <div key={l.productId} className="flex justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <Link href={`/products/${l.productId}`} className="text-horror-text-primary text-sm font-medium hover:text-horror-orange transition-colors">
                  {l.name}
                </Link>
                <p className="text-horror-text-muted text-xs mt-0.5">
                  {l.quantity}× {formatCents(l.unitPriceCents)}
                </p>
              </div>
              <span className="text-horror-text-primary text-sm font-medium whitespace-nowrap">
                {formatCents(l.unitPriceCents * l.quantity)}
              </span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 text-sm text-horror-text-muted">
            <span>Subtotaal</span>
            <span>{formatCents(subtotal)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm text-horror-text-muted">
            <span>Verzending</span>
            <span className={order.shippingCents === 0 ? "text-horror-orange" : ""}>
              {order.shippingCents === 0 ? "Gratis" : formatCents(order.shippingCents)}
            </span>
          </div>
          <div className="flex justify-between px-4 py-3 text-base font-bold text-horror-text-primary">
            <span>Totaal</span>
            <span>{formatCents(order.totalCents)}</span>
          </div>
        </div>
        <p className="text-horror-text-muted text-xs mt-2">Inclusief btw</p>
      </div>

      {/* Delivery address */}
      <div className="border border-horror-border bg-horror-card p-5 md:p-7">
        <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-3">
          Afleveradres
        </h2>
        <p className="text-horror-text-secondary text-sm leading-relaxed">
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          <br />
          {order.shippingAddress.street} {order.shippingAddress.houseNumber}
          <br />
          {order.shippingAddress.postcode} {order.shippingAddress.city}
          <br />
          {order.shippingAddress.country}
        </p>
      </div>

      {/* Return status, if any */}
      {activeReturn && (
        <div className="border border-horror-border bg-horror-card p-5 md:p-7">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary">
              Retourstatus
            </h2>
            <ReturnStatusBadge status={activeReturn.status} />
          </div>

          <ol className="flex flex-col sm:flex-row gap-3 sm:gap-0 mb-6">
            {RETURN_STATUS_FLOW.map((s, i) => {
              const currentIdx = RETURN_STATUS_FLOW.indexOf(activeReturn.status);
              const done = currentIdx >= i && currentIdx !== -1;
              return (
                <li key={s} className="flex-1 flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                  <div className="flex items-center gap-2 sm:w-full">
                    <span
                      className={`w-6 h-6 flex-shrink-0 flex items-center justify-center border text-[10px] font-bold ${
                        done ? "border-horror-orange bg-horror-orange text-black" : "border-horror-border text-horror-text-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {i < RETURN_STATUS_FLOW.length - 1 && (
                      <span className={`hidden sm:block h-px flex-1 ${done ? "bg-horror-orange/50" : "bg-horror-border"}`} />
                    )}
                  </div>
                  <span className={`text-xs ${done ? "text-horror-text-primary" : "text-horror-text-muted"}`}>
                    {RETURN_STATUS_LABELS[s]}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="text-sm text-horror-text-secondary space-y-1 mb-5">
            <p>Aangemeld op {formatDate(activeReturn.createdAt)}</p>
            <p>Reden: {RETURN_REASON_LABELS[activeReturn.reason]}</p>
            {activeReturn.note && <p className="text-horror-text-muted">Toelichting: {activeReturn.note}</p>}
          </div>

          {/* Return address is revealed ONLY after a return is registered. */}
          {returnPolicy.returnAddress && (
            <div className="p-4 border border-horror-orange/40 bg-horror-orange/5">
              <p className="font-cinzel text-sm font-bold text-horror-text-primary mb-2">Retouradres</p>
              <p className="text-horror-text-secondary text-sm whitespace-pre-line leading-relaxed">
                {returnPolicy.returnAddress}
              </p>
              <p className="text-horror-text-muted text-xs mt-3 leading-relaxed">
                Verstuur je pakket via DHL of DPD. Verpak het product goed en voeg je bestelnummer{" "}
                <span className="text-horror-text-secondary font-mono">{order.orderNumber}</span> bij.
                Bewaar je verzendbewijs tot de terugbetaling is verwerkt.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Just-submitted confirmation */}
      {justReturned && (
        <div role="status" className="border border-emerald-700/50 bg-emerald-950/20 p-5 md:p-7">
          <p className="font-cinzel text-lg font-bold text-emerald-400 mb-2">Je retour is aangemeld</p>
          <p className="text-horror-text-secondary text-sm leading-relaxed">
            We hebben je retouraanvraag ontvangen. Hierboven zie je het retouradres en de status.
            We nemen contact met je op zodra we je pakket hebben ontvangen.
          </p>
        </div>
      )}
      {reviewThanks && (
        <div role="status" className="border border-emerald-700/50 bg-emerald-950/20 p-5 md:p-7">
          <p className="font-cinzel text-lg font-bold text-emerald-400 mb-2">Bedankt voor je review!</p>
          <p className="text-horror-text-secondary text-sm leading-relaxed">
            We hebben je review ontvangen. Andere klanten hebben er veel aan.
          </p>
        </div>
      )}

      {/* Actions */}
      {mode === "return" ? (
        <ReturnWizard
          order={order}
          onCancel={() => setMode("none")}
          onDone={(r) => {
            setJustReturned(r);
            setMode("none");
            load();
          }}
        />
      ) : mode === "review" ? (
        <ReviewForm
          order={order}
          reviewedProductIds={reviewedProductIds}
          onCancel={() => setMode("none")}
          onDone={() => {
            setReviewThanks(true);
            setMode("none");
            load();
          }}
        />
      ) : (
        <div className="border border-horror-border bg-horror-card p-5 md:p-7">
          <h2 className="font-cinzel text-sm font-bold tracking-widest uppercase text-horror-text-primary mb-4">
            Wat wil je doen?
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {canRequestReturn && !activeReturn && (
              <button type="button" onClick={() => setMode("return")} className="btn-primary justify-center">
                Retour aanmelden
              </button>
            )}
            {canReview && (
              <button type="button" onClick={() => setMode("review")} className="btn-outline justify-center">
                Review schrijven
              </button>
            )}
            <a href={`mailto:${company.email}?subject=${encodeURIComponent(`Vraag over bestelling ${order.orderNumber}`)}`} className="btn-outline justify-center">
              Mail ons
            </a>
          </div>
          {!canRequestReturn && (
            <p className="text-horror-text-muted text-xs mt-4 leading-relaxed">
              Retour aanmelden en een review schrijven kan zodra je bestelling is afgeleverd.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
