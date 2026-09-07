import { NextResponse } from "next/server";
import { orderStore } from "@/lib/orders/store";
import { authoriseOrder } from "@/lib/orders/session";
import { validateReview } from "@/lib/orders/validation";
import { canReview } from "@/lib/orders/types";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const order = authoriseOrder(await orderStore.findById(params.id));
  if (!order) return NextResponse.json({ error: "Geen toegang tot deze bestelling." }, { status: 404 });

  if (!canReview(order))
    return NextResponse.json(
      { error: "Je kunt pas een review schrijven nadat de bestelling is afgeleverd." },
      { status: 409 }
    );

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const parsed = validateReview(body, order);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const existing = await orderStore.listReviewsForOrder(order.id);
  if (existing.some((r) => r.productId === parsed.value.productId))
    return NextResponse.json(
      { error: "Je hebt voor dit product al een review geschreven." },
      { status: 409 }
    );

  const created = await orderStore.createReview({ orderId: order.id, ...parsed.value });
  return NextResponse.json({ review: created }, { status: 201 });
}
