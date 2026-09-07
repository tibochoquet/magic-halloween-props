import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orders/store";
import { validateLookup } from "@/lib/orders/validation";
import { grantOrderAccess } from "@/lib/orders/session";

/** Deliberately vague: never reveal whether the number or the email was wrong. */
const NOT_FOUND_MESSAGE =
  "We konden geen bestelling vinden met deze gegevens. Controleer je bestelnummer en e-mailadres en probeer het opnieuw.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const parsed = validateLookup(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const order = await orderStore.findByNumberAndEmail(parsed.value.orderNumber, parsed.value.email);
  if (!order) {
    // Same status and message whether the order is absent or the email mismatches,
    // so this endpoint cannot be used to enumerate valid order numbers.
    return NextResponse.json({ error: NOT_FOUND_MESSAGE }, { status: 404 });
  }

  grantOrderAccess([order.id]);
  return NextResponse.json({ orderId: order.id });
}
