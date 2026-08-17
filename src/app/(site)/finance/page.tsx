"use client";

/**
 * BuildNivo Finance — la rubrique publique de l'accès « Contrôle financier ».
 *
 * Le fil : ce que vit un garant aujourd'hui → le tableau de bord standardisé →
 * la règle qui tient tout (aucun chiffre ne circule seul) → le rapport mensuel
 * et sa porte humaine → le périmètre → le paramétrage → la traçabilité →
 * les critères d'acceptation.
 */

import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Building2,
  CalendarClock,
  Check,
  FileClock,
  FileSearch,
  Landmark,
  LineChart,
  Lock,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { financeCriteria } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { Chip, CtaLink, DimensionRule, Eyebrow, FinalCta, PageHero, SectionHeading, SiteSection, StatBlock } from "@/components/site/kit";
import { Reveal, Stagger } from "@/components/site/motion";
import { AccessWall } from "@/components/site/figures/AccessWall";
import { ReportCycle } from "@/components/site/figures/ReportCycle";

const painIcons = { ponctuel: CalendarClock, heterogene: FileClock, aveugle: FileSearch, perime: AlertTriangle } as const;
const blockIcons = { identification: Building2, avancement: LineChart, financiere: Landmark, financement: ScrollText } as const;

const orgKinds = ["garant", "banque", "assureur", "courtier", "investisseur", "escrow", "sequestre", "institutionnel"] as const;
const traceItems = ["date", "origin", "method", "status", "docs"] as const;
const reminderItems = ["date", "before", "stale", "unvalidated", "notify"] as const;
const configItems = [
  "identite",
  "users",
  "dates",
  "docs",
  "commercialisation",
  "tresorerie",
  "sequestre",
  "frequence",
  "notifications",
] as const;

export default function FinancePage() {
  const { d, t } = useI18n();
  const pains = Object.keys(painIcons) as (keyof typeof painIcons)[];
  const blocks = Object.keys(blockIcons) as (keyof typeof blockIcons)[];

  return (
    <>
      <PageHero
        eyebrow={d.site.finance.eyebrow}
        title={d.site.finance.title}
        lead={d.site.finance.lead}
        aside={
          <Reveal delay={160} dir="right">
            {/* Le relevé certifié : la promesse du module, montrée plutôt que dite. */}
            <div className="rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-6 backdrop-blur-sm">
              <p className="font-mono text-[10.5px] tracking-[0.18em] text-blue-ink/60 uppercase">
                {d.site.finance.traceDemoLabel}
              </p>
              <p className="mt-4 text-[13px] font-semibold text-blue-ink/85">{d.site.finance.traceFigure}</p>
              <p className="mt-1 font-mono text-[34px] leading-none font-bold tracking-tight text-blue-ink">5 118 000 €</p>

              <dl className="mt-5 space-y-2 border-t border-blue-ink/15 pt-4">
                {traceItems.map((k) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="text-[11.5px] text-blue-ink/60">{t(`site.finance.traceItems.${k}.name`)}</dt>
                    <dd className="text-right font-mono text-[11.5px] font-semibold text-blue-ink">
                      {t(`site.finance.traceItems.${k}.text`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <CtaLink href="/connexion" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
            {d.site.finance.ctaPrimary}
          </CtaLink>
          <CtaLink href="/contact" variant="ghostDark">
            {d.site.common.talkToUs}
          </CtaLink>
        </div>
        <p className="mt-5 font-mono text-[11px] tracking-[0.12em] text-blue-ink/50 uppercase">{d.site.finance.heroNote}</p>
      </PageHero>

      {/* ------------------------------- À qui ------------------------------- */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.finance.eyebrow} title={d.site.finance.whoTitle} lead={d.site.finance.whoLead} />
        <Reveal delay={100} className="mt-8">
          <div className="flex flex-wrap gap-2">
            {orgKinds.map((k) => (
              <Chip key={k} tone="blue">
                <Users className="h-3.5 w-3.5" />
                {t(`controle.acces.orgKinds.${k}`)}
              </Chip>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140} className="mt-8">
          <div className="rounded-(--radius-card) border border-blue/25 bg-blue-soft/45 p-6">
            <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-blue-deep uppercase">
              <Lock className="h-4 w-4" />
              {d.controle.readOnly}
            </p>
            <p className="mt-2 max-w-[80ch] text-[14px] leading-relaxed text-ink">{d.site.finance.promise}</p>
          </div>
        </Reveal>
      </SiteSection>

      <DimensionRule label="Aujourd'hui" />

      {/* ------------------------------ Problème ----------------------------- */}
      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.finance.painEyebrow} title={d.site.finance.painTitle} />
        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" step={70} itemClassName="h-full">
          {pains.map((id) => {
            const Icon = painIcons[id];
            return (
              <article key={id} className="card h-full p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-safety-soft text-safety-deep">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-3 text-[13.5px] font-bold text-ink">{t(`site.finance.pains.${id}.title`)}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{t(`site.finance.pains.${id}.text`)}</p>
              </article>
            );
          })}
        </Stagger>
      </SiteSection>

      {/* -------------------------- Tableau de bord -------------------------- */}
      <SiteSection>
        <SectionHeading
          eyebrow={d.site.finance.dashEyebrow}
          title={d.site.finance.dashTitle}
          lead={d.site.finance.dashLead}
        />
        <Stagger className="mt-10 grid gap-4 md:grid-cols-2" step={80} itemClassName="h-full">
          {blocks.map((id, i) => {
            const Icon = blockIcons[id];
            return (
              <article key={id} className="card flex h-full gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-blue-soft text-blue-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10.5px] tracking-[0.14em] text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-0.5 text-[14px] font-bold text-ink">{t(`site.finance.dashBlocks.${id}.name`)}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                    {t(`site.finance.dashBlocks.${id}.text`)}
                  </p>
                </div>
              </article>
            );
          })}
        </Stagger>

        <Reveal delay={120} className="mt-8">
          <CtaLink href="/connexion" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
            {d.site.common.seeDemo}
          </CtaLink>
        </Reveal>
      </SiteSection>

      {/* --------------------------- La règle : traçabilité ------------------ */}
      <SiteSection tone="dark">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              onDark
              eyebrow={d.site.finance.traceEyebrow}
              title={d.site.finance.traceTitle}
              lead={d.site.finance.traceLead}
            />
          </div>

          <Reveal delay={140} dir="right">
            <dl className="grid gap-3 sm:grid-cols-2">
              {traceItems.map((k) => (
                <div key={k} className="rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-4 backdrop-blur-sm">
                  <dt className="text-[11px] font-bold tracking-[0.12em] text-blue-ink/55 uppercase">
                    {t(`site.finance.traceItems.${k}.name`)}
                  </dt>
                  <dd className="mt-1.5 font-mono text-[13px] font-semibold text-blue-ink">
                    {t(`site.finance.traceItems.${k}.text`)}
                  </dd>
                </div>
              ))}
              <div className="rounded-(--radius-card) border border-safety/40 bg-safety/10 p-4">
                <dt className="text-[11px] font-bold tracking-[0.12em] text-safety uppercase">
                  {d.controle.freshness.stale}
                </dt>
                <dd className="mt-1.5 text-[12px] leading-relaxed text-blue-ink/75">{d.controle.freshness.staleHint}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </SiteSection>

      {/* ------------------------- Rapport mensuel --------------------------- */}
      <SiteSection>
        <SectionHeading
          eyebrow={d.site.finance.reportEyebrow}
          title={d.site.finance.reportTitle}
          lead={d.site.finance.reportLead}
        />
        <ReportCycle className="mt-10" />

        <Reveal delay={120} className="mt-8">
          <div className="rounded-(--radius-card) border border-line bg-card p-6">
            <Eyebrow>
              <BellRing className="h-3.5 w-3.5" />
              {d.site.finance.remindersTitle}
            </Eyebrow>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {reminderItems.map((k) => (
                <li key={k} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" />
                  {t(`site.finance.reminders.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </SiteSection>

      {/* ------------------------------ Périmètre ---------------------------- */}
      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.finance.wallEyebrow} title={d.site.finance.wallTitle} lead={d.site.finance.wallLead} />
        <AccessWall className="mt-10" />
      </SiteSection>

      {/* ----------------------------- Paramétrage --------------------------- */}
      <SiteSection>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <SectionHeading
            eyebrow={d.site.finance.configEyebrow}
            title={d.site.finance.configTitle}
            lead={d.site.finance.configLead}
          />
          <Reveal delay={140} dir="right">
            <ul className="card divide-y divide-line-soft overflow-hidden">
              {configItems.map((k) => (
                <li key={k} className="flex items-center gap-3 px-5 py-3">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                  <span className="text-[13px] text-ink">{t(`site.finance.configItems.${k}`)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </SiteSection>

      {/* ----------------------------- Traçabilité --------------------------- */}
      <SiteSection tone="card">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <SectionHeading eyebrow={d.site.finance.logEyebrow} title={d.site.finance.logTitle} lead={d.site.finance.logLead} />
            <Reveal delay={120} className="mt-6">
              <p className="flex items-start gap-2.5 rounded-(--radius-card) border border-danger/25 bg-danger-soft/50 p-4 text-[13px] leading-relaxed text-ink">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                {d.site.finance.logRevoke}
              </p>
            </Reveal>
          </div>

          <Reveal delay={160} dir="right">
            {/* Extrait du journal, dans la typographie de données de l'application. */}
            <div className="overflow-hidden rounded-(--radius-card) border border-line bg-card">
              <p className="border-b border-line px-4 py-2.5 text-[12px] font-bold text-ink">{d.controle.acces.logTitle}</p>
              <ul className="divide-y divide-line-soft">
                {(
                  [
                    ["09:12", "Nadia Ferrand", d.controle.acces.logActions.connexion, ""],
                    ["09:13", "Nadia Ferrand", d.controle.acces.logActions.synthese, "Résidence SUNSET"],
                    ["09:21", "Nadia Ferrand", d.controle.acces.logActions.rapport, "RPT-2026-07"],
                    ["09:24", "Nadia Ferrand", d.controle.acces.logActions.document, "RAP-VT-2026-118"],
                    ["16:52", "Pascal Ellama", d.controle.acces.logActions.export, "PDF"],
                  ] as const
                ).map(([time, user, action, target], i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="font-mono text-[11.5px] text-ink-faint">{time}</span>
                    <span className="text-[12px] font-semibold text-ink">{user}</span>
                    <span className="ml-auto flex items-center gap-2">
                      <span className="rounded-full bg-line-soft px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
                        {action}
                      </span>
                      {target && <span className="hidden font-mono text-[11px] text-ink-faint sm:inline">{target}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </SiteSection>

      {/* ------------------------ Critères d'acceptation --------------------- */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.finance.criteriaEyebrow} title={d.site.finance.criteriaTitle} />
        <Stagger className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3" step={45} itemClassName="h-full">
          {financeCriteria.map((k, i) => (
            <div key={k} className="flex h-full items-start gap-3 rounded-(--radius-card) border border-line bg-card p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ok-soft font-mono text-[10.5px] font-bold text-ok-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[12.5px] leading-relaxed text-ink">{t(`site.finance.criteria.${k}`)}</span>
            </div>
          ))}
        </Stagger>

        <Reveal delay={140} className="mt-10">
          <div className={cn("grid gap-6 rounded-(--radius-card) border border-line bg-paper p-6 sm:grid-cols-3")}>
            <StatBlock value="13" label={t("site.finance.reportEyebrow")} hint={d.site.finance.reportTitle} />
            <StatBlock value="10 / 12" label={d.site.finance.wallEyebrow} hint={d.site.finance.wallTitle} />
            <StatBlock value="1" label={d.controle.scopeOne} hint={d.controle.scopeOneHint} />
          </div>
        </Reveal>
      </SiteSection>

      {/* --------------------------------- CTA ------------------------------- */}
      <SiteSection tone="dark" size="sm">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeading onDark title={d.site.finance.ctaTitle} lead={d.site.finance.ctaLead} />
          <div className="flex shrink-0 flex-wrap gap-3">
            <CtaLink href="/connexion" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
              {d.site.finance.ctaPrimary}
            </CtaLink>
            <CtaLink href="/securite" variant="ghostDark">
              <ShieldCheck className="mr-1.5 h-4 w-4" />
              {d.site.nav.security}
            </CtaLink>
          </div>
        </div>
      </SiteSection>

      <FinalCta />
    </>
  );
}
