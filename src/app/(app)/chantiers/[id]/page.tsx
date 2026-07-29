"use client";

import { ArrowLeft, CalendarClock, Euro, CloudSun, MapPin, Plus, TrendingUp, UserPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";
import { companies, employees, fullName, projectById } from "@/data";
import { fmtDate, fmtEuro, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Avatar, Button, cn, DemoTip, ProgressBar, SectionCard, StatusPill, Tabs, type Tone } from "@/components/ui";

const statusTones: Record<string, Tone> = {
  enCours: "ok",
  demarrage: "blue",
  livraison: "safety",
  sav: "viz",
};

export default function ChantierDetailPage() {
  const params = useParams<{ id: string }>();
  const { d, t, lang } = useI18n();
  const { toast } = useDemo();
  const [tab, setTab] = useState("apercu");

  const project = projectById(params.id);
  if (!project) notFound();

  const team = employees.filter((e) => e.projectId === project.id);
  const teamCompanies = [...new Set(team.map((e) => e.companyId))].map((cid) => ({
    company: companies.find((c) => c.id === cid)!,
    members: team.filter((e) => e.companyId === cid),
  }));

  const curveData = project.curve.map((c) => ({
    ...c,
    label: fmtDate(c.month + "-01", lang, { month: "short", day: undefined }),
    actual: c.actual === 0 ? null : c.actual,
  }));

  return (
    <div className="space-y-4">
      <Link href="/chantiers" className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> {d.chantiers.title}
      </Link>

      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[24px] font-bold tracking-tight text-ink">{project.name}</h1>
              <StatusPill tone={statusTones[project.status]}>{t(`chantiers.status.${project.status}`)}</StatusPill>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-[12.5px] text-ink-soft">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue" /> {project.city} · {project.units}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                {fmtDate(project.startDate, lang)} → {fmtDate(project.endDate, lang)}
              </span>
              <span className="flex items-center gap-1.5">
                <CloudSun className="h-3.5 w-3.5 text-safety-deep" />
                {t(`journal.weather.${project.weather.key}`)} · {project.weather.tempC} °C
              </span>
            </p>
          </div>
          <dl className="flex flex-wrap gap-6">
            <div>
              <dt className="flex items-center gap-1 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                <TrendingUp className="h-3 w-3" /> {d.dashboard.kpi.progress}
              </dt>
              <dd className="mt-1 font-mono text-[20px] leading-none font-bold text-ink">{project.progress}%</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                <Euro className="h-3 w-3" /> {d.chantiers.budget}
              </dt>
              <dd className="mt-1 font-mono text-[20px] leading-none font-bold text-ink">{fmtEuro(project.budgetTotal, lang, true)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                <UsersRound className="h-3 w-3" /> {d.chantiers.team}
              </dt>
              <dd className="mt-1 font-mono text-[20px] leading-none font-bold text-ink">
                {project.headcountToday}
                <span className="text-[13px] text-ink-soft">/{project.headcountPlanned}</span>
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
                <CalendarClock className="h-3 w-3" /> {d.chantiers.delay}
              </dt>
              <dd className={cn("mt-1 font-mono text-[20px] leading-none font-bold", project.delayDays > 5 ? "text-safety-deep" : "text-ok-deep")}>
                {project.delayDays > 0 ? `+${project.delayDays} j` : "0 j"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Tabs
        items={[
          { id: "apercu", label: d.chantiers.tabs.apercu },
          { id: "zones", label: d.chantiers.tabs.zones, count: project.zones.length },
          { id: "intervenants", label: d.chantiers.tabs.intervenants, count: team.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "apercu" && (
        <SectionCard title={d.dashboard.curve.title}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curveData} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="oklch(0.93 0.006 255)" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                <ChartTooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.915 0.008 255)", fontSize: 12, fontFamily: "var(--font-sans)" }}
                  formatter={(v) => [`${v}%`]}
                />
                <Line type="monotone" dataKey="planned" name={d.dashboard.curve.planned} stroke="oklch(0.51 0.2 264)" strokeWidth={2.5} dot={{ r: 3.5, fill: "white", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="actual" name={d.dashboard.curve.actual} stroke="oklch(0.58 0.13 152)" strokeWidth={2.5} dot={{ r: 3.5, fill: "white", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}

      {tab === "zones" && (
        <SectionCard title={d.chantiers.progressByZone} tip={d.tips.chantiers.main} bodyClassName="space-y-4">
          {project.zones.map((z) => (
            <div key={z.id} className="flex items-center gap-4">
              <span className="w-44 shrink-0 text-[13px] font-semibold text-ink">{z.label}</span>
              <ProgressBar value={z.progress} tone={z.progress >= 80 ? "ok" : z.progress >= 30 ? "blue" : "neutral"} className="flex-1" />
              <span className="w-12 text-right font-mono text-[13px] font-bold text-ink">{z.progress}%</span>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === "intervenants" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast(d.chantiers.attached)}>
              <UserPlus className="h-4 w-4" /> {d.chantiers.attach}
            </Button>
          </div>
          {teamCompanies.map(({ company, members }) => (
            <SectionCard
              key={company.id}
              title={
                <span className="flex items-center gap-2.5">
                  {company.name}
                  <StatusPill tone={company.kind === "generale" ? "blue" : "viz"} dot={false}>
                    {company.kind === "generale" ? "EG" : t(`equipes.tabs.soustraitants`)}
                  </StatusPill>
                  {!company.docsOk && <StatusPill tone="danger">{d.equipes.docsMissing}</StatusPill>}
                </span>
              }
              bodyClassName="grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
            >
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-line-soft px-3.5 py-2.5">
                  <Avatar name={fullName(m)} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-bold text-ink">{fullName(m)}</p>
                    <p className="truncate text-[11px] text-ink-soft">
                      {t(`jobs.${m.jobKey}`)} · <span className="font-mono">{m.id}</span>
                    </p>
                  </div>
                </div>
              ))}
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
