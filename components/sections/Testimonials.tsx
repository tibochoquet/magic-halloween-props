"use client";

import { testimonials } from "@/data";
import TestimonialCard from "@/components/ui/TestimonialCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslation } from "@/hooks/useTranslation";

export default function Testimonials() {
  const t = useTranslation();

  return (
    <section
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden -mt-px"
      style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0C0A0F 45%, #0A0A0E 75%, #0A0A0A 100%)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-b from-horror-black to-transparent" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle at 0% 50%, rgba(255,107,0,0.05) 0%, transparent 70%)" }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 50%, rgba(139,0,0,0.06) 0%, transparent 70%)" }} />

      {/* Cinematic haze */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[-15%] right-[-15%] h-[55%] animate-fog-slow" style={{ background: "radial-gradient(ellipse at 45% 50%, rgba(18,10,8,0.06) 0%, transparent 58%)", filter: "blur(52px)" }} />
        <div className="absolute bottom-0 left-[-10%] right-[-10%] h-[30%] animate-fog-medium" style={{ background: "radial-gradient(ellipse at 55% 90%, rgba(15,8,6,0.05) 0%, transparent 55%)", filter: "blur(35px)" }} />
      </div>

      {/* Sparse ember particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[14%] left-[22%] w-px h-px rounded-full bg-horror-orange/10 animate-ember" style={{ animationDelay: "1.1s", animationDuration: "7.5s" }} />
        <div className="absolute top-[52%] left-[82%] w-px h-px rounded-full bg-horror-orange/10 animate-ember" style={{ animationDelay: "2.8s", animationDuration: "8.2s" }} />
        <div className="absolute top-[72%] left-[44%] w-px h-px rounded-full bg-horror-orange/15 animate-ember" style={{ animationDelay: "0.5s", animationDuration: "6.8s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeader
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
          titleAccent={t.testimonials.titleAccent}
          subtitle={t.testimonials.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
