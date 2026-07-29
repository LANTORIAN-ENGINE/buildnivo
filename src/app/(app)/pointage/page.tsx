"use client";

import {
  AlarmClockCheck,
  AlertTriangle,
  CheckCheck,
  Download,
  MapPin,
  Nfc,
  PenLine,
  Printer,
  QrCode,
  Siren,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";
import type { ClockMethod } from "@/types";
import { companyById, employeeById, fullName, inDays, weekHours } from "@/data";
import { useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Avatar, Button, cn, DemoTip, Modal, SectionCard, StatusPill, Tabs, type Tone } from "@/components/ui";

const methodIcons: Record<ClockMethod, React.ComponentType<{ className?: string }>> = {
  nfc: Nfc,
  qr: QrCode,
  geo: MapPin,
  manual: PenLine,
};

const stateTones: Record<string, Tone> = {
  present: "ok",
  pause: "safety",
  parti: "neutral",
  absent: "danger",
};

/** Faux QR « dynamique » : motif déterministe régénéré à chaque pointage. */
function FakeQr({ seed }: { seed: number }) {
  const cells: boolean[] = [];
  let x = seed || 7;
  for (let i = 0; i < 81; i++) {
    x = (x * 1103515245 + 12345) % 2147483648;
    cells.push(x % 3 !== 0);
  }
  return (
    <svg viewBox="0 0 9 9" className="h-20 w-20 rounded-lg border border-line bg-white p-1" aria-hidden="true">
      {cells.map((on, i) =>
        on ? <rect key={i} x={i % 9} y={Math.floor(i / 9)} width="0.92" height="0.92" fill="oklch(0.25 0.02 260)" /> : null
      )}
    </svg>
  );
}

export default function PointagePage() {
  const { d, t, lang } = useI18n();
  const { entries, clockDemo, fixAnomaly, validateDay, toast, activeProjectId } = useDemo();
  const [tab, setTab] = useState("live");
  const [evacOpen, setEvacOpen] = useState(false);
  const [qrSeed, setQrSeed] = useState(42);

  const today = inDays(0);
  const todayEntries = useMemo(
    () => entries.filter((e) => e.projectId === activeProjectId && e.date === today),
    [entries, activeProjectId, today]
  );
  const anomalies = entries.filter((e) => e.projectId === activeProjectId && e.anomalyKey);
  const presentEntries = todayEntries.filter((e) => e.state === "present" || e.state === "pause");
  const totalHours = todayEntries.reduce((s, e) => s + e.hours, 0);

  const clock = (method: ClockMethod) => {
    const hhmm = clockDemo(method);
    setQrSeed((s) => s + 1);
    toast(`${d.pointage.clockDemo.success} — ${t(`pointage.method.${method}`)} ${d.pointage.clockDemo.at} ${hhmm}`);
  };

  const kpis = [
    { icon: UsersRound, label: d.pointage.presentNow, value: presentEntries.length, tone: "ok" as const, pulse: true },
    { icon: AlarmClockCheck, label: d.pointage.plannedToday, value: 15, tone: "blue" as const },
    { icon: AlertTriangle, label: d.pointage.anomalies, value: anomalies.length, tone: anomalies.length ? ("safety" as const) : ("ok" as const) },
    { icon: CheckCheck, label: d.pointage.hoursToday, value: `${totalHours.toFixed(1)} h`, tone: "blue" as const },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.pointage.title}</h1>
            <DemoTip text={d.tips.pointage.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.pointage.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DemoTip text={d.tips.pointage.evacuation} />
          <Button variant="outline" size="sm" onClick={() => setEvacOpen(true)}>
            <Siren className="h-4 w-4 text-danger" /> {d.pointage.evacuationList}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              validateDay();
              toast(d.pointage.dayValidated);
            }}
          >
            <CheckCheck className="h-4 w-4" /> {d.pointage.validateDay}
          </Button>
        </div>
      </div>

      {/* Mini KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card flex items-center gap-3 px-4 py-3">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px]",
                k.tone === "blue" && "bg-blue-soft text-blue-deep",
                k.tone === "ok" && "bg-ok-soft text-ok-deep",
                k.tone === "safety" && "bg-safety-soft text-safety-deep"
              )}
            >
              <k.icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="flex items-center gap-1.5 font-mono text-[20px] leading-none font-bold text-ink">
                {k.value}
                {k.pulse && <span className="presence-dot inline-block h-2 w-2 rounded-full bg-ok" />}
              </p>
              <p className="mt-1 text-[11.5px] font-medium text-ink-soft">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs
        items={[
          { id: "live", label: d.pointage.tabs.live, count: presentEntries.length },
          { id: "feuille", label: d.pointage.tabs.feuille },
          { id: "anomalies", label: d.pointage.tabs.anomalies, count: anomalies.length },
          { id: "export", label: d.pointage.tabs.export },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "live" && (
        <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
          {/* Simulateur salarié */}
          <SectionCard title={d.pointage.clockDemo.title} className="h-fit">
            <p className="text-[12.5px] leading-relaxed text-ink-soft">{d.pointage.clockDemo.hint}</p>
            <div className="mt-4 flex items-center gap-4">
              <FakeQr seed={qrSeed} />
              <div className="flex flex-1 flex-col gap-2">
                <Button onClick={() => clock("nfc")}>
                  <Nfc className="h-4 w-4" /> {d.pointage.clockDemo.badge}
                </Button>
                <Button variant="soft" onClick={() => clock("qr")}>
                  <QrCode className="h-4 w-4" /> {d.pointage.clockDemo.scan}
                </Button>
                <Button variant="soft" onClick={() => clock("geo")}>
                  <MapPin className="h-4 w-4" /> {d.pointage.clockDemo.geo}
                </Button>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-ok-soft px-3 py-2 text-[11.5px] font-medium text-ok-deep">
              <MapPin className="h-3.5 w-3.5" /> {d.pointage.geoOk} · GPS −20.882, 55.451
            </p>
          </SectionCard>

          {/* Liste temps réel */}
          <SectionCard title={d.pointage.tabs.live} bodyClassName="divide-y divide-line-soft">
            {todayEntries.map((e) => {
              const emp = employeeById(e.employeeId);
              if (!emp) return null;
              const company = companyById(emp.companyId);
              const MIcon = methodIcons[e.method];
              return (
                <div key={e.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <Avatar name={fullName(emp)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-ink">
                      {fullName(emp)} <span className="ml-1 font-mono text-[10.5px] font-medium text-ink-faint">{emp.id}</span>
                    </p>
                    <p className="truncate text-[11.5px] text-ink-soft">
                      {t(`jobs.${emp.jobKey}`)} · {company?.name}
                    </p>
                  </div>
                  {e.anomalyKey && (
                    <StatusPill tone="safety" dot={false}>
                      <AlertTriangle className="h-3 w-3" /> {t(`pointage.anomaly.${e.anomalyKey}`)}
                    </StatusPill>
                  )}
                  <span className="hidden items-center gap-1 text-[11.5px] text-ink-soft sm:flex">
                    <MIcon className="h-3.5 w-3.5" /> {t(`pointage.method.${e.method}`)}
                  </span>
                  <span className="w-14 text-right font-mono text-[13px] font-bold text-ink">{e.clockIn ?? "—"}</span>
                  <StatusPill tone={stateTones[e.state]} pulse={e.state === "present"} className="w-24 justify-center">
                    {t(`pointage.state.${e.state}`)}
                  </StatusPill>
                </div>
              );
            })}
          </SectionCard>
        </div>
      )}

      {tab === "feuille" && (
        <SectionCard bodyClassName="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                <th className="py-2.5 pr-3">{d.pointage.sheet.employee}</th>
                <th className="px-3 py-2.5">{d.pointage.sheet.in}</th>
                <th className="px-3 py-2.5">{d.pointage.sheet.breakCol}</th>
                <th className="px-3 py-2.5">{d.pointage.sheet.out}</th>
                <th className="px-3 py-2.5">{d.pointage.sheet.method}</th>
                <th className="px-3 py-2.5 text-right">{d.pointage.sheet.total}</th>
                <th className="py-2.5 pl-3 text-right">{d.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {todayEntries.map((e) => {
                const emp = employeeById(e.employeeId);
                if (!emp) return null;
                return (
                  <tr key={e.id} className="text-[12.5px]">
                    <td className="py-2.5 pr-3 font-semibold text-ink">{fullName(emp)}</td>
                    <td className="px-3 py-2.5 font-mono">{e.clockIn ?? "—"}</td>
                    <td className="px-3 py-2.5 font-mono text-ink-soft">
                      {e.breakStart ? `${e.breakStart}${e.breakEnd ? `–${e.breakEnd}` : "…"}` : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-mono">{e.clockOut ?? "—"}</td>
                    <td className="px-3 py-2.5 text-ink-soft">{t(`pointage.method.${e.method}`)}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold">{e.hours ? `${e.hours.toFixed(1)} h` : "—"}</td>
                    <td className="py-2.5 pl-3 text-right">
                      {e.validated ? (
                        <StatusPill tone="ok" dot={false}>{d.common.validated}</StatusPill>
                      ) : e.anomalyKey ? (
                        <StatusPill tone="safety" dot={false}>{d.pointage.anomalies}</StatusPill>
                      ) : (
                        <StatusPill tone="neutral" dot={false}>{d.common.awaitingValidation}</StatusPill>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-line text-[12.5px] font-bold">
                <td className="py-2.5 pr-3" colSpan={5}>
                  {todayEntries.length} {d.common.people}
                </td>
                <td className="px-3 py-2.5 text-right font-mono">{totalHours.toFixed(1)} h</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </SectionCard>
      )}

      {tab === "anomalies" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <DemoTip text={d.tips.pointage.anomalies} />
          </div>
          {anomalies.length === 0 && (
            <SectionCard>
              <p className="py-6 text-center text-[13px] text-ok-deep">✓ {d.pointage.anomalyFixed}</p>
            </SectionCard>
          )}
          {anomalies.map((e) => {
            const emp = employeeById(e.employeeId);
            if (!emp) return null;
            return (
              <div key={e.id} className="card flex flex-wrap items-center gap-3 border-safety/35 bg-safety-soft/60 px-4 py-3">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-safety-deep" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-ink">
                    {fullName(emp)} — {t(`pointage.anomaly.${e.anomalyKey}`)}
                  </p>
                  <p className="text-[11.5px] text-ink-soft">
                    {e.date === today ? d.common.today : d.common.yesterday} · {e.clockIn ?? "—"} · {t(`pointage.method.${e.method}`)}
                    {!e.geoOk && ` · ${d.pointage.geoKo}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ok"
                  onClick={() => {
                    fixAnomaly(e.id);
                    toast(d.pointage.anomalyFixed);
                  }}
                >
                  <CheckCheck className="h-4 w-4" /> {d.pointage.anomalyAction}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "export" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <SectionCard title={d.pointage.hoursToday}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekHours} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
                  <CartesianGrid stroke="oklch(0.93 0.006 255)" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11.5, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                  <YAxis unit=" h" tick={{ fontSize: 11, fill: "oklch(0.5 0.02 258)" }} axisLine={false} tickLine={false} />
                  <ChartTooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid oklch(0.915 0.008 255)", fontSize: 12, fontFamily: "var(--font-sans)" }}
                    formatter={(v) => [`${v} h`]}
                    cursor={{ fill: "oklch(0.945 0.028 262 / 0.5)" }}
                  />
                  <Bar dataKey="hours" fill="oklch(0.51 0.2 264)" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title={d.pointage.exportPaie} className="h-fit">
            <div className="flex items-start gap-2.5">
              <DemoTip text={d.tips.pointage.export} />
            </div>
            <p className="text-[12.5px] leading-relaxed text-ink-soft">{d.pointage.exportFormats}</p>
            <dl className="mt-4 space-y-2 rounded-xl bg-line-soft/50 p-4 text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">{d.common.thisWeek}</dt>
                <dd className="font-mono font-bold text-ink">571,5 h</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">{d.pointage.sheet.employee}s</dt>
                <dd className="font-mono font-bold text-ink">14</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">{d.pointage.anomalies}</dt>
                <dd className={cn("font-mono font-bold", anomalies.length ? "text-safety-deep" : "text-ok-deep")}>{anomalies.length}</dd>
              </div>
            </dl>
            <Button className="mt-4 w-full" onClick={() => toast(d.pointage.exportDone)}>
              <Download className="h-4 w-4" /> {d.pointage.exportPaie}
            </Button>
          </SectionCard>
        </div>
      )}

      {/* Liste d'évacuation */}
      <Modal open={evacOpen} onClose={() => setEvacOpen(false)} title={d.pointage.evacuationList}>
        <p className="text-[12.5px] leading-relaxed text-ink-soft">{d.pointage.evacuationHint}</p>
        <ul className="mt-4 divide-y divide-line-soft rounded-xl border border-line">
          {presentEntries.map((e, i) => {
            const emp = employeeById(e.employeeId);
            if (!emp) return null;
            return (
              <li key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-6 font-mono text-[11.5px] font-bold text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[13px] font-semibold text-ink">{fullName(emp)}</span>
                <span className="text-[11.5px] text-ink-soft">{companyById(emp.companyId)?.name}</span>
                <span className="font-mono text-[12px] font-semibold text-ink">{e.clockIn}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[13px] font-bold text-ink">
            {presentEntries.length} {d.common.people}
          </p>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Imprimer / Print
          </Button>
        </div>
      </Modal>
    </div>
  );
}
