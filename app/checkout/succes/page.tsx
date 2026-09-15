import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClearCartOnMount from "@/components/pages/ClearCartOnMount";
import { getStripe } from "@/lib/stripe";
import { company } from "@/lib/companyInfo";

export const metadata: Metadata = {
  title: "Je bestelling",
  robots: { index: false, follow: true },
};

// Always re-verify against Stripe — this page must never be a static,
// cacheable "you paid" page.
export const dynamic = "force-dynamic";

/**
 * Reached after a Stripe Checkout redirect. This page is informational only
 * — it re-checks the session with Stripe before showing "paid", but it is
 * NOT the source of truth for fulfilment. That is the webhook
 * (app/api/webhooks/stripe/route.ts), since a visitor can land on this URL
 * without having actually paid (closed tab and reopened it, shared the
 * link, back button after cancelling, ...).
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  let session: Stripe.Checkout.Session | null = null;

  if (searchParams.session_id) {
    try {
      session = await getStripe().checkout.sessions.retrieve(searchParams.session_id);
    } catch (err) {
      console.error("Checkout succes: kon sessie niet ophalen:", err);
    }
  }

  const paid = session?.payment_status === "paid";
  const orderRef = session?.metadata?.orderRef ?? session?.id ?? null;
  const total = session ? (session.amount_total ?? 0) / 100 : null;
  const email = session?.customer_details?.email ?? null;

  return (
    <main id="main" className="min-h-screen bg-horror-black overflow-x-hidden">
      <Header />
      {paid && <ClearCartOnMount />}

      <div className="max-w-xl mx-auto px-5 md:px-8 pt-32 pb-24 text-center">
        {paid ? (
          <>
            <div className="w-20 h-20 mx-auto border-2 border-horror-orange flex items-center justify-center text-horror-orange mb-6">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-cinzel text-3xl font-bold text-horror-text-primary mb-3">
              Bedankt voor je bestelling!
            </h1>
            {orderRef && (
              <p className="text-horror-text-secondary text-sm mb-1">
                Bestelnummer: <span className="text-horror-text-primary font-medium">{orderRef}</span>
              </p>
            )}
            {total !== null && (
              <p className="text-horror-text-secondary text-sm mb-6">
                Totaal betaald: €{total.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
              </p>
            )}
            <p className="text-horror-text-muted text-sm leading-relaxed mb-8">
              {email ? `Een bevestiging volgt op ${email}. ` : ""}
              We verwerken je bestelling en nemen contact met je op zodra deze wordt verzonden.
            </p>
            <Link href="/shop" className="btn-primary">
              Verder winkelen
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-cinzel text-2xl font-bold text-horror-text-primary mb-3">
              We konden je betaling niet bevestigen
            </h1>
            <p className="text-horror-text-secondary text-sm leading-relaxed mb-8">
              Is er wel geld afgeschreven? Neem contact op via{" "}
              <a href={`mailto:${company.email}`} className="text-horror-orange hover:underline">
                {company.email}
              </a>
              {orderRef ? <> en vermeld bestelnummer {orderRef}.</> : "."}
            </p>
            <Link href="/shop" className="btn-outline">
              Terug naar de shop
            </Link>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
