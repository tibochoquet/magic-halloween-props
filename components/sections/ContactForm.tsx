"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import { company } from "@/lib/companyInfo";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [website, setWebsite] = useState(""); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslation().contact.form;
  const { language } = useLanguage();
  const nl = language === "nl";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const fallbackError = nl
    ? `Verzenden is mislukt. Mail ons rechtstreeks op ${company.email}.`
    : `Sending failed. Please email us directly at ${company.email}.`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", language, website, ...form }),
      });
      // Success only on a 2xx — never claim a message arrived that didn't.
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? fallbackError);
        return;
      }
      setSubmitted(true);
    } catch {
      setError(fallbackError);
    } finally {
      setLoading(false);
    }
  }


  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-horror-orange flex items-center justify-center text-horror-orange">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-cinzel font-bold text-xl text-horror-text-primary">{t.successTitle}</p>
        <p className="text-horror-text-muted text-sm max-w-xs">
          {t.successBody}{" "}
          <span className="text-horror-orange">{company.email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-horror-text-muted text-xs tracking-widest uppercase">{t.name}</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder={t.namePlaceholder} className="input-horror" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-horror-text-muted text-xs tracking-widest uppercase">{t.email}</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder={t.emailPlaceholder} className="input-horror" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-horror-text-muted text-xs tracking-widest uppercase">{t.subject}</label>
        <select name="subject" value={form.subject} onChange={handleChange} className="input-horror">
          <option value="">{t.subjectDefault}</option>
          {t.subjects.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-horror-text-muted text-xs tracking-widest uppercase">{t.message}</label>
        <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder={t.messagePlaceholder} className="input-horror resize-none" />
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {error && (
        <p role="alert" className="text-sm text-red-400 bg-red-950/30 border border-red-700/50 px-4 py-3">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed justify-center">
        {loading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>
            {t.submit}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
