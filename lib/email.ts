import { Resend } from "resend";

/**
 * One place that talks to Resend.
 *
 * Two things here are easy to get wrong and expensive to get wrong twice:
 *
 * 1. resend.emails.send() does NOT throw on failure — it resolves with
 *    { data: null, error } (an invalid API key comes back as a normal
 *    response). A try/catch around the call alone silently swallows that,
 *    so the error has to be checked explicitly.
 * 2. A missing RESEND_API_KEY throws here. Callers decide what that means:
 *    the Stripe webhook logs it and moves on (the payment already
 *    succeeded), the forms route turns it into an error for the visitor —
 *    who must never be told "sent" when nothing was.
 */
export async function sendEmail(payload: Parameters<Resend["emails"]["send"]>[0]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY ontbreekt — er is geen e-mail verstuurd.");
  }

  const { error } = await new Resend(apiKey).emails.send(payload);
  if (error) {
    throw new Error(`Resend gaf een fout terug: ${error.message}`);
  }
}

/** Escapes text that goes into an HTML mail body. Every visitor-supplied value passes through this. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
