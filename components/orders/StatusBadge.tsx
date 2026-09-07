import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONE,
  RETURN_STATUS_LABELS,
  RETURN_STATUS_TONE,
  PAYMENT_STATUS_LABELS,
  TONE_CLASSES,
} from "@/lib/orders/labels";
import type { OrderStatus, ReturnStatus, PaymentStatus } from "@/lib/orders/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block px-3 py-1 border text-xs font-bold tracking-wide uppercase ${TONE_CLASSES[ORDER_STATUS_TONE[status]]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  return (
    <span className={`inline-block px-3 py-1 border text-xs font-bold tracking-wide uppercase ${TONE_CLASSES[RETURN_STATUS_TONE[status]]}`}>
      {RETURN_STATUS_LABELS[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const tone = status === "paid" ? "success" : status === "failed" ? "warning" : "neutral";
  return (
    <span className={`inline-block px-3 py-1 border text-xs font-bold tracking-wide uppercase ${TONE_CLASSES[tone]}`}>
      {PAYMENT_STATUS_LABELS[status]}
    </span>
  );
}
