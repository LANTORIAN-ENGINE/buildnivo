"use client";

import { Camera, CheckCheck, Megaphone } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReserveStatus } from "@/types";
import { companyById, projectById, projects, zoneLabel } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Button, cn, DemoTip, SectionCard, StatusPill, type Tone } from "@/components/ui";

const statusTones: Record<ReserveStatus, Tone> = {
  ouverte: "safety",
  notifiee: "blue",
  levee: "ok",
  contestee: "danger",
};

export default function ReservesPage() {
  const { d, t, lang } = useI18n();
  const { reserveItems, setReserveStatus, toast } = useDemo();
  const [projectFilter, setProjectFilter] = useState("all");

  const filtered = useMemo(
    () => reserveItems.filter((r) => projectFilter === "all" || r.projectId === projectFilter),
    [reserveItems, projectFilter]
  );

  const openCount = filtered.filter((r) => r.status === "ouverte" || r.status === "notifiee" || r.status === "contestee").length;
  const counts = (["ouverte", "notifiee", "contestee", "levee"] as ReserveStatus[]).map((s) => ({
    status: s,
    n: filtered.filter((r) => r.status === s).length,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.reserves.title}</h1>
            <DemoTip text={d.tips.reserves.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.reserves.subtitle}</p>
        </div>
        <p className="card flex items-center gap-2.5 px-4 py-2.5">
          <span className="font-mono text-[22px] leading-none font-bold text-safety-deep">{openCount}</span>
          <span className="text-[12px] font-semibold text-ink-soft">{d.reserves.open}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setProjectFilter("all")}
          aria-pressed={projectFilter === "all"}
          className={cn(
            "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
            projectFilter === "all" ? "border-blue bg-blue-soft text-blue-deep" : "border-line bg-card text-ink-soft hover:border-ink-faint"
          )}
        >
          {d.common.allProjects}
        </button>
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setProjectFilter(p.id)}
            aria-pressed={projectFilter === p.id}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
              projectFilter === p.id ? "border-blue bg-blue-soft text-blue-deep" : "border-line bg-card text-ink-soft hover:border-ink-faint"
            )}
          >
            {p.name}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {counts.map((c) => (
            <StatusPill key={c.status} tone={statusTones[c.status]}>
              {t(`reserves.status.${c.status}`)} · {c.n}
            </StatusPill>
          ))}
        </div>
      </div>

      <SectionCard bodyClassName="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-line text-[11px] font-bold tracking-wider text-ink-faint uppercase">
              <th className="py-2.5 pr-3">{d.taches.form.label}</th>
              <th className="px-3 py-2.5">{d.common.project}</th>
              <th className="px-3 py-2.5">{d.common.zone}</th>
              <th className="px-3 py-2.5">{d.reserves.company}</th>
              <th className="px-3 py-2.5">{d.reserves.openedOn}</th>
              <th className="px-3 py-2.5">{d.reserves.dueOn}</th>
              <th className="px-3 py-2.5">{d.common.status}</th>
              <th className="py-2.5 pl-3 text-right">{d.common.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {filtered.map((r) => (
              <tr key={r.id} className="text-[12.5px]">
                <td className="max-w-72 py-3 pr-3 font-semibold text-ink">
                  <span className="flex items-center gap-1.5">
                    {r.photoId && <Camera className="h-3.5 w-3.5 shrink-0 text-blue" />}
                    {r.title}
                  </span>
                </td>
                <td className="px-3 py-3 text-ink-soft">{projectById(r.projectId)?.name}</td>
                <td className="px-3 py-3 text-ink-soft">{zoneLabel(r.projectId, r.zoneId)}</td>
                <td className="px-3 py-3 font-medium text-ink">{companyById(r.companyId)?.name}</td>
                <td className="px-3 py-3 font-mono text-ink-soft">{fmtDate(r.openedAt, lang)}</td>
                <td className="px-3 py-3 font-mono text-ink-soft">{fmtDate(r.due, lang)}</td>
                <td className="px-3 py-3">
                  <StatusPill tone={statusTones[r.status]}>{t(`reserves.status.${r.status}`)}</StatusPill>
                </td>
                <td className="py-3 pl-3">
                  <div className="flex justify-end gap-1.5">
                    {(r.status === "ouverte" || r.status === "contestee") && (
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => {
                          setReserveStatus(r.id, "notifiee");
                          toast(d.reserves.notified);
                        }}
                      >
                        <Megaphone className="h-3.5 w-3.5" /> {d.reserves.notify}
                      </Button>
                    )}
                    {r.status !== "levee" && (
                      <Button
                        size="sm"
                        variant="ok"
                        onClick={() => {
                          setReserveStatus(r.id, "levee");
                          toast(d.reserves.lifted);
                        }}
                      >
                        <CheckCheck className="h-3.5 w-3.5" /> {d.reserves.markLifted}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
