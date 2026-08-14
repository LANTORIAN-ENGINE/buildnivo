"use client";

/**
 * Demande de démonstration. Formulaire de démonstration : rien n'est envoyé, l'état
 * vit dans le composant — c'est dit explicitement à l'utilisateur après l'envoi.
 */

import { useState } from "react";
import { Check, Mail, MonitorPlay, Phone } from "lucide-react";
import { contactChannels, demoSteps } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { FinalCta, PageHero, SectionHeading, SiteSection } from "@/components/site/kit";
import { Reveal, Stagger } from "@/components/site/motion";

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  demo: MonitorPlay,
  phone: Phone,
  email: Mail,
};

const fieldBase =
  "mt-1.5 h-10 w-full rounded-[10px] border border-line bg-card px-3 text-[13px] text-ink transition-colors duration-150 placeholder:text-ink-faint focus:border-blue focus:outline-none";

export default function ContactPage() {
  const { d, t } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setTimeout(() => setState("sent"), 700);
  };

  return (
    <>
      <PageHero eyebrow={d.site.contact.eyebrow} title={d.site.contact.title} lead={d.site.contact.lead} />

      <SiteSection>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Formulaire */}
          <Reveal>
            <form onSubmit={submit} className="card p-6">
              {state === "sent" ? (
                <div className="pop-in flex flex-col items-start gap-3 py-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ok-soft text-ok-deep">
                    <Check className="h-5 w-5" />
                  </span>
                  <p className="text-[16px] font-bold text-ink">{d.site.contact.form.sent}</p>
                  <p className="max-w-[54ch] text-[13px] leading-relaxed text-ink-soft">{d.site.contact.form.sentHint}</p>
                  <button
                    type="button"
                    onClick={() => setState("idle")}
                    className="mt-2 rounded-[10px] border border-line px-4 py-2 text-[12.5px] font-semibold text-ink-soft transition-colors duration-150 hover:border-blue/40 hover:text-blue-deep"
                  >
                    {d.common.edit}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-[12px] font-semibold text-ink">
                      {d.site.contact.form.name}
                      <input required name="name" className={fieldBase} autoComplete="name" />
                    </label>
                    <label className="block text-[12px] font-semibold text-ink">
                      {d.site.contact.form.company}
                      <input required name="company" className={fieldBase} autoComplete="organization" />
                    </label>
                    <label className="block text-[12px] font-semibold text-ink">
                      {d.site.contact.form.role}
                      <input name="role" placeholder={d.site.contact.form.rolePlaceholder} className={fieldBase} />
                    </label>
                    <label className="block text-[12px] font-semibold text-ink">
                      {d.site.contact.form.size}
                      <select name="size" className={cn(fieldBase, "appearance-none")} defaultValue="pme">
                        {(Object.keys(d.site.contact.form.sizes) as (keyof typeof d.site.contact.form.sizes)[]).map((s) => (
                          <option key={s} value={s}>
                            {d.site.contact.form.sizes[s]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-[12px] font-semibold text-ink">
                      {d.site.contact.form.email}
                      <input required type="email" name="email" className={fieldBase} autoComplete="email" />
                    </label>
                    <label className="block text-[12px] font-semibold text-ink">
                      {d.site.contact.form.phone}
                      <input name="phone" type="tel" className={fieldBase} autoComplete="tel" />
                    </label>
                  </div>

                  <label className="mt-4 block text-[12px] font-semibold text-ink">
                    {d.site.contact.form.message}
                    <textarea
                      name="message"
                      rows={4}
                      placeholder={d.site.contact.form.messagePlaceholder}
                      className={cn(fieldBase, "h-auto py-2.5 leading-relaxed")}
                    />
                  </label>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="sheen-host relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-[11px] bg-blue px-5 text-[13.5px] font-bold text-blue-ink transition-colors duration-150 hover:bg-blue-deep disabled:opacity-60"
                    >
                      <span className="sheen pointer-events-none absolute inset-y-0 -left-8 w-10 bg-white/25" aria-hidden="true" />
                      <span className="relative">
                        {state === "sending" ? d.site.contact.form.sending : d.site.contact.form.submit}
                      </span>
                    </button>
                    <p className="text-[11.5px] text-ink-faint">{d.site.common.mockNotice}</p>
                  </div>
                </>
              )}
            </form>
          </Reveal>

          {/* Canaux */}
          <div className="space-y-3">
            {contactChannels.map((c, i) => {
              const Icon = channelIcons[c];
              return (
                <Reveal key={c} delay={i * 90} dir="right">
                  <article className="card flex items-start gap-3 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-soft text-blue">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-[13.5px] font-bold text-ink">{t(`site.contact.channels.${c}.name`)}</h2>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{t(`site.contact.channels.${c}.text`)}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </SiteSection>

      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.contact.stepsTitle} title={d.site.contact.stepsTitle} />
        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" step={80} itemClassName="h-full">
          {demoSteps.map((step, i) => (
            <article key={step} className="card h-full p-5">
              <span className="font-mono text-[11px] tracking-[0.14em] text-blue">0{i + 1}</span>
              <h3 className="mt-1.5 text-[13.5px] font-bold text-ink">{t(`site.contact.steps.${step}.name`)}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{t(`site.contact.steps.${step}.text`)}</p>
            </article>
          ))}
        </Stagger>
      </SiteSection>

      <FinalCta />
    </>
  );
}
