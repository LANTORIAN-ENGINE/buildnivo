"use client";

/** BuildNivo Supply : le pilier d'approvisionnement et son partenaire de sourcing. */

import { ArrowRight, Globe2, Ship } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CtaLink, FinalCta, PageHero, SectionHeading, SiteSection } from "@/components/site/kit";
import { Reveal } from "@/components/site/motion";
import { SupplyFlow } from "@/components/site/figures/SupplyFlow";

export default function SupplyPage() {
  const { d } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={d.site.supply.eyebrow}
        title={d.site.supply.title}
        lead={d.site.supply.lead}
        aside={
          <Reveal delay={160} dir="right">
            <div className="rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-6 backdrop-blur-sm">
              <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-blue-ink/70 uppercase">
                <Ship className="h-4 w-4" />
                {d.site.supply.partnerTitle}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-blue-ink/80">{d.site.supply.partner}</p>
            </div>
          </Reveal>
        }
      >
        <CtaLink href="/contact" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
          {d.site.common.talkToUs}
        </CtaLink>
      </PageHero>

      <SiteSection>
        <SupplyFlow />
        <Reveal delay={140} className="mt-8">
          <CtaLink href="/achats" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
            {d.site.common.seeDemo}
          </CtaLink>
        </Reveal>
      </SiteSection>

      <SiteSection tone="card">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full card p-6">
              <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-ink-faint uppercase">
                <Ship className="h-4 w-4 text-blue" />
                {d.site.supply.partnerTitle}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{d.site.supply.partner}</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-(--radius-card) border border-blue/25 bg-blue-soft/45 p-6">
              <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-blue-deep uppercase">
                <Globe2 className="h-4 w-4" />
                {d.site.nav.supply}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{d.site.supply.neutral}</p>
            </div>
          </Reveal>
        </div>
      </SiteSection>

      <FinalCta />
    </>
  );
}
