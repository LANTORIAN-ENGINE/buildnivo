"use client";

/** L'IA transversale : ce qu'elle fait, ce qu'elle ne fait jamais sans un humain. */

import { ArrowRight, Cpu, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Chip, CtaLink, FinalCta, PageHero, SectionHeading, SiteSection } from "@/components/site/kit";
import { Reveal, Stagger } from "@/components/site/motion";
import { DictationDemo } from "@/components/site/figures/DictationDemo";

export default function AiPage() {
  const { d } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={d.site.ai.eyebrow}
        title={d.site.ai.title}
        lead={d.site.ai.lead}
        aside={
          <Reveal delay={160} dir="right">
            <div className="rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-6 backdrop-blur-sm">
              <p className="text-[12px] font-bold tracking-[0.1em] text-blue-ink/70 uppercase">
                {d.site.ai.governanceTitle}
              </p>
              <ul className="mt-4 space-y-3">
                {(Object.keys(d.site.ai.governance) as (keyof typeof d.site.ai.governance)[]).map((g) => (
                  <li key={g} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-blue-ink/80">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-ink/55" />
                    {d.site.ai.governance[g]}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        }
      >
        <CtaLink href="/copilote" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
          {d.site.common.seeDemo}
        </CtaLink>
      </PageHero>

      <SiteSection>
        <SectionHeading eyebrow={d.site.ai.eyebrow} title={d.site.ai.demoTitle} lead={d.site.ai.demoHint} />
        <Reveal delay={100} className="mt-8">
          <DictationDemo />
        </Reveal>
      </SiteSection>

      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.nav.ai} title={d.site.ai.capabilitiesTitle} />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={70} itemClassName="h-full">
          {(Object.keys(d.site.ai.capabilities) as (keyof typeof d.site.ai.capabilities)[]).map((c, i) => (
            <article key={c} className="card h-full p-5">
              <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-faint">0{i + 1}</span>
              <h3 className="mt-1.5 text-[14px] font-bold text-ink">{d.site.ai.capabilities[c].name}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{d.site.ai.capabilities[c].text}</p>
            </article>
          ))}
        </Stagger>
      </SiteSection>

      <SiteSection>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading eyebrow={d.site.ai.archTitle} title={d.site.ai.archTitle} />
          <Reveal delay={100}>
            <div className="card p-6">
              <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-ink-faint uppercase">
                <Cpu className="h-4 w-4 text-blue" />
                {d.site.ai.archTitle}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{d.site.ai.arch}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["RAG", "OCR", "Transcription", "Règles métier", "Automatisations"].map((tag) => (
                  <Chip key={tag} tone="blue">
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </SiteSection>

      <FinalCta />
    </>
  );
}
