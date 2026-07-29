"use client";

import {
  AlarmClockCheck,
  AlertTriangle,
  Camera,
  Euro,
  Clock3,
  Download,
  Mic,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { projectById } from "@/data";
import { fmtDate, fmtEuro, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Button, cn, DemoTip, ProgressBar, SectionCard, StatusPill, Tooltip } from "@/components/ui";

const BLUE = "oklch(0.51 0.2 264)";
const GREEN = "oklch(0.58 0.13 152)";
const DONUT = [BLUE, GREEN, "oklch(0.55 0.18 295)", "oklch(0.7 0.16 55)", "oklch(0.75 0.02 258)"];

/** Présence par corps d'état (mock agrégé, cohérent avec les alertes IA). */
const presenceByProject: Record<string, { key: string; present: number; planned: number }[]> = {
  "p-sunset": [
    { key: "grosOeuvre", present: 18, planned: 20 },
    { key: "secondOeuvre", present: 12, planned: 13 },
    { key: "electricite", present: 6, planned: 7 },
    { key: "plomberie", present: 0, planned: 2 },
    { key: "etancheite", present: 3, planned: 3 },
    { key: "vrd", present: 3, planned: 3 },
  ],
  "p-albany": [
    { key: "vrd", present: 6, planned: 6 },
    { key: "grosOeuvre", present: 5, planned: 6 },
  ],
  "p-horizon": [
    { key: "menuiserie", present: 2, planned: 2 },
    { key: "peinture", present: 2, planned: 3 },
    { key: "plomberie", present: 1, planned: 1 },
  ],
  "p-coeur": [
    { key: "grosOeuvre", present: 11, planned: 11 },
    { key: "secondOeuvre", present: 4, planned: 4 },
    { key: "electricite", present: 3, planned: 3 },
  ],
};

export default function DashboardPage() {
  const { d, t, lang } = useI18n();
  const { persona, activeProjectId, alerts, tasks, markAlertHandled, toast } = useDemo();
  const project = projectById(activeProjectId)!;

  const projectAlerts = alerts.filter((a) => a.projectId === activeProjectId && !a.handled);
  const presence = presenceByProject[activeProjectId] ?? [];
  const deadlines = tasks
    .filter((tk) => tk.projectId === activeProjectId && tk.status !== "terminee")
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 5);

  const budgetPct = Math.round((project.budgetSpent / project.budgetTotal) * 100);
  const isTerrain = persona.role === "chef" || persona.role === "ouvrier";

  const curveData = project.curve.map((c) => ({
    ...c,
    label: fmtDate(c.month + "-01", lang, { month: "short", day: undefined }),
    actual: c.actual === 0 ? null : c.actual,
  }));
  const todayLabel = curveData.findLast((c) => c.actual !== null)?.label;

  const kpis = [
    {
      id: "budget",
      icon: Euro,
      label: d.dashboard.kpi.budget,
      value: fmtEuro(project.budgetSpent, lang, true),
      sub: `/ ${fmtEuro(project.budgetTotal, lang, true)}`,
      bar: budgetPct,
      barLabel: `${budgetPct}%`,
      tone: "blue" as const,
    },
    {
      id: "progress",
      icon: TrendingUp,
      label: d.dashboard.kpi.progress,
      value: `${project.progress}`,
      sub: "%",
      bar: project.progress,
      barLabel: `${project.plannedProgress}% ${d.common.vs} ${d.dashboard.curve.planned.toLowerCase()}`,
      tone: "ok" as const,
    },
    {
      id: "delay",
      icon: Clock3,
      label: d.dashboard.kpi.delay,
      value: `${project.delayDays}`,
      sub: d.common.days,
      note: d.dashboard.kpi.vsPlanning,
      tone: project.delayDays > 5 ? ("safety" as const) : ("ok" as const),
    },
    {
      id: "team",
      icon: UsersRound,
      label: d.dashboard.kpi.team,
      value: `${project.headcountToday}`,
      sub: d.common.people,
      note: d.dashboard.kpi.onSite,
      pulse: true,
      tone: "blue" as const,
    },
  ];

  // Le terrain voit l'équipe d'abord, la direction voit le budget d'abord.
  const orderedKpis = isTerrain ? [kpis[3], kpis[1], kpis[2], kpis[0]] : kpis;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="sr-only">{d.dashboard.title}</h1>
          <DemoTip text={d.tips.dashboard.kpi} />
        </div>
        {isTerrain && (
          <div className="flex flex-wrap gap-2">
            <Link href="/pointage">
              <Button size="sm" variant="soft">
                <AlarmClockCheck className="h-4 w-4" /> {d.pointage.clockIn}
              </Button>
            </Link>
            <Link href="/journal">
              <Button size="sm" variant="soft">
                <Mic className="h-4 w-4" /> {d.journal.dictate}
              </Button>
            </Link>
            <Link href="/photos">
              <Button size="sm" variant="soft">
                <Camera className="h-4 w-4" /> {d.photos.addPhoto}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {orderedKpis.map((k) => (
          <div key={k.id} className="card p-4.5">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-8.5 w-8.5 items-center justify-center rounded-[10px]",
                  k.tone === "blue" && "bg-blue-soft text-blue-deep",
                  k.tone === "ok" && "bg-ok-soft text-ok-deep",
                  k.tone === "safety" && "bg-safety-soft text-safety-deep"
                )}
              >
                <k.icon className="h-4.5 w-4.5" />
              </span>
              <p className="text-[12.5px] font-semibold text-ink-soft">{k.label}</p>
            </div>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="font-mono text-[28px] leading-none font-bold tracking-tight text-ink">{k.value}</span>
              <span className={cn("text-[13px] font-semibold", k.id === "delay" && project.delayDays > 5 ? "text-safety-deep" : "text-ink-soft")}>
                {k.sub}
              </span>
              {k.pulse && <span className="presence-dot ml-1 inline-block h-2 w-2 rounded-full bg-ok" aria-hidden="true" />}
            </p>
            {typeof k.bar === "number" ? (
              <div className="mt-3.5 flex items-center gap-2.5">
                <ProgressBar value={k.bar} tone={k.tone} className="flex-1" />
                <span className="text-[11px] font-semibold whitespace-nowrap text-ink-soft">{k.barLabel}</span>
              </div>
            ) : (
              <p className="mt-3.5 text-[11.5px] text-ink-soft">{k.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* Courbe + alertes */}
      <div className="grid gap-4 xl:grid-cols-[1fr_400px]">
        <SectionCard title={d.dashboard.curve.title} tip={d.tips.dashboard.curve} actions={
          <div className="flex items-center gap-3 text-[11.5px] font-semibold text-ink-soft">
            <span className="flex items-center gap-1.5"><span className="h-0.75 w-4 rounded-full" style={{ background: BLUE }} /> {d.dashboard.curve.planned}</span>
            <span className="flex items-center gap-1.5"><span className="h-0.75 w-4 rounded-full" style={{ background: GREEN }} /> {d.dashboard.curve.actual}</span>
          </div>
        } bodyClassName="flex flex-col">
          <div className="min-h-72 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curveData} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="oklch(0.93 0.006 255)" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                <ChartTooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.915 0.008 255)", fontSize: 12, fontFamily: "var(--font-sans)" }}
                  formatter={(v) => [`${v}%`]}
                />
                {todayLabel && (
                  <ReferenceLine
                    x={todayLabel}
                    stroke={BLUE}
                    strokeDasharray="4 4"
                    label={{ value: d.dashboard.curve.todayMark, position: "top", fontSize: 10.5, fill: BLUE, fontWeight: 700 }}
                  />
                )}
                <Line type="monotone" dataKey="planned" name={d.dashboard.curve.planned} stroke={BLUE} strokeWidth={2.5} dot={{ r: 3.5, fill: "white", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="actual" name={d.dashboard.curve.actual} stroke={GREEN} strokeWidth={2.5} dot={{ r: 3.5, fill: "white", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title={d.dashboard.alerts.title}
          tip={d.tips.dashboard.alerts}
          actions={
            <Link href="/rapports" className="text-[12px] font-bold text-blue hover:text-blue-deep">
              {d.common.seeAll}
            </Link>
          }
          bodyClassName="space-y-2.5"
        >
          {projectAlerts.length === 0 && (
            <p className="rounded-xl bg-ok-soft px-4 py-6 text-center text-[12.5px] text-ok-deep">{d.dashboard.alerts.empty}</p>
          )}
          {projectAlerts.slice(0, 4).map((a) => (
            <div
              key={a.id}
              className={cn(
                "rounded-xl border p-3.5",
                a.severity === "critique" ? "border-danger/30 bg-danger-soft" : a.severity === "elevee" ? "border-safety/35 bg-safety-soft" : "border-line bg-line-soft/40"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className={cn("mt-0.5 h-4 w-4 shrink-0", a.severity === "critique" ? "text-danger" : "text-safety-deep")} />
                  <div>
                    <p className="text-[13px] leading-snug font-bold text-ink">{a.title}</p>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{a.detail}</p>
                  </div>
                </div>
                <span className={cn("shrink-0 text-[10.5px] font-bold uppercase", a.severity === "critique" ? "text-danger" : a.severity === "elevee" ? "text-safety-deep" : "text-ink-soft")}>
                  {t(`common.severity.${a.severity}`)}
                </span>
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    markAlertHandled(a.id);
                    toast(d.dashboard.alerts.handled);
                  }}
                >
                  {d.dashboard.alerts.handle}
                </Button>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Présence / échéances / budget */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SectionCard
          title={d.dashboard.presence.title}
          tip={d.tips.dashboard.presence}
          actions={<span className="text-[11.5px] font-semibold text-ink-soft">{d.common.today}</span>}
          bodyClassName="space-y-3.5"
        >
          {presence.map((row) => {
            const pct = row.planned === 0 ? 0 : Math.round((row.present / row.planned) * 100);
            const tone = row.present === 0 ? "danger" : pct < 80 ? "safety" : "blue";
            return (
              <div key={row.key} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-[12.5px] font-medium text-ink">{t(`trades.${row.key}`)}</span>
                <ProgressBar value={pct} tone={tone} className="flex-1" />
                <span className="w-12 text-right font-mono text-[12px] font-bold text-ink">
                  {row.present}/{row.planned}
                </span>
                <span className={cn("w-10 text-right font-mono text-[11.5px] font-semibold", tone === "danger" ? "text-danger" : tone === "safety" ? "text-safety-deep" : "text-ink-soft")}>
                  {pct}%
                </span>
              </div>
            );
          })}
          <Link href="/pointage" className="inline-block pt-1 text-[12px] font-bold text-blue hover:text-blue-deep">
            {d.dashboard.presence.detail} →
          </Link>
        </SectionCard>

        <SectionCard
          title={d.dashboard.deadlines.title}
          actions={
            <Link href="/taches" className="text-[12px] font-bold text-blue hover:text-blue-deep">
              {d.common.seeAll}
            </Link>
          }
          bodyClassName="divide-y divide-line-soft"
        >
          {deadlines.map((tk) => (
            <Link key={tk.id} href="/taches" className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-line-soft/60">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]",
                  tk.status === "bloquee" ? "bg-danger-soft text-danger" : tk.priority === "haute" ? "bg-safety-soft text-safety-deep" : "bg-blue-soft text-blue-deep"
                )}
              >
                <AlarmClockCheck className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-semibold text-ink">{tk.title}</span>
                <span className="block text-[11px] text-ink-soft">{t(`trades.${tk.trade}`)}</span>
              </span>
              <span className="shrink-0 font-mono text-[11.5px] font-semibold text-blue-deep">{fmtDate(tk.due, lang)}</span>
            </Link>
          ))}
        </SectionCard>

        <SectionCard title={d.dashboard.budget.title} className="lg:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-2">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={project.budgetBreakdown} dataKey="pct" nameKey="key" innerRadius={54} outerRadius={80} paddingAngle={2} strokeWidth={0}>
                    {project.budgetBreakdown.map((entry, i) => (
                      <Cell key={entry.key} fill={DONUT[i % DONUT.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-[16px] font-bold text-ink">{fmtEuro(project.budgetTotal, lang, true)}</span>
                <span className="text-[10px] text-ink-soft">{d.dashboard.kpi.budgetTotal}</span>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-2">
              {project.budgetBreakdown.map((b, i) => (
                <li key={b.key} className="flex items-center gap-2 text-[12px]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: DONUT[i % DONUT.length] }} />
                  <span className="min-w-0 flex-1 truncate text-ink">{t(`dashboard.budget.lots.${b.key}`)}</span>
                  <span className="font-mono font-bold text-ink">{b.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11.5px] text-ink-faint">
        <span>
          {d.dashboard.updatedAt} <span className="font-mono font-semibold">08:45</span> · {d.common.demoData}
        </span>
        <Tooltip label={d.common.demoData}>
          <button onClick={() => toast(d.rapports.sentTo)} className="inline-flex items-center gap-1.5 font-semibold text-ink-soft hover:text-ink">
            <Download className="h-3.5 w-3.5" /> {d.common.exportView}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
