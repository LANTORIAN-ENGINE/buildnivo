"use client";

/** Studios métier : quatre extensions posées sur le socle Company. */

import { ArrowRight, Layers, ListOrdered } from "lucide-react";
import { keyFigures } from "@/data";
import { useI18n } from "@/lib/i18n";
import { CtaLink, FinalCta, PageHero, SectionHeading, SiteSection, StatBlock } from "@/components/site/kit";
import { CountUp, Reveal } from "@/components/site/motion";
import { StudioCards } from "@/components/site/figures/StudioCards";
import { LevelStack } from "@/components/site/figures/LevelStack";

export default function StudiosPage() {
  const { d } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={d.site.studiosSection.eyebrow}
        title={d.site.studiosSection.title}
        lead={d.site.studiosSection.lead}
        aside={
          <Reveal delay={160} dir="right">
            <div className="grid gap-6 rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-6 backdrop-blur-sm sm:grid-cols-2">
              <StatBlock
                onDark
                value={
                  <>
                    <CountUp to={keyFigures.studioPrice} /> €
                  </>
                }
                label={d.site.pricing.plans.studio.name}
                hint={d.site.common.perMonth}
              />
              <StatBlock onDark value={<CountUp to={4} />} label={d.site.nav.studios} />
            </div>
          </Reveal>
        }
      >
        <CtaLink href="/tarifs" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
          {d.site.common.seePricing}
        </CtaLink>
      </PageHero>

      <SiteSection>
        <StudioCards />

        <Reveal delay={120} className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="h-full rounded-(--radius-card) border border-viz/25 bg-viz-soft/40 p-5">
            <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-viz uppercase">
              <Layers className="h-4 w-4" />
              {d.site.stack.levels.company.name}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{d.site.studiosSection.requirement}</p>
          </div>
          <div className="h-full rounded-(--radius-card) border border-line bg-card p-5">
            <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-ink-faint uppercase">
              <ListOrdered className="h-4 w-4 text-blue" />
              {d.site.nav.studios}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{d.site.studiosSection.order}</p>
          </div>
        </Reveal>
      </SiteSection>

      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.stack.eyebrow} title={d.site.stack.title} lead={d.site.stack.lead} />
        <LevelStack className="mt-10" />
      </SiteSection>

      <FinalCta />
    </>
  );
}
