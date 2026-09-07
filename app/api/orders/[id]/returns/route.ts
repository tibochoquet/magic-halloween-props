import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orders/store";
import { authoriseOrder } from "@/lib/orders/session";
import { validateReturn } from "@/lib/orders/validation";
import { canRequestReturn } from "@/lib/orders/types";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const order = authoriseOrder(await orderStore.findById(params.id));
  if (!order) return NextResponse.json({ error: "Geen toegang tot deze bestelling." }, { status: 404 });

  if (!canRequestReturn(order))
    return NextResponse.json(
      { error: "Je kunt pas een retour aanmelden nadat de bestelling is afgeleverd." },
      { status: 409 }
    );

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const parsed = validateReturn(body, order);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const existing = await orderStore.listReturnsForOrder(order.id);
  if (existing.some((r) => r.status !== "rejected"))
    return NextResponse.json(
      { error: "Er is al een retour aangemeld voor deze bestelling." },
      { status: 409 }
    );

  const created = await orderStore.createReturn({
    orderId: order.id,
    status: "requested",
    lines: parsed.value.lines,
    reason: parsed.value.reason,
    note: parsed.value.note,
  });

  return NextResponse.json({ returnRequest: created }, { status: 201 });
}
