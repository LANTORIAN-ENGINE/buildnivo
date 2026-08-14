"use client";

/** Positionnement : ce que couvrent les autres, et l'angle mort qui reste ouvert. */

import { Check } from "lucide-react";
import { differentiators } from "@/data";
import { useI18n } from "@/lib/i18n";
import { FinalCta, PageHero, SectionHeading, SiteSection } from "@/components/site/kit";
import { Reveal, Stagger } from "@/components/site/motion";
import { CompareGrid } from "@/components/site/figures/CompareGrid";

export default function ComparePage() {
  const { d, t } = useI18n();

  return (
    <>
      <PageHero eyebrow={d.site.compare.eyebrow} title={d.site.compare.title} lead={d.site.compare.lead} />

      <SiteSection>
        <CompareGrid />
        <Reveal delay={140} className="mt-8">
          <div className="rounded-(--radius-card) border border-blue/25 bg-blue-soft/45 p-6">
            <p className="text-[12px] font-bold tracking-[0.1em] text-blue-deep uppercase">{d.site.compare.blindSpotTitle}</p>
            <p className="mt-2 max-w-[86ch] text-[14px] leading-relaxed text-ink">{d.site.compare.blindSpot}</p>
          </div>
        </Reveal>
      </SiteSection>

      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.compare.eyebrow} title={d.site.compare.diffTitle} />
        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" step={60} itemClassName="h-full">
          {differentiators.map((id) => (
            <article key={id} className="card flex h-full items-start gap-3 p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ok-soft text-ok-deep">
                <Check className="h-3.5 w-3.5" />
              </span>
              <p className="text-[13px] leading-relaxed text-ink">{t(`site.compare.diff.${id}`)}</p>
            </article>
          ))}
        </Stagger>
      </SiteSection>

      <FinalCta />
    </>
  );
}
