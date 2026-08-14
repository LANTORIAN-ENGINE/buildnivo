"use client";

/**
 * Le paysage concurrentiel, critère par critère. La ligne BuildNivo est mise en avant :
 * l'intérêt du tableau n'est pas de disqualifier les autres — ce sont de bons produits —
 * mais de montrer l'angle mort qu'aucun ne couvre.
 */

import { Check, Minus } from "lucide-react";
import { type Coverage, compareCriteria, competitors } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { useInView } from "../motion";

function Mark({ value, delay }: { value: Coverage; delay: number }) {
  return (
    <span
      className={cn(
        "pop-in inline-flex h-7 w-7 items-center justify-center rounded-full",
        value === "yes" && "bg-blue text-blue-ink",
        value === "partial" && "bg-blue-soft text-blue-deep",
        value === "no" && "bg-line-soft text-ink-faint"
      )}
      style={{ ["--delay" as string]: `${delay}ms` }}
    >
      {value === "yes" && <Check className="h-4 w-4" />}
      {value === "partial" && <span className="h-2.5 w-2.5 rounded-full bg-blue/60" />}
      {value === "no" && <Minus className="h-3.5 w-3.5" />}
    </span>
  );
}

export function CompareGrid({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.15 });

  return (
    <div ref={ref} className={className}>
      <div className="overflow-x-auto rounded-(--radius-card) border border-line bg-card">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="w-[260px] px-4 py-3 text-[11px] font-bold tracking-[0.14em] text-ink-faint uppercase">
                {d.site.compare.eyebrow}
              </th>
              {compareCriteria.map((c) => (
                <th key={c} className="w-[104px] px-3 py-3 align-bottom text-[11.5px] leading-snug font-semibold text-ink">
                  {t(`site.compare.criteria.${c}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competitors.map((row, r) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-line-soft transition-colors duration-200 last:border-0",
                  row.self ? "bg-blue-soft/45" : "hover:bg-line-soft/40"
                )}
              >
                <th scope="row" className="px-4 py-3.5 align-top">
                  <span className={cn("block text-[13px] font-bold", row.self ? "text-blue-deep" : "text-ink")}>
                    {t(`site.compare.players.${row.id}.name`)}
                  </span>
                  <span className="mt-0.5 block max-w-[34ch] text-[11.5px] leading-snug font-normal text-ink-soft">
                    {t(`site.compare.players.${row.id}.text`)}
                  </span>
                </th>
                {compareCriteria.map((c, i) => (
                  <td key={c} className="px-3 py-3.5 align-top">
                    {inView && <Mark value={row.coverage[c]} delay={r * 90 + i * 45} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-ink-soft">
        {(["yes", "partial", "no"] as Coverage[]).map((v) => (
          <span key={v} className="inline-flex items-center gap-2">
            <Mark value={v} delay={0} />
            {t(`site.common.coverage.${v}`)}
          </span>
        ))}
      </div>
    </div>
  );
}
