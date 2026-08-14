"use client";

/**
 * Les trois barrières de confidentialité, rôle par rôle. Chaque ligne est un volet :
 * ouvert (bleu), agrégé (violet data), fermé (gris cadenassé) ou d'urgence (ambre).
 *
 * Le bouton « alerte incident » montre le mécanisme de bris de glace : les accès
 * d'urgence s'ouvrent, et la ligne d'audit apparaît — jamais l'un sans l'autre.
 */

import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldAlert, Sigma } from "lucide-react";
import { type AccessLevel, type RbacRole, rbacBarriers, rbacRoles } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";

const levelStyle: Record<AccessLevel, { chip: string; shutter: string; Icon: React.ComponentType<{ className?: string }> }> = {
  full: { chip: "bg-blue-soft text-blue-deep", shutter: "translate-x-full bg-blue/25", Icon: Eye },
  aggregate: { chip: "bg-viz-soft text-viz", shutter: "translate-x-1/2 bg-viz/25", Icon: Sigma },
  urgent: { chip: "bg-safety-soft text-safety-deep", shutter: "translate-x-[15%] bg-safety/30", Icon: ShieldAlert },
  none: { chip: "bg-line-soft text-ink-soft", shutter: "translate-x-0 bg-ink/12", Icon: Lock },
  na: { chip: "bg-line-soft text-ink-faint", shutter: "translate-x-full bg-transparent", Icon: EyeOff },
};

/* ------------------------- Tableau complet d'une barrière ------------------ */

export function BarrierTable({ barrierId, className }: { barrierId: (typeof rbacBarriers)[number]["id"]; className?: string }) {
  const { t } = useI18n();
  const barrier = rbacBarriers.find((b) => b.id === barrierId);
  if (!barrier) return null;

  return (
    <div className={cn("overflow-x-auto rounded-(--radius-card) border border-line bg-card", className)}>
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th className="w-[220px] px-4 py-3 text-[11px] font-bold tracking-[0.14em] text-ink-faint uppercase">
              {t(`site.rbac.barriers.${barrier.id}.name`)}
            </th>
            {barrier.columns.map((col) => (
              <th key={col} className="px-4 py-3 text-[11.5px] leading-snug font-semibold text-ink">
                {t(`site.rbac.columns.${col}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rbacRoles.map((role) => (
            <tr key={role} className="border-b border-line-soft last:border-0 hover:bg-line-soft/40">
              <th scope="row" className="px-4 py-3 text-[12.5px] font-semibold text-ink">
                {t(`site.rbac.roles.${role}`)}
              </th>
              {barrier.access[role].map((level, i) => {
                const style = levelStyle[level];
                return (
                  <td key={barrier.columns[i]} className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", style.chip)}>
                      <style.Icon className="h-3 w-3" />
                      {t(`site.common.access.${level}`)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BarrierMatrix({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const [role, setRole] = useState<RbacRole>("moa");
  const [emergency, setEmergency] = useState(false);

  const stamp = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]", className)}>
      {/* Choix du rôle */}
      <div>
        <p className="font-mono text-[10.5px] tracking-[0.16em] text-ink-faint uppercase">{d.site.rbac.pick}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 lg:flex-col">
          {rbacRoles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              aria-pressed={role === r}
              className={cn(
                "rounded-[10px] border px-3 py-2 text-left text-[12.5px] font-semibold transition-all duration-200",
                role === r
                  ? "border-blue bg-blue text-blue-ink shadow-[0_6px_18px_oklch(0.51_0.2_264/0.25)]"
                  : "border-line bg-card text-ink-soft hover:border-blue/40 hover:text-ink"
              )}
            >
              {t(`site.rbac.roles.${r}`)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setEmergency((v) => !v)}
          aria-pressed={emergency}
          className={cn(
            "mt-4 flex w-full items-center gap-2 rounded-[10px] border px-3 py-2.5 text-left text-[12px] font-semibold transition-colors duration-200",
            emergency
              ? "border-safety bg-safety-soft text-safety-deep"
              : "border-dashed border-line text-ink-soft hover:border-safety/60 hover:text-safety-deep"
          )}
        >
          <ShieldAlert className={cn("h-4 w-4 shrink-0", emergency && "text-safety")} />
          {d.site.rbac.alertButton}
        </button>
      </div>

      {/* Les trois barrières */}
      <div className="grid gap-4 sm:grid-cols-3">
        {rbacBarriers.map((barrier) => {
          const values = barrier.access[role];
          return (
            <div key={barrier.id} className="card flex flex-col p-4">
              <p className="text-[13px] font-bold text-ink">{t(`site.rbac.barriers.${barrier.id}.name`)}</p>
              <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">{t(`site.rbac.barriers.${barrier.id}.text`)}</p>

              <ul className="mt-4 flex-1 space-y-3">
                {barrier.columns.map((col, i) => {
                  const raw = values[i];
                  const shown: AccessLevel = emergency && raw === "urgent" ? "full" : raw;
                  const style = levelStyle[shown];
                  return (
                    <li key={col}>
                      <p className="text-[11.5px] leading-snug font-semibold text-ink">{t(`site.rbac.columns.${col}`)}</p>
                      {/* volet : il se retire quand l'accès s'ouvre */}
                      <div className="relative mt-1.5 h-6 overflow-hidden rounded-md bg-line-soft/70">
                        <span
                          className={cn("absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", style.shutter)}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 flex items-center gap-1.5 px-2 text-[11px] font-bold",
                            style.chip,
                            "rounded-md"
                          )}
                        >
                          <style.Icon className="h-3 w-3" />
                          {emergency && raw === "urgent"
                            ? `${d.site.common.access.full} · ${d.site.common.access.urgent}`
                            : t(`site.common.access.${shown}`)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-ink-faint">
                {t(`site.rbac.principles.${barrier.id}`)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Journal d'audit : l'accès exceptionnel laisse une trace */}
      {emergency && (
        <p className="pop-in flex flex-wrap items-center gap-2 rounded-xl border border-safety/40 bg-safety-soft/60 px-4 py-3 text-[12px] font-semibold text-safety-deep lg:col-span-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          {d.site.rbac.audit}
          <span className="font-mono text-[11.5px] font-normal">
            · {t(`site.rbac.roles.${role}`)} · {stamp} · {d.site.rbac.alertSeverity.grave}
          </span>
        </p>
      )}
    </div>
  );
}
