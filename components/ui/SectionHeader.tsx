interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div className={`mb-14 ${centered ? "text-center" : ""}`}>
      <div
        className={`inline-flex items-center gap-3 mb-5 ${centered ? "justify-center" : ""}`}
      >
        <div className="h-px w-10 bg-horror-orange/50" />
        <span className="text-horror-orange text-xs font-semibold tracking-[0.25em] uppercase font-inter">
          {eyebrow}
        </span>
        <div className="h-px w-10 bg-horror-orange/50" />
      </div>

      <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-horror-text-primary leading-tight">
        {title}{" "}
        {titleAccent && (
          <span className="text-horror-orange text-glow">{titleAccent}</span>
        )}
      </h2>

      {subtitle && (
        <p
          className={`mt-5 text-horror-text-secondary text-base md:text-lg leading-relaxed max-w-2xl ${
            centered ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
