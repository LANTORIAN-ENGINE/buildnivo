"use client";

import {
  AlarmClockCheck,
  AlertTriangle,
  CalendarClock,
  Camera,
  CheckCircle2,
  Euro,
  Clock3,
  Download,
  Gavel,
  ListChecks,
  Mic,
  ShieldCheck,
  Stamp,
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
import { companyById, inDays, projectById } from "@/data";
import { fmtDate, fmtEuro, useI18n } from "@/lib/i18n";
import { canSee, type KpiKey, roleKpis, roleSections } from "@/lib/permissions";
import { useDemo } from "@/lib/store";
import { Button, cn, DemoTip, ProgressBar, SectionCard, StatusPill, type Tone, Tooltip } from "@/components/ui";

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

interface Kpi {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  note?: string;
  bar?: number;
  barLabel?: string;
  pulse?: boolean;
  tone: Tone;
}

export default function DashboardPage() {
  const { d, t, lang } = useI18n();
  const { persona, activeProjectId, alerts, tasks, submissions, avis, meetings, reserveItems, markAlertHandled, toast } =
    useDemo();
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

  /* ---- Données transverses aux profils externes (visas, avis, réunions) ---- */
  const projectSubs = submissions.filter((s) => s.projectId === activeProjectId);
  const mySubs = projectSubs.filter((s) => s.submittedBy === persona.companyId);
  const pendingVisas = projectSubs.filter((s) => s.status === "enAttente");
  const overdueVisas = pendingVisas.filter((s) => s.dueAt && s.dueAt < inDays(0));
  const myObsToLift = (persona.companyId ? mySubs : projectSubs).filter(
    (s) => s.status === "favorableObs" || s.status === "defavorable"
  );
  const reviewed = projectSubs.filter((s) => s.status !== "enAttente");
  const conformityPct = reviewed.length
    ? Math.round((reviewed.filter((s) => s.status === "favorable").length / reviewed.length) * 100)
    : 0;

  const projectAvis = avis.filter((a) => a.projectId === activeProjectId);
  const myAvis = projectAvis.filter((a) => a.author.includes(persona.lastName));
  const safetyAvis = projectAvis.filter((a) => a.authorRole === "csps" || a.authorRole === "controleur");
  const regulatoryCount = projectAvis.filter((a) => a.nature === "reglementaire").length;

  const projectMeetings = meetings.filter((m) => m.projectId === activeProjectId);
  const nextMeeting = projectMeetings.find((m) => m.status === "planifiee");
  const draftMeeting = projectMeetings.find((m) => m.status === "brouillon");
  const daysToMeeting = nextMeeting
    ? Math.max(0, Math.round((new Date(nextMeeting.date).getTime() - new Date(inDays(0)).getTime()) / 86_400_000))
    : 0;

  const myTasks = tasks.filter(
    (tk) => tk.projectId === activeProjectId && tk.status !== "terminee" && (persona.role !== "soustraitant" || tk.assigneeCompanyId === persona.companyId)
  );
  const openReserves = reserveItems.filter((r) => r.projectId === activeProjectId && r.status !== "levee");

  /** Catalogue complet : chaque profil n'en affiche que ses rubriques. */
  const kpiCatalog: Record<KpiKey, Kpi> = {
    budget: {
      id: "budget",
      icon: Euro,
      label: d.dashboard.kpi.budget,
      value: fmtEuro(project.budgetSpent, lang, true),
      sub: `/ ${fmtEuro(project.budgetTotal, lang, true)}`,
      bar: budgetPct,
      barLabel: `${budgetPct}%`,
      tone: "blue",
    },
    progress: {
      id: "progress",
      icon: TrendingUp,
      label: d.dashboard.kpi.progress,
      value: `${project.progress}`,
      sub: "%",
      bar: project.progress,
      barLabel: `${project.plannedProgress}% ${d.common.vs} ${d.dashboard.curve.planned.toLowerCase()}`,
      tone: "ok",
    },
    delay: {
      id: "delay",
      icon: Clock3,
      label: d.dashboard.kpi.delay,
      value: `${project.delayDays}`,
      sub: d.common.days,
      note: d.dashboard.kpi.vsPlanning,
      tone: project.delayDays > 5 ? "safety" : "ok",
    },
    team: {
      id: "team",
      icon: UsersRound,
      label: d.dashboard.kpi.team,
      value: `${project.headcountToday}`,
      sub: d.common.people,
      note: d.dashboard.kpi.onSite,
      pulse: true,
      tone: "blue",
    },
    myHours: {
      id: "myHours",
      icon: Clock3,
      label: d.dashboard.kpi.myHours,
      value: "31,5",
      sub: d.common.hours,
      note: d.dashboard.kpi.thisWeekSub,
      tone: "blue",
    },
    myTasks: {
      id: "myTasks",
      icon: ListChecks,
      label: d.dashboard.kpi.myTasks,
      value: `${myTasks.length}`,
      note: d.dashboard.kpi.assignedToMe,
      tone: "blue",
    },
    visasPending: {
      id: "visasPending",
      icon: Stamp,
      label: d.dashboard.kpi.visasPending,
      value: `${pendingVisas.length}`,
      note: overdueVisas.length > 0 ? d.dashboard.kpi.overdueVisa : d.dashboard.kpi.toHandle,
      tone: overdueVisas.length > 0 ? "danger" : "safety",
    },
    visaDelay: {
      id: "visaDelay",
      icon: Clock3,
      label: d.dashboard.kpi.visaDelay,
      value: "2,4",
      sub: d.dashboard.kpi.daysUnit,
      note: d.dashboard.kpi.thisWeekSub,
      tone: "blue",
    },
    myPlans: {
      id: "myPlans",
      icon: Stamp,
      label: d.dashboard.kpi.myPlans,
      value: `${mySubs.length || projectSubs.length}`,
      note: `${conformityPct}% ${d.dashboard.kpi.favorableRate}`,
      tone: "blue",
    },
    obsToLift: {
      id: "obsToLift",
      icon: AlertTriangle,
      label: d.dashboard.kpi.obsToLift,
      value: `${myObsToLift.length}`,
      note: d.dashboard.kpi.toHandle,
      tone: myObsToLift.length > 0 ? "safety" : "ok",
    },
    avisOpen: {
      id: "avisOpen",
      icon: Gavel,
      label: d.dashboard.kpi.avisOpen,
      value: `${projectAvis.length}`,
      note: `${regulatoryCount} ${d.dashboard.kpi.regulatory}`,
      tone: "viz",
    },
    conformity: {
      id: "conformity",
      icon: CheckCircle2,
      label: d.dashboard.kpi.conformity,
      value: `${conformityPct}`,
      sub: "%",
      bar: conformityPct,
      barLabel: d.dashboard.kpi.favorableRate,
      tone: "ok",
    },
    safetyAvis: {
      id: "safetyAvis",
      icon: ShieldCheck,
      label: d.dashboard.kpi.safetyAvis,
      value: `${safetyAvis.length}`,
      note: d.dashboard.kpi.toHandle,
      tone: safetyAvis.length > 1 ? "danger" : "safety",
    },
    nextMeeting: {
      id: "nextMeeting",
      icon: CalendarClock,
      label: d.dashboard.kpi.nextMeeting,
      value: `${daysToMeeting}`,
      sub: d.dashboard.kpi.daysUnit,
      note: nextMeeting ? fmtDate(nextMeeting.date, lang, { weekday: "long", day: "numeric", month: "long" }) : "",
      tone: "blue",
    },
    openReserves: {
      id: "openReserves",
      icon: AlertTriangle,
      label: d.dashboard.kpi.openReserves,
      value: `${openReserves.length}`,
      note: d.dashboard.kpi.toHandle,
      tone: openReserves.length > 0 ? "safety" : "ok",
    },
    marketInvoiced: {
      id: "marketInvoiced",
      icon: Euro,
      label: d.dashboard.kpi.marketInvoiced,
      value: fmtEuro(project.budgetSpent, lang, true),
      sub: `/ ${fmtEuro(project.budgetTotal, lang, true)}`,
      bar: budgetPct,
      barLabel: `${budgetPct}% ${d.dashboard.kpi.ofMarkets}`,
      tone: "blue",
    },
  };

  const orderedKpis = roleKpis[persona.role].map((k) => kpiCatalog[k]);
  const sections = roleSections[persona.role];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="sr-only">{d.dashboard.title}</h1>
          <StatusPill tone="blue" dot={false}>
            {t(`roles.${persona.role}`)} · {d.dashboard.kpi.roleScope}
          </StatusPill>
          <DemoTip text={d.tips.roleScope.main} />
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
                  k.tone === "safety" && "bg-safety-soft text-safety-deep",
                  k.tone === "danger" && "bg-danger-soft text-danger",
                  k.tone === "viz" && "bg-viz-soft text-viz",
                  k.tone === "neutral" && "bg-line-soft text-ink-soft"
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
      {(sections.includes("curve") || sections.includes("alerts")) && (
      <div className={cn("grid gap-4", sections.includes("curve") && sections.includes("alerts") && "xl:grid-cols-[1fr_400px]")}>
        {sections.includes("curve") && (
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
        )}

        {sections.includes("alerts") && (
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
        )}
      </div>
      )}

      {/* Rubriques de coordination : visas, avis, réunion */}
      {(sections.includes("visas") || sections.includes("avis") || sections.includes("meeting")) && (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {sections.includes("visas") && (
            <SectionCard
              title={d.dashboard.visas.title}
              tip={d.tips.visas.blocking}
              actions={
                <Link href="/visas" className="text-[12px] font-bold text-blue hover:text-blue-deep">
                  {d.dashboard.visas.seeAll}
                </Link>
              }
              bodyClassName="space-y-2.5"
            >
              {pendingVisas.length === 0 && (
                <p className="rounded-xl bg-ok-soft px-4 py-6 text-center text-[12.5px] text-ok-deep">{d.dashboard.visas.empty}</p>
              )}
              {pendingVisas.slice(0, 4).map((s) => {
                const late = s.dueAt && s.dueAt < inDays(0);
                return (
                  <Link
                    key={s.id}
                    href="/visas"
                    className={cn(
                      "block rounded-xl border p-3",
                      late ? "border-danger/30 bg-danger-soft/60" : "border-line bg-line-soft/40"
                    )}
                  >
                    <p className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-blue-deep">{s.id}</span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-ink">{s.name}</span>
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-ink-soft">
                      <span>{companyById(s.submittedBy)?.name}</span>
                      <span className="font-mono">{s.version}</span>
                      {s.dueAt && (
                        <span className={cn("font-semibold", late ? "text-danger" : "text-safety-deep")}>
                          {late ? d.visas.overdue : `${d.visas.due} ${fmtDate(s.dueAt, lang)}`}
                        </span>
                      )}
                    </p>
                  </Link>
                );
              })}
            </SectionCard>
          )}

          {sections.includes("avis") && (
            <SectionCard
              title={d.dashboard.avis.title}
              tip={d.tips.reunions.avis}
              actions={
                <Link href="/reunions" className="text-[12px] font-bold text-blue hover:text-blue-deep">
                  {d.common.seeAll}
                </Link>
              }
              bodyClassName="space-y-2.5"
            >
              {projectAvis.length === 0 && <p className="text-[12.5px] text-ink-soft">{d.dashboard.avis.empty}</p>}
              {(myAvis.length > 0 ? myAvis : projectAvis).slice(0, 4).map((a) => (
                <Link key={a.id} href="/reunions" className="block rounded-xl border border-line bg-line-soft/40 p-3">
                  <p className="flex items-start gap-2">
                    <Gavel className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue" />
                    <span className="min-w-0">
                      <span className="block text-[12.5px] leading-snug font-semibold text-ink">{a.subject}</span>
                      <span className="mt-0.5 block text-[11px] text-ink-soft">{a.author}</span>
                    </span>
                    <StatusPill tone={a.nature === "reglementaire" ? "danger" : "neutral"} dot={false} className="ml-auto shrink-0">
                      {a.nature === "reglementaire" ? d.reunions.regulatory : d.reunions.observation}
                    </StatusPill>
                  </p>
                </Link>
              ))}
            </SectionCard>
          )}

          {sections.includes("meeting") && (
            <SectionCard title={d.dashboard.meeting.title} tip={d.tips.reunions.main}>
              {nextMeeting && (
                <>
                  <p className="text-[11px] font-bold tracking-wider text-ink-faint uppercase">{d.dashboard.meeting.next}</p>
                  <p className="mt-1 font-mono text-[17px] font-bold text-blue-deep">
                    {fmtDate(nextMeeting.date, lang, { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <p className="mt-1 text-[12px] text-ink-soft">
                    {nextMeeting.attendees.length} {d.dashboard.meeting.attendees}
                  </p>
                </>
              )}
              {draftMeeting && (
                <div className="mt-3 rounded-xl bg-safety-soft px-3.5 py-3">
                  <p className="flex items-center gap-2 text-[12.5px] font-bold text-safety-deep">
                    <CalendarClock className="h-4 w-4" /> {d.dashboard.meeting.draft}
                  </p>
                  <p className="mt-1 text-[11.5px] text-safety-deep">
                    {d.reunions.meetingN}
                    {draftMeeting.number} · {draftMeeting.avisIds.length} {d.reunions.avisSection.toLowerCase()}
                  </p>
                </div>
              )}
              <Link href="/reunions" className="mt-3 inline-block text-[12px] font-bold text-blue hover:text-blue-deep">
                {d.dashboard.meeting.open} →
              </Link>
            </SectionCard>
          )}
        </div>
      )}

      {/* Présence / échéances / budget */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {sections.includes("presence") && (
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
          {canSee(persona.role, "pointage") && (
            <Link href="/pointage" className="inline-block pt-1 text-[12px] font-bold text-blue hover:text-blue-deep">
              {d.dashboard.presence.detail} →
            </Link>
          )}
        </SectionCard>
        )}

        {sections.includes("deadlines") && (
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
        )}

        {sections.includes("budget") && (
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
        )}
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
