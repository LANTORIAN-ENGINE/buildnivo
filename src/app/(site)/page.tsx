"use client";

/**
 * Page d'accueil de la vitrine.
 *
 * Le fil : le chantier est éclaté entre quinze outils (hero) → voilà ce que ça coûte →
 * voilà la plateforme → voilà comment elle se vend (empilement, gratuit, essai) →
 * voilà ce qui la rend crédible (IA validée, cloisonnement) → voilà le prix.
 */

import Link from "next/link";
import {
  AlarmClock,
  ArrowRight,
  BellOff,
  Building2,
  Check,
  FileWarning,
  Files,
  Quote,
  Repeat2,
  ShieldCheck,
  Split,
  TrendingUp,
  UserX,
  Wallet,
} from "lucide-react";
import { keyFigures, scatterTools, testimonials } from "@/data";
import { useI18n } from "@/lib/i18n";
import { Avatar, cn } from "@/components/ui";
import { Chip, CtaLink, DimensionRule, Eyebrow, SectionHeading, SiteSection, StatBlock } from "@/components/site/kit";
import { CountUp, Reveal, Stagger } from "@/components/site/motion";
import { ToolConvergence } from "@/components/site/figures/ToolConvergence";
import { ToolMarquee } from "@/components/site/figures/ToolMarquee";
import { ModuleGrid } from "@/components/site/figures/ModuleGrid";
import { LevelStack } from "@/components/site/figures/LevelStack";
import { NetworkEffect } from "@/components/site/figures/NetworkEffect";
import { TrialTimeline } from "@/components/site/figures/TrialTimeline";
import { DictationDemo } from "@/components/site/figures/DictationDemo";
import { BarrierMatrix } from "@/components/site/figures/BarrierMatrix";
import { SupplyFlow } from "@/components/site/figures/SupplyFlow";
import { CompareGrid } from "@/components/site/figures/CompareGrid";
import { PricingCards } from "@/components/site/figures/PricingCards";
import { FaqAccordion } from "@/components/site/figures/FaqAccordion";

const costIcons = {
  info: FileWarning,
  versions: Files,
  double: Repeat2,
  relance: BellOff,
  decision: Split,
  late: AlarmClock,
  budget: TrendingUp,
  client: UserX,
} as const;

export default function LandingPage() {
  const { d, t } = useI18n();
  const costs = Object.keys(costIcons) as (keyof typeof costIcons)[];

  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="site-drench relative overflow-hidden px-5 pt-24 pb-16 text-blue-ink sm:px-8 sm:pt-28 lg:pb-20">
        <div className="mx-auto grid w-full max-w-[1120px] gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <Chip tone="dark" className="font-mono text-[10.5px] tracking-[0.16em] uppercase">
                {d.site.hero.badge}
              </Chip>
            </Reveal>

            <h1 className="mt-6 text-[36px] leading-[1.02] font-bold tracking-[-0.03em] text-balance sm:text-[52px] lg:text-[60px]">
              <Reveal delay={90}>
                <span className="block text-blue-ink/55">{d.site.hero.titleLine1}</span>
              </Reveal>
              <Reveal delay={220}>
                <span className="block">{d.site.hero.titleLine2}</span>
              </Reveal>
            </h1>

            <Reveal delay={340}>
              <p className="mt-6 max-w-[58ch] text-[15.5px] leading-relaxed text-blue-ink/75">{d.site.hero.lead}</p>
            </Reveal>

            <Reveal delay={430}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CtaLink href="/connexion" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
                  {d.site.hero.ctaPrimary}
                </CtaLink>
                <CtaLink href="/produit" variant="ghostDark">
                  {d.site.hero.ctaSecondary}
                </CtaLink>
              </div>
            </Reveal>

            <Reveal delay={520}>
              <p className="mt-5 font-mono text-[11px] tracking-[0.12em] text-blue-ink/50 uppercase">{d.site.hero.note}</p>
            </Reveal>

            <Reveal delay={620}>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-blue-ink/15 pt-6">
                <StatBlock
                  onDark
                  value={<CountUp to={scatterTools.length} />}
                  label={d.site.hero.stats.toolsTitle}
                  hint={d.site.hero.stats.toolsHint}
                />
                <StatBlock
                  onDark
                  value={<CountUp to={keyFigures.demoRoles} />}
                  label={d.site.hero.stats.rolesTitle}
                  hint={d.site.hero.stats.rolesHint}
                />
                <StatBlock onDark value="∞" label={d.site.hero.stats.freeTitle} hint={d.site.hero.stats.freeHint} />
              </dl>
            </Reveal>
          </div>

          <Reveal delay={200} dir="scale">
            <ToolConvergence />
          </Reveal>
        </div>

        <p className="mx-auto mt-12 flex w-full max-w-[1120px] items-center gap-2 font-mono text-[10.5px] tracking-[0.18em] text-blue-ink/45 uppercase">
          <span className="scroll-hint inline-block h-3 w-px bg-blue-ink/50" />
          {d.site.hero.scrollHint}
        </p>
      </section>

      {/* ------------------------------ Problème ---------------------------- */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.problem.eyebrow} level="N+00" title={d.site.problem.title} lead={d.site.problem.lead} />

        <Reveal delay={120} className="mt-10">
          <ToolMarquee />
        </Reveal>

        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" step={60} itemClassName="h-full">
          {costs.map((id) => {
            const Icon = costIcons[id];
            return (
              <article key={id} className="card h-full p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-safety-soft text-safety-deep">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-3 text-[13.5px] font-bold text-ink">{t(`site.problem.costs.${id}.title`)}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{t(`site.problem.costs.${id}.text`)}</p>
              </article>
            );
          })}
        </Stagger>

        <Reveal delay={120} className="mt-8">
          <div className="flex flex-col gap-4 rounded-(--radius-card) border border-blue/25 bg-blue-soft/45 p-6 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-blue-deep">{d.site.problem.answerTitle}</p>
              <p className="mt-1.5 max-w-[70ch] text-[14px] leading-relaxed text-ink">{d.site.problem.answer}</p>
            </div>
            <CtaLink href="/produit" variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
              {d.site.common.learnMore}
            </CtaLink>
          </div>
        </Reveal>
      </SiteSection>

      <DimensionRule label="Vision" />

      {/* ------------------------------- Vision ----------------------------- */}
      <SiteSection tone="card">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow={d.site.vision.eyebrow} level="N+01" title={d.site.vision.title} lead={d.site.vision.lead} />

            <Reveal delay={120}>
              <p className="mt-6 text-[12px] font-bold tracking-[0.1em] text-ink-faint uppercase">{d.site.vision.isTitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(d.site.vision.is) as (keyof typeof d.site.vision.is)[]).map((k) => (
                  <Chip key={k} tone="blue">
                    {d.site.vision.is[k]}
                  </Chip>
                ))}
              </div>
              <p className="mt-4 text-[12.5px] text-ink-soft">
                <span className="font-semibold text-ink">{d.site.vision.isNotTitle} — </span>
                {d.site.vision.isNot}
              </p>
            </Reveal>
          </div>

          <Reveal delay={160} dir="right">
            <div className="card p-6">
              <Eyebrow>{d.site.vision.marketTitle}</Eyebrow>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <StatBlock
                  value={
                    <>
                      <CountUp to={keyFigures.marketLow} />–<CountUp to={keyFigures.marketHigh} />
                      <span className="ml-1 text-[18px]">Mds $</span>
                    </>
                  }
                  label={d.site.vision.market.size.label}
                  hint={d.site.vision.market.size.hint}
                />
                <StatBlock
                  value={
                    <>
                      <CountUp to={keyFigures.marketGrowth} />
                      <span className="text-[20px]"> %</span>
                    </>
                  }
                  label={d.site.vision.market.growth.label}
                  hint={d.site.vision.market.growth.hint}
                />
                <StatBlock
                  value={
                    <>
                      <CountUp to={keyFigures.multiProduct} />
                      <span className="text-[20px]"> %</span>
                    </>
                  }
                  label={d.site.vision.market.multi.label}
                  hint={d.site.vision.market.multi.hint}
                />
                <StatBlock
                  value={
                    <>
                      <CountUp to={keyFigures.sixProducts} />
                      <span className="text-[20px]"> %</span>
                    </>
                  }
                  label={d.site.vision.market.six.label}
                  hint={d.site.vision.market.six.hint}
                />
              </div>
              <p className="mt-6 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-faint">
                {d.site.vision.marketNote}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-(--radius-card) border border-line bg-paper p-5">
            <p className="text-[12.5px] font-bold text-ink">{d.site.vision.zoneTitle}</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(d.site.vision.zones) as (keyof typeof d.site.vision.zones)[]).map((z) => (
                <Chip key={z} tone="blue">
                  <Check className="h-3.5 w-3.5" />
                  {d.site.vision.zones[z]}
                </Chip>
              ))}
            </div>
            <span className="h-4 w-px bg-line" />
            <p className="text-[11.5px] font-semibold text-ink-faint">{d.site.vision.nextLabel}</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(d.site.vision.next) as (keyof typeof d.site.vision.next)[]).map((z) => (
                <Chip key={z}>{d.site.vision.next[z]}</Chip>
              ))}
            </div>
          </div>
        </Reveal>
      </SiteSection>

      {/* ------------------------------ Modules ----------------------------- */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.modules.eyebrow} level="N+02" title={d.site.modules.title} lead={d.site.modules.lead} />
        <Reveal delay={100} className="mt-8">
          <ModuleGrid />
        </Reveal>
      </SiteSection>

      {/* ---------------------------- Empilement ---------------------------- */}
      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.stack.eyebrow} level="N+03" title={d.site.stack.title} lead={d.site.stack.lead} />
        <LevelStack className="mt-10" />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-(--radius-card) border border-ok/30 bg-ok-soft/40 p-5">
              <p className="text-[12px] font-bold tracking-[0.1em] text-ok-deep uppercase">{d.site.common.free}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{d.site.stack.ruleProject}</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-(--radius-card) border border-blue/30 bg-blue-soft/45 p-5">
              <p className="text-[12px] font-bold tracking-[0.1em] text-blue-deep uppercase">{d.site.common.paid}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{d.site.stack.ruleCompany}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-6">
          <div className="overflow-x-auto rounded-(--radius-card) border border-line bg-card">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-3 text-[11.5px] font-bold text-ok-deep">{d.site.stack.frontierProject}</th>
                  <th className="px-4 py-3 text-[11.5px] font-bold text-blue-deep">{d.site.stack.frontierCompany}</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(d.site.stack.frontier) as (keyof typeof d.site.stack.frontier)[]).map((row) => (
                  <tr key={row} className="border-b border-line-soft last:border-0 hover:bg-line-soft/40">
                    <td className="px-4 py-3 text-[12.5px] text-ink">{d.site.stack.frontier[row].project}</td>
                    <td className="px-4 py-3 text-[12.5px] text-ink-soft">{d.site.stack.frontier[row].company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </SiteSection>

      {/* ------------------------- Mécanique de marché ---------------------- */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.growth.eyebrow} level="N+04" title={d.site.growth.title} lead={d.site.growth.lead} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal dir="left">
            <NetworkEffect />
          </Reveal>

          <div>
            <Eyebrow>{d.site.growth.network.title}</Eyebrow>
            <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-ink-soft">{d.site.growth.network.text}</p>

            <ol className="mt-6 space-y-3">
              {(Object.keys(d.site.growth.steps) as (keyof typeof d.site.growth.steps)[]).map((step, i) => (
                <Reveal key={step} delay={i * 90}>
                  <li className="flex gap-3.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-soft font-mono text-[11px] font-bold text-blue-deep">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-bold text-ink">{d.site.growth.steps[step].title}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-soft">
                        {d.site.growth.steps[step].text}
                      </span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        <Reveal delay={100} className="mt-10">
          <TrialTimeline />
        </Reveal>

        <Stagger className="mt-6 grid gap-3 md:grid-cols-3" step={80} itemClassName="h-full">
          {(Object.keys(d.site.growth.states) as (keyof typeof d.site.growth.states)[]).map((s, i) => (
            <article key={s} className="card h-full p-4">
              <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-faint">0{i + 1}</span>
              <h3 className="mt-1 text-[13.5px] font-bold text-ink">{d.site.growth.states[s].name}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{d.site.growth.states[s].text}</p>
            </article>
          ))}
        </Stagger>
      </SiteSection>

      {/* --------------------------------- IA ------------------------------- */}
      <SiteSection tone="dark">
        <SectionHeading onDark eyebrow={d.site.ai.eyebrow} level="N+05" title={d.site.ai.title} lead={d.site.ai.lead} />
        <Reveal delay={100} className="mt-10">
          <DictationDemo />
        </Reveal>

        <Stagger className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" step={60} itemClassName="h-full">
          {(Object.keys(d.site.ai.capabilities) as (keyof typeof d.site.ai.capabilities)[]).map((c) => (
            <article key={c} className="h-full rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-4 backdrop-blur-sm">
              <h3 className="text-[13.5px] font-bold text-blue-ink">{d.site.ai.capabilities[c].name}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-blue-ink/70">{d.site.ai.capabilities[c].text}</p>
            </article>
          ))}
        </Stagger>

        <Reveal delay={120} className="mt-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-(--radius-card) border border-blue-ink/20 p-5">
            <p className="text-[12px] font-bold tracking-[0.1em] text-blue-ink uppercase">{d.site.ai.governanceTitle}</p>
            {(Object.keys(d.site.ai.governance) as (keyof typeof d.site.ai.governance)[]).map((g) => (
              <p key={g} className="flex items-start gap-2 text-[12px] leading-snug text-blue-ink/75">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-ink/50" />
                {d.site.ai.governance[g]}
              </p>
            ))}
          </div>
        </Reveal>
      </SiteSection>

      {/* ------------------------------- RBAC ------------------------------- */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.rbac.eyebrow} level="N+06" title={d.site.rbac.title} lead={d.site.rbac.lead} />
        <Reveal delay={100} className="mt-10">
          <BarrierMatrix />
        </Reveal>
        <Reveal delay={140} className="mt-6">
          <Link
            href="/securite"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue transition-colors duration-150 hover:text-blue-deep"
          >
            {d.site.nav.security}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </SiteSection>

      {/* ------------------------------- Supply ----------------------------- */}
      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.supply.eyebrow} level="N+07" title={d.site.supply.title} lead={d.site.supply.lead} />
        <Reveal delay={100} className="mt-10">
          <SupplyFlow />
        </Reveal>
      </SiteSection>

      {/* ----------------------------- Comparatif --------------------------- */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.compare.eyebrow} level="N+08" title={d.site.compare.title} lead={d.site.compare.lead} />
        <Reveal delay={100} className="mt-10">
          <CompareGrid />
        </Reveal>
        <Reveal delay={140} className="mt-8">
          <div className="rounded-(--radius-card) border border-blue/25 bg-blue-soft/45 p-6">
            <p className="text-[12px] font-bold tracking-[0.1em] text-blue-deep uppercase">{d.site.compare.blindSpotTitle}</p>
            <p className="mt-2 max-w-[80ch] text-[14px] leading-relaxed text-ink">{d.site.compare.blindSpot}</p>
          </div>
        </Reveal>
      </SiteSection>

      {/* ------------------------------- Tarifs ----------------------------- */}
      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.pricing.eyebrow} level="N+09" title={d.site.pricing.title} lead={d.site.pricing.lead} />
        <PricingCards className="mt-10" />
        <Reveal delay={120} className="mt-6">
          <Link
            href="/tarifs"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue transition-colors duration-150 hover:text-blue-deep"
          >
            {d.site.pricing.freeTitle}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </SiteSection>

      {/* ------------------------------- Preuves ---------------------------- */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.proof.eyebrow} level="N+10" title={d.site.proof.title} lead={d.site.proof.lead} />
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3" step={90} itemClassName="h-full">
          {testimonials.map((person) => (
            <figure key={person.id} className="card flex h-full flex-col p-5">
              <Quote className="h-5 w-5 text-blue/40" />
              <blockquote className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink">
                {t(`site.proof.testimonials.${person.id}.quote`)}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
                <Avatar name={person.name} />
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-bold text-ink">{person.name}</span>
                  <span className="block truncate text-[11.5px] text-ink-soft">
                    {t(`site.proof.testimonials.${person.id}.role`)} · {person.company}
                  </span>
                </span>
                <span className="ml-auto shrink-0 rounded-md bg-line-soft px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ink-faint uppercase">
                  {d.site.proof.fictional}
                </span>
              </figcaption>
            </figure>
          ))}
        </Stagger>

        <Reveal delay={140} className="mt-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-(--radius-card) border border-line bg-card p-4">
              <Building2 className="h-5 w-5 shrink-0 text-blue" />
              <p className="text-[12.5px] leading-snug text-ink">
                <span className="font-mono font-semibold">
                  {keyFigures.targetMin}–{keyFigures.targetMax}
                </span>{" "}
                {d.common.people}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-(--radius-card) border border-line bg-card p-4">
              <Wallet className="h-5 w-5 shrink-0 text-blue" />
              <p className="text-[12.5px] leading-snug text-ink">
                <span className="font-mono font-semibold">{keyFigures.projectPrice} €</span> {d.site.common.perMonth}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-(--radius-card) border border-line bg-card p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-blue" />
              <p className="text-[12.5px] leading-snug text-ink">
                <span className="font-mono font-semibold">{keyFigures.trialDays} {d.common.days}</span> · {d.site.growth.states.trial.name}
              </p>
            </div>
          </div>
        </Reveal>
      </SiteSection>

      {/* --------------------------------- FAQ ------------------------------ */}
      <SiteSection tone="card">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading eyebrow={d.site.faq.eyebrow} level="N+11" title={d.site.faq.title} />
          <Reveal delay={100}>
            <FaqAccordion />
          </Reveal>
        </div>
      </SiteSection>

      {/* --------------------------------- CTA ------------------------------ */}
      <SiteSection tone="dark" size="sm">
        <div className={cn("flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between")}>
          <div>
            <Reveal>
              <h2 className="max-w-[22ch] text-[28px] leading-tight font-bold tracking-[-0.02em] text-balance sm:text-[34px]">
                {d.site.cta.title}
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-blue-ink/75">{d.site.cta.lead}</p>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <div className="flex flex-wrap items-center gap-3">
              <CtaLink href="/connexion" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
                {d.site.cta.primary}
              </CtaLink>
              <CtaLink href="/contact" variant="ghostDark">
                {d.site.cta.secondary}
              </CtaLink>
            </div>
          </Reveal>
        </div>
        <p className="mt-8 font-mono text-[10.5px] tracking-[0.14em] text-blue-ink/45 uppercase">{d.site.cta.note}</p>
      </SiteSection>
    </>
  );
}
