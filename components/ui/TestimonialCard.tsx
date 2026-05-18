import type { Testimonial } from "@/types";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-horror-orange" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.367 2.447a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.366 2.447c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.65 9.384c-.783-.57-.381-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card-horror p-8 flex flex-col gap-6 relative overflow-hidden group">
      {/* Subtle corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: "radial-gradient(circle at 100% 0%, rgba(255,107,0,0.08) 0%, transparent 70%)" }}
      />

      {/* Quote mark */}
      <div className="flex items-start justify-between">
        <svg className="w-10 h-10 text-horror-orange/30" fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8a8 8 0 007.9-7.2c0-.1.1-.5.1-.8 0-4.4-3.6-8-8-8zm0 13a5 5 0 110-10 5 5 0 010 10zM26 8c-4.4 0-8 3.6-8 8s3.6 8 8 8a8 8 0 007.9-7.2c0-.1.1-.5.1-.8 0-4.4-3.6-8-8-8zm0 13a5 5 0 110-10 5 5 0 010 10z" />
        </svg>
        <Stars count={testimonial.rating} />
      </div>

      {/* Content */}
      <blockquote className="text-horror-text-secondary text-sm leading-relaxed flex-1 italic">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-horror-orange/20 to-transparent" />

      {/* Author */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-horror-orange/10 border border-horror-orange/25 flex items-center justify-center flex-shrink-0">
          <span className="text-horror-orange text-xs font-bold font-cinzel">
            {testimonial.initials}
          </span>
        </div>
        <div>
          <p className="text-horror-text-primary font-semibold text-sm">
            {testimonial.name}
          </p>
          <p className="text-horror-text-muted text-xs mt-0.5">
            {testimonial.role} · {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  );
}
