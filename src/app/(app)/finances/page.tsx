"use client";

import { AlertTriangle, Euro, Landmark, PiggyBank } from "lucide-react";
import { financeRows, projectById } from "@/data";
import { fmtEuro, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { cn, DemoTip, EmptyState, ProgressBar, SectionCard } from "@/components/ui";

export default function FinancesPage() {
  const { d, t, lang } = useI18n();
  const { activeProjectId } = useDemo();
  const project = projectById(activeProjectId)!;
  const rows = financeRows.filter((r) => r.projectId === activeProjectId);

  const totals = rows.reduce(
    (acc, r) => ({
      budget: acc.budget + r.budget,
      engaged: acc.engaged + r.engaged,
      invoiced: acc.invoiced + r.invoiced,
      paid: acc.paid + r.paid,
    }),
    { budget: 0, engaged: 0, invoiced: 0, paid: 0 }
  );
  const engagedPct = totals.budget ? Math.round((totals.engaged / totals.budget) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.finances.title}</h1>
            <DemoTip text={d.tips.finances.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.finances.subtitle}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Euro className="h-8 w-8" />}
          title={`${d.finances.title} — ${project.name}`}
          hint={d.common.demoData + " · Résidence SUNSET"}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <div className="card flex items-center gap-3 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-blue-soft text-blue-deep">
                <Landmark className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-mono text-[20px] leading-none font-bold text-ink">{fmtEuro(totals.budget, lang, true)}</p>
                <p className="mt-1 text-[11.5px] font-medium text-ink-soft">{d.finances.budget}</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-safety-soft text-safety-deep">
                <Euro className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-mono text-[20px] leading-none font-bold text-ink">
                  {engagedPct}<span className="text-[13px]">%</span>
                </p>
                <p className="mt-1 text-[11.5px] font-medium text-ink-soft">{d.finances.engagedPct}</p>
              </div>
            </div>
            <div className="card col-span-2 flex items-center gap-3 px-4 py-3 lg:col-span-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ok-soft text-ok-deep">
                <PiggyBank className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-mono text-[20px] leading-none font-bold text-ink">{fmtEuro(totals.budget - totals.engaged, lang, true)}</p>
                <p className="mt-1 text-[11.5px] font-medium text-ink-soft">{d.finances.remaining}</p>
              </div>
            </div>
          </div>

          <SectionCard bodyClassName="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold tracking-wider text-ink-faint uppercase">
                  <th className="py-2.5 pr-3">{d.finances.lot}</th>
                  <th className="px-3 py-2.5 text-right">{d.finances.budget}</th>
                  <th className="px-3 py-2.5 text-right">{d.finances.engaged}</th>
                  <th className="w-44 px-3 py-2.5">%</th>
                  <th className="px-3 py-2.5 text-right">{d.finances.invoiced}</th>
                  <th className="px-3 py-2.5 text-right">{d.finances.paid}</th>
                  <th className="py-2.5 pl-3 text-right">{d.finances.remaining}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {rows.map((r) => {
                  const pct = Math.round((r.engaged / r.budget) * 100);
                  const over = r.engaged > r.budget;
                  return (
                    <tr key={r.id} className={cn("text-[12.5px]", over && "bg-danger-soft/50")}>
                      <td className="py-3 pr-3 font-semibold text-ink">
                        <span className="flex items-center gap-2">
                          {t(`finances.lots.${r.lotKey}`)}
                          {over && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-danger-soft px-1.5 py-0.5 text-[10px] font-bold text-danger">
                              <AlertTriangle className="h-3 w-3" /> {d.finances.alertOver}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono">{fmtEuro(r.budget, lang)}</td>
                      <td className={cn("px-3 py-3 text-right font-mono font-bold", over ? "text-danger" : "text-ink")}>{fmtEuro(r.engaged, lang)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={Math.min(pct, 100)} tone={over ? "danger" : pct > 90 ? "safety" : "blue"} className="flex-1" />
                          <span className={cn("w-10 text-right font-mono text-[11.5px] font-semibold", over ? "text-danger" : "text-ink-soft")}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-ink-soft">{fmtEuro(r.invoiced, lang)}</td>
                      <td className="px-3 py-3 text-right font-mono text-ink-soft">{fmtEuro(r.paid, lang)}</td>
                      <td className={cn("py-3 pl-3 text-right font-mono font-semibold", over ? "text-danger" : "text-ok-deep")}>
                        {fmtEuro(r.budget - r.engaged, lang)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-line text-[12.5px] font-bold">
                  <td className="py-3 pr-3">Total</td>
                  <td className="px-3 py-3 text-right font-mono">{fmtEuro(totals.budget, lang)}</td>
                  <td className="px-3 py-3 text-right font-mono">{fmtEuro(totals.engaged, lang)}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={engagedPct} tone="blue" className="flex-1" />
                      <span className="w-10 text-right font-mono text-[11.5px]">{engagedPct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-mono">{fmtEuro(totals.invoiced, lang)}</td>
                  <td className="px-3 py-3 text-right font-mono">{fmtEuro(totals.paid, lang)}</td>
                  <td className="py-3 pl-3 text-right font-mono">{fmtEuro(totals.budget - totals.engaged, lang)}</td>
                </tr>
              </tfoot>
            </table>
          </SectionCard>
        </>
      )}
    </div>
  );
}
