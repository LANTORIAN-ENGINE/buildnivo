"use client";

/**
 * Écran 1 du module — Synthèse de l'opération.
 *
 * Quatre blocs, toujours dans le même ordre : identification, avancement,
 * situation financière, financement et commercialisation ; puis les risques
 * matériels. La forme ne change ni d'un mois sur l'autre, ni d'une opération à
 * l'autre : c'est ce qui permet à un garant de comparer.
 */

import Link from "next/link";
import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Download,
  Gauge,
  Landmark,
  Lock,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MaterialRisk, RiskLevel, TracedFigure } from "@/types";
import { companyById, projectById, snapshotFor, financeMilestones } from "@/data";
import { fmtDate, fmtEuro, useI18n } from "@/lib/i18n";
import { useFinance } from "@/lib/finance";
import { useDemo } from "@/lib/store";
import {
  Badge,
  Button,
  cn,
  DemoTip,
  EmptyState,
  SectionCard,
  StatusPill,
  type Tone,
} from "@/components/ui";
import {
  FigureTable,
  FigureTile,
  Freshness,
  NotSharedBlock,
  ReadOnlyBanner,
} from "@/components/finance";

const BLUE = "oklch(0.51 0.2 264)";
const GREEN = "oklch(0.58 0.13 152)";
const DANGER = "oklch(0.55 0.19 27)";

const levelTone: Record<RiskLevel, Tone> = { vert: "ok", orange: "safety", rouge: "danger" };
const levelBar: Record<RiskLevel, string> = { vert: "bg-ok", orange: "bg-safety", rouge: "bg-danger" };

const pick = (figures: TracedFigure[], keys: string[]) =>
  keys.map((k) => figures.find((f) => f.key === k)).filter(Boolean) as TracedFigure[];

/* --------------------------------- Risque --------------------------------- */

function RiskCard({ risk, canAct }: { risk: MaterialRisk; canAct: boolean }) {
  const { d, t, lang } = useI18n();
  const { setRiskStatus, toast } = useDemo();

  return (
    <article className="card relative flex flex-col overflow-hidden pl-1.5">
      <span className={cn("absolute inset-y-0 left-0 w-1.5", levelBar[risk.level])} aria-hidden="true" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={levelTone[risk.level]}>{t(`controle.risks.categories.${risk.category}`)}</Badge>
          <StatusPill tone={levelTone[risk.level]}>{t(`controle.risks.levels.${risk.level}`)}</StatusPill>
          <StatusPill tone="neutral" dot={false} className="ml-auto">
            {t(`controle.risks.states.${risk.status}`)}
          </StatusPill>
        </div>

        <h3 className="mt-2.5 text-[13.5px] leading-snug font-bold text-ink">{risk.title}</h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{risk.summary}</p>

        <p className="mt-3 rounded-lg bg-line-soft/60 px-3 py-2 text-[12px] leading-relaxed text-ink">
          <span className="font-bold">{d.controle.risks.impact} — </span>
          {risk.impact}
        </p>

        <p className="mt-3 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">{d.controle.risks.measures}</p>
        {risk.measures.length === 0 ? (
          <p className="mt-1 text-[12px] text-ink-faint">{d.controle.risks.noMeasures}</p>
        ) : (
          <ul className="mt-1 space-y-1">
            {risk.measures.map((m) => (
              <li key={m} className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-soft">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" />
                {m}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line-soft pt-3">
          <span className="font-mono text-[10.5px] text-ink-faint">
            {d.controle.risks.detected} {fmtDate(risk.detectedAt, lang)} · {d.controle.freshness.updated}{" "}
            {fmtDate(risk.updatedAt, lang)}
          </span>
          {canAct && risk.status !== "maitrise" && risk.status !== "clos" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setRiskStatus(risk.id, "maitrise");
                toast(d.controle.risks.marked);
              }}
            >
              {d.controle.risks.markHandled}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

/* --------------------------------- Écran ---------------------------------- */

export default function ControlePage() {
  const { d, t, lang } = useI18n();
  const { persona, risks, accesses, logAccess, toast } = useDemo();
  const { access, financial, projectId, share, closed, actor } = useFinance();

  const project = projectById(projectId);
  const snapshot = snapshotFor(projectId);

  /* Une consultation de la synthèse est tracée, comme toute autre. */
  useEffect(() => {
    if (financial && access && access.status === "actif") {
      logAccess(access.id, `${persona.firstName} ${persona.lastName}`, "synthese", project?.name);
    }
    // Une seule trace par ouverture d'écran et par accès.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access?.id]);

  if (closed) {
    return (
      <EmptyState
        icon={<Lock className="h-8 w-8" />}
        title={d.controle.revokedTitle}
        hint={d.controle.revokedHint}
      />
    );
  }

  if (!snapshot || !project) {
    return (
      <div className="space-y-4">
        <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.controle.synthese.title}</h1>
        <EmptyState
          icon={<Landmark className="h-8 w-8" />}
          title={d.controle.noSnapshot}
          hint={d.controle.noSnapshotHint}
        />
      </div>
    );
  }

  const org = access ? companyById(access.orgId) : undefined;
  const projectRisks = risks.filter((r) => r.projectId === projectId && r.status !== "clos");
  const projectAccesses = accesses.filter((a) => a.projectId === projectId && a.status === "actif");
  const milestones = financeMilestones.filter((m) => m.projectId === projectId);

  const byLevel = (lvl: RiskLevel) => projectRisks.filter((r) => r.level === lvl).length;

  /* Cohérence avancement / dépenses : la question que pose tout financeur. */
  const engaged = snapshot.financial.find((f) => f.key === "engage")?.value ?? 0;
  const revised = snapshot.financial.find((f) => f.key === "budgetRevise")?.value ?? 1;
  const actualPct = snapshot.progress.find((f) => f.key === "actualPct")?.value ?? 0;
  const spentPct = Math.round((engaged / revised) * 1000) / 10;
  const gap = Math.round((spentPct - actualPct) * 10) / 10;

  const curve = snapshot.progressCurve.map((c) => ({
    ...c,
    label: fmtDate(c.month + "-01", lang, { month: "short", day: undefined }),
  }));
  const cash = snapshot.cashCurve.map((c) => ({
    ...c,
    label: fmtDate(c.month + "-01", lang, { month: "short", day: undefined }),
    short: c.need > c.available,
  }));

  const identityRows: [string, React.ReactNode][] = [
    [d.controle.synthese.identity.promoter, snapshot.identity.promoter],
    [d.controle.synthese.identity.spv, snapshot.identity.spv],
    [d.controle.synthese.identity.address, snapshot.identity.address],
    [d.controle.synthese.identity.program, t(`controle.synthese.programs.${snapshot.identity.programKey}`)],
    [d.controle.synthese.identity.operationAmount, <span key="op" className="font-mono font-bold">{fmtEuro(snapshot.identity.operationAmount, lang)}</span>],
    [d.controle.synthese.identity.worksAmount, <span key="w" className="font-mono font-bold">{fmtEuro(snapshot.identity.worksAmount, lang)}</span>],
    [d.controle.synthese.identity.start, <span key="s" className="font-mono">{fmtDate(snapshot.identity.startDate, lang, { day: "numeric", month: "long", year: "numeric" })}</span>],
    [d.controle.synthese.identity.contractual, <span key="c" className="font-mono">{fmtDate(snapshot.identity.contractualDelivery, lang, { day: "numeric", month: "long", year: "numeric" })}</span>],
    [
      d.controle.synthese.identity.forecast,
      <span key="f" className={cn("font-mono font-bold", snapshot.identity.forecastDelivery > snapshot.identity.contractualDelivery ? "text-safety-deep" : "text-ok-deep")}>
        {fmtDate(snapshot.identity.forecastDelivery, lang, { day: "numeric", month: "long", year: "numeric" })}
      </span>,
    ],
  ];

  const tileIcons = { plannedPct: Target, actualPct: TrendingUp, driftPts: Gauge, delayDays: Clock3 } as const;
  const tileTones: Record<string, Tone> = {
    plannedPct: "blue",
    actualPct: "ok",
    driftPts: (snapshot.progress.find((f) => f.key === "driftPts")?.value ?? 0) < 0 ? "safety" : "ok",
    delayDays: (snapshot.progress.find((f) => f.key === "delayDays")?.value ?? 0) > 5 ? "safety" : "ok",
  };

  return (
    <div className="space-y-4">
      {/* ------------------------------ En-tête ------------------------------ */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.controle.synthese.title}</h1>
            <Badge tone="viz">{d.controle.brand}</Badge>
            <DemoTip text={d.tips.controle.main} />
          </div>
          <p className="mt-0.5 max-w-[80ch] text-[13px] text-ink-soft">{d.controle.synthese.subtitle}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (financial && access) logAccess(access.id, `${persona.firstName} ${persona.lastName}`, "export", d.controle.synthese.title);
            toast(d.controle.synthese.exported);
          }}
        >
          <Download className="h-4 w-4" /> {d.controle.synthese.exportPdf}
        </Button>
      </div>

      {financial && access && org ? (
        <ReadOnlyBanner orgName={org.name} reference={access.reference} />
      ) : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-(--radius-card) border border-line bg-card px-4 py-3">
          <span className="flex items-center gap-2 text-[12.5px] font-bold text-ink">
            <Building2 className="h-4 w-4 text-blue" />
            {project.name}
          </span>
          <span className="h-4 w-px bg-line" />
          <span className="text-[12px] text-ink-soft">
            {projectAccesses.length > 0
              ? projectAccesses.map((a) => companyById(a.orgId)?.name).join(" · ")
              : d.controle.acces.empty}
          </span>
          <Link href="/controle/acces" className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-bold text-blue hover:text-blue-deep">
            {d.controle.acces.title} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* --------------------------- Identification -------------------------- */}
      <SectionCard
        title={d.controle.synthese.identityTitle}
        actions={<Freshness at={snapshot.identity.updatedAt} />}
      >
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
          {identityRows.map(([label, value]) => (
            <div key={label} className="min-w-0 border-b border-line-soft pb-2.5">
              <dt className="text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">{label}</dt>
              <dd className="mt-1 text-[13px] leading-snug text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      {/* ------------------------------ Avancement --------------------------- */}
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="text-[15px] font-bold text-ink">{d.controle.synthese.progressTitle}</h2>
        <DemoTip text={d.tips.controle.trace} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {snapshot.progress.map((f) => (
          <FigureTile
            key={f.key}
            f={f}
            icon={tileIcons[f.key as keyof typeof tileIcons] ?? Gauge}
            tone={tileTones[f.key] ?? "blue"}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <SectionCard
          title={d.controle.synthese.curveTitle}
          actions={
            <div className="flex items-center gap-3 text-[11.5px] font-semibold text-ink-soft">
              <span className="flex items-center gap-1.5">
                <span className="h-0.75 w-4 rounded-full" style={{ background: BLUE }} /> {d.controle.synthese.planned}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.75 w-4 rounded-full" style={{ background: GREEN }} /> {d.controle.synthese.actual}
              </span>
            </div>
          }
          bodyClassName="flex flex-col"
        >
          <div className="min-h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curve} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="oklch(0.93 0.006 255)" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                <ChartTooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.915 0.008 255)", fontSize: 12, fontFamily: "var(--font-sans)" }}
                  formatter={(v) => [`${v}%`]}
                />
                <Line type="monotone" dataKey="planned" name={d.controle.synthese.planned} stroke={BLUE} strokeWidth={2.5} dot={{ r: 3.5, fill: "white", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="actual" name={d.controle.synthese.actual} stroke={GREEN} strokeWidth={2.5} dot={{ r: 3.5, fill: "white", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title={d.controle.synthese.milestonesTitle} bodyClassName="space-y-0">
          <ol className="divide-y divide-line-soft">
            {milestones.map((m) => (
              <li key={m.id} className="flex items-start gap-3 py-2.5">
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    m.state === "atteint" && "bg-ok-soft text-ok-deep",
                    m.state === "retard" && "bg-danger-soft text-danger",
                    m.state === "aVenir" && "bg-line-soft text-ink-faint"
                  )}
                >
                  {m.state === "atteint" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : m.state === "retard" ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <CalendarClock className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] leading-snug font-semibold text-ink">{m.label}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-ink-soft">
                    {m.actual
                      ? `${d.controle.synthese.milestone.doneOn} ${fmtDate(m.actual, lang)}`
                      : `${d.controle.synthese.milestone.plannedOn} ${fmtDate(m.planned, lang)}`}
                    {m.driftDays !== 0 && (
                      <span className={cn("ml-1.5 font-bold", m.driftDays > 0 ? "text-safety-deep" : "text-ok-deep")}>
                        {m.driftDays > 0 ? "+" : ""}
                        {m.driftDays} {d.common.days} {m.driftDays > 0 ? d.controle.synthese.milestone.late : d.controle.synthese.milestone.early}
                      </span>
                    )}
                  </span>
                </span>
                <StatusPill tone={m.state === "atteint" ? "ok" : m.state === "retard" ? "danger" : "neutral"} dot={false} className="shrink-0">
                  {t(`controle.synthese.milestone.${m.state}`)}
                </StatusPill>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      {/* --------------------------- Situation financière -------------------- */}
      <SectionCard
        title={d.controle.synthese.financialTitle}
        tip={d.tips.controle.stale}
        actions={
          <StatusPill tone={gap > 8 ? "safety" : "ok"} dot={false}>
            {d.controle.synthese.consistencyTitle}
          </StatusPill>
        }
      >
        <p
          className={cn(
            "mb-4 rounded-xl px-4 py-3 text-[12.5px] leading-relaxed",
            gap > 8 ? "bg-safety-soft text-safety-deep" : "bg-ok-soft text-ok-deep"
          )}
        >
          <span className="font-bold">
            {d.controle.synthese.consistency
              .replace("{spent}", String(spentPct))
              .replace("{progress}", String(actualPct))
              .replace("{gap}", String(gap))}
          </span>{" "}
          {gap > 8 ? d.controle.synthese.consistencyWatch : d.controle.synthese.consistencyOk}
        </p>
        <FigureTable figures={snapshot.financial} emphasise={["cpt", "depassement"]} />
      </SectionCard>

      {/* --------------------- Financement et commercialisation -------------- */}
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="text-[15px] font-bold text-ink">{d.controle.synthese.fundingTitle}</h2>
        {financial && (
          <StatusPill tone="blue" dot={false}>
            {d.controle.scope}
          </StatusPill>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title={d.controle.synthese.fundingBlock}>
          <FigureTable figures={pick(snapshot.funding, ["financementObtenu", "financementConsomme", "apportPromoteur"])} />
        </SectionCard>

        <SectionCard title={d.controle.acces.share.commercialisation}>
          {share.commercialisation ? (
            <FigureTable
              figures={pick(snapshot.funding, [
                "tauxCommercialisation",
                "ventesActees",
                "reservations",
                "encaissementsAcquereurs",
              ])}
            />
          ) : (
            <NotSharedBlock label={d.controle.acces.share.commercialisation} />
          )}
        </SectionCard>

        <SectionCard title={d.controle.acces.share.sequestre}>
          {share.sequestre ? (
            <FigureTable figures={pick(snapshot.funding, ["sequestreDisponible", "sequestreDecaisse"])} />
          ) : (
            <NotSharedBlock label={d.controle.acces.share.sequestre} />
          )}
        </SectionCard>

        <SectionCard
          title={d.controle.synthese.cashTitle}
          actions={
            share.tresorerie ? (
              <div className="flex items-center gap-3 text-[11.5px] font-semibold text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: BLUE }} /> {d.controle.synthese.cashNeed}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0.75 w-4 rounded-full" style={{ background: GREEN }} /> {d.controle.synthese.cashAvailable}
                </span>
              </div>
            ) : undefined
          }
          bodyClassName="flex flex-col"
        >
          {share.tresorerie ? (
            <>
              <div className="min-h-52 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cash} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                    <CartesianGrid stroke="oklch(0.93 0.006 255)" strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                    />
                    <ChartTooltip
                      contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.915 0.008 255)", fontSize: 12, fontFamily: "var(--font-sans)" }}
                      formatter={(v) => [fmtEuro(Number(v), lang, true)]}
                    />
                    <Bar dataKey="need" name={d.controle.synthese.cashNeed} radius={[4, 4, 0, 0]} maxBarSize={34}>
                      {cash.map((c) => (
                        <Cell key={c.month} fill={c.short ? DANGER : BLUE} />
                      ))}
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="available"
                      name={d.controle.synthese.cashAvailable}
                      stroke={GREEN}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              {cash.some((c) => c.short) && (
                <p className="mt-3 flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2 text-[12px] font-semibold text-danger-deep">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {d.controle.synthese.cashGap} :{" "}
                  <span className="font-mono">
                    {fmtEuro(Math.max(...cash.map((c) => c.need - c.available)), lang)}
                  </span>
                </p>
              )}
            </>
          ) : (
            <NotSharedBlock label={d.controle.synthese.cashTitle} />
          )}
        </SectionCard>
      </div>

      {/* -------------------------------- Risques ---------------------------- */}
      <SectionCard
        title={
          <span className="flex flex-wrap items-center gap-2.5">
            <ShieldAlert className="h-4 w-4 text-blue" />
            {d.controle.risks.title}
          </span>
        }
        tip={d.tips.controle.risks}
        actions={
          <div className="flex items-center gap-2">
            {(["rouge", "orange", "vert"] as RiskLevel[]).map((lvl) => (
              <span
                key={lvl}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold",
                  lvl === "rouge" && "bg-danger-soft text-danger-deep",
                  lvl === "orange" && "bg-safety-soft text-safety-deep",
                  lvl === "vert" && "bg-ok-soft text-ok-deep"
                )}
              >
                <span className="font-mono">{byLevel(lvl)}</span>
                {t(`controle.risks.levels.${lvl}`)}
              </span>
            ))}
          </div>
        }
      >
        <p className="mb-4 max-w-[95ch] rounded-xl bg-line-soft/60 px-4 py-2.5 text-[12px] leading-relaxed text-ink-soft">
          {d.controle.risks.hint}
        </p>
        {projectRisks.length === 0 ? (
          <p className="rounded-xl bg-ok-soft px-4 py-6 text-center text-[12.5px] text-ok-deep">{d.controle.risks.empty}</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {projectRisks.map((r) => (
              <RiskCard key={r.id} risk={r} canAct={!financial} />
            ))}
          </div>
        )}
      </SectionCard>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11.5px] text-ink-faint">
        <span>
          {d.controle.freshness.updated} · {fmtDate(snapshot.identity.updatedAt, lang, { day: "numeric", month: "long", year: "numeric" })} ·{" "}
          {d.common.demoData}
        </span>
        <span className="font-mono">{actor}</span>
      </div>
    </div>
  );
}
