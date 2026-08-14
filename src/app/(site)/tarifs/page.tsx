"use client";

/** Grille tarifaire complète : offres, socle gratuit permanent, questions de prix. */

import { ArrowRight, Info } from "lucide-react";
import { keyFigures } from "@/data";
import { useI18n } from "@/lib/i18n";
import { CtaLink, FinalCta, PageHero, SectionHeading, SiteSection, StatBlock } from "@/components/site/kit";
import { CountUp, Reveal } from "@/components/site/motion";
import { FreeTierTable, PricingCards } from "@/components/site/figures/PricingCards";
import { FaqAccordion } from "@/components/site/figures/FaqAccordion";

export default function PricingPage() {
  const { d } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={d.site.pricing.eyebrow}
        title={d.site.pricing.title}
        lead={d.site.pricing.lead}
        aside={
          <Reveal delay={160} dir="right">
            <div className="grid gap-6 rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-6 backdrop-blur-sm sm:grid-cols-2">
              <StatBlock
                onDark
                value={
                  <>
                    <CountUp to={keyFigures.projectPrice} /> €
                  </>
                }
                label={d.site.pricing.plans.project.name}
                hint={d.site.stack.levels.project.priceLabel}
              />
              <StatBlock
                onDark
                value={
                  <>
                    <CountUp to={keyFigures.essentialPrice} /> €
                  </>
                }
                label={d.site.pricing.familyCompany}
                hint={d.site.stack.levels.company.priceLabel}
              />
            </div>
          </Reveal>
        }
      >
        <CtaLink href="/connexion" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
          {d.site.nav.demo}
        </CtaLink>
      </PageHero>

      <SiteSection>
        <PricingCards />
      </SiteSection>

      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.common.free} title={d.site.pricing.freeTitle} lead={d.site.pricing.freeLead} />
        <Reveal delay={100} className="mt-8">
          <FreeTierTable />
        </Reveal>
        <Reveal delay={140} className="mt-5">
          <p className="flex max-w-[86ch] items-start gap-2.5 rounded-(--radius-card) border border-line bg-paper p-5 text-[12.5px] leading-relaxed text-ink-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
            {d.site.pricing.crNote}
          </p>
        </Reveal>
      </SiteSection>

      <SiteSection>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading eyebrow={d.site.faq.eyebrow} title={d.site.faq.title} lead={d.site.common.mockNotice} />
          <Reveal delay={100}>
            <FaqAccordion />
          </Reveal>
        </div>
      </SiteSection>

      <FinalCta />
    </>
  );
}
