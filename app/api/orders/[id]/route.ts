import { NextResponse } from "next/server";
import { orderStore, orderStorageConfigured } from "@/lib/orders/store";
import { authoriseOrder } from "@/lib/orders/session";
import { trackingView } from "@/lib/orders/tracking";
import { orderTotalCents, canReview, canRequestReturn } from "@/lib/orders/types";

const NOT_AVAILABLE =
  "Het online besteloverzicht is nog niet beschikbaar. Mail ons je bestelnummer, dan helpen we je direct verder.";


export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!orderStorageConfigured)
    return NextResponse.json({ error: NOT_AVAILABLE }, { status: 503 });

  const order = authoriseOrder(await orderStore.findById(params.id));
  if (!order) return NextResponse.json({ error: "Geen toegang tot deze bestelling." }, { status: 404 });

  const [returns, reviews] = await Promise.all([
    orderStore.listReturnsForOrder(order.id),
    orderStore.listReviewsForOrder(order.id),
  ]);

  return NextResponse.json({
    order: { ...order, totalCents: orderTotalCents(order) },
    tracking: trackingView(order.shipment),
    returns,
    reviewedProductIds: reviews.map((r) => r.productId),
    canReview: canReview(order),
    canRequestReturn: canRequestReturn(order),
  });
}
