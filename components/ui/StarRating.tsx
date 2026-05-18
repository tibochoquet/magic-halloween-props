const star = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.367 2.447a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.366 2.447c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.65 9.384c-.783-.57-.381-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.957z";

export const BADGE_STYLES: Record<string, string> = {
  BESTSELLER: "bg-horror-orange text-black",
  NEW: "bg-emerald-600 text-white",
  PREMIUM: "bg-yellow-600 text-black",
  EXTREME: "bg-red-700 text-white",
  LIMITED: "bg-purple-700 text-white",
};

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  const mutedOpacity = size === "md" ? "text-horror-text-muted/30" : "text-horror-text-muted/40";
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${cls} ${i < Math.floor(rating) ? "text-horror-orange" : mutedOpacity}`} fill="currentColor" viewBox="0 0 20 20">
          <path d={star} />
        </svg>
      ))}
    </div>
  );
}
