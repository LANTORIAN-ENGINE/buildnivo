"use client";

import { ArrowRight, CalendarClock, MapPin, UsersRound } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data";
import { fmtDate, fmtEuro, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { cn, DemoTip, ProgressBar, StatusPill, type Tone } from "@/components/ui";

const statusTones: Record<string, Tone> = {
  enCours: "ok",
  demarrage: "blue",
  livraison: "safety",
  sav: "viz",
};

export default function ChantiersPage() {
  const { d, t, lang } = useI18n();
  const { setActiveProjectId } = useDemo();

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.chantiers.title}</h1>
          <DemoTip text={d.tips.chantiers.main} />
        </div>
        <p className="mt-0.5 text-[13px] text-ink-soft">{d.chantiers.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => {
          const budgetPct = Math.round((p.budgetSpent / p.budgetTotal) * 100);
          return (
            <Link
              key={p.id}
              href={`/chantiers/${p.id}`}
              onClick={() => setActiveProjectId(p.id)}
              className="group card p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-blue/50 hover:shadow-(--shadow-pop)"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-bold text-ink group-hover:text-blue-deep">{p.name}</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-soft">
                    <MapPin className="h-3.5 w-3.5 text-blue" /> {p.city} · {p.units}
                  </p>
                </div>
                <StatusPill tone={statusTones[p.status]}>{t(`chantiers.status.${p.status}`)}</StatusPill>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <ProgressBar value={p.progress} tone={p.progress >= p.plannedProgress ? "ok" : "safety"} className="flex-1" />
                <span className="font-mono text-[13px] font-bold text-ink">{p.progress}%</span>
                <span className="text-[11px] text-ink-faint">
                  ({d.dashboard.curve.planned.toLowerCase()} {p.plannedProgress}%)
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line-soft pt-3.5">
                <div>
                  <dt className="text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">{d.chantiers.budget}</dt>
                  <dd className="mt-0.5 font-mono text-[13px] font-bold text-ink">{fmtEuro(p.budgetTotal, lang, true)}</dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">{d.chantiers.team}</dt>
                  <dd className="mt-0.5 flex items-center gap-1 font-mono text-[13px] font-bold text-ink">
                    <UsersRound className="h-3.5 w-3.5 text-blue" /> {p.headcountToday}/{p.headcountPlanned}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">{d.chantiers.planning}</dt>
                  <dd className={cn("mt-0.5 flex items-center gap-1 font-mono text-[13px] font-bold", p.delayDays > 5 ? "text-safety-deep" : "text-ok-deep")}>
                    <CalendarClock className="h-3.5 w-3.5" />
                    {p.delayDays > 0 ? `+${p.delayDays} j` : d.chantiers.onTime}
                  </dd>
                </div>
              </dl>

              <p className="mt-3.5 flex items-center justify-between text-[11.5px] text-ink-faint">
                <span className="font-mono">
                  {fmtDate(p.startDate, lang)} → {fmtDate(p.endDate, lang)}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-blue group-hover:text-blue-deep">
                  {d.chantiers.open}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
