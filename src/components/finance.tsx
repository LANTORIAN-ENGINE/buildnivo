"use client";

/**
 * Kit du module « Contrôle financier ».
 *
 * Une seule idée porte tout l'écran : chez un financeur, **un chiffre ne
 * circule jamais seul**. Chaque valeur est rendue comme un relevé certifié —
 * la valeur, sa fraîcheur, son statut de validation, et la provenance à un clic
 * (origine, mode de calcul, pièces justificatives).
 *
 * Trois états visuels, et trois seulement :
 *   · à jour     → filet neutre ;
 *   · ancienne   → hachure ambre sous la valeur (plus de 30 jours) ;
 *   · absente    → gabarit vide « non communiquée », jamais un zéro.
 */

import { useEffect, useRef, useState } from "react";
import { EyeOff, FileText, Info, Lock } from "lucide-react";
import type { DataStatus, TracedFigure } from "@/types";
import { documents } from "@/data";
import { fmtDate, fmtEuro, useI18n } from "@/lib/i18n";
import { cn, StatusPill, type Tone } from "@/components/ui";

/** Au-delà de ce seuil, la donnée est signalée comme ancienne. */
export const STALE_DAYS = 30;

export const ageInDays = (iso: string) =>
  Math.max(0, Math.round((Date.now() - new Date(iso + "T12:00:00").getTime()) / 86_400_000));

export const isStale = (iso: string) => ageInDays(iso) > STALE_DAYS;

const statusTone: Record<DataStatus, Tone> = {
  valide: "ok",
  aValider: "safety",
  declaratif: "neutral",
};

/* -------------------------------------------------------------------------- */
/* Formatage des valeurs                                                       */
/* -------------------------------------------------------------------------- */

export function formatFigure(f: TracedFigure, lang: "fr" | "en", compact = false): string {
  if (f.value === null) return "—";
  switch (f.unit) {
    case "euro":
      return fmtEuro(f.value, lang, compact);
    case "pct":
      return `${f.value > 0 && f.key === "driftPts" ? "+" : ""}${f.value} %`;
    case "days":
      return `${f.value} ${lang === "fr" ? "j" : "d"}`;
    default:
      return String(f.value);
  }
}

/* -------------------------------------------------------------------------- */
/* Fraîcheur                                                                   */
/* -------------------------------------------------------------------------- */

export function Freshness({ at, className }: { at: string; className?: string }) {
  const { d, lang } = useI18n();
  const age = ageInDays(at);
  const stale = age > STALE_DAYS;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[10.5px] whitespace-nowrap",
        stale ? "font-bold text-safety-deep" : "text-ink-faint",
        className
      )}
      title={`${d.controle.trace.updatedAt} : ${fmtDate(at, lang, { day: "numeric", month: "long", year: "numeric" })}`}
    >
      {age === 0 ? d.controle.freshness.today : d.controle.freshness.days.replace("{n}", String(age))}
      {stale && <span className="rounded-sm bg-safety-soft px-1">{d.controle.freshness.stale}</span>}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Provenance : origine, calcul, statut, pièces                                */
/* -------------------------------------------------------------------------- */

function Provenance({ f, align = "right" }: { f: TracedFigure; align?: "left" | "right" }) {
  const { d, t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const docs = (f.docIds ?? []).map((id) => documents.find((doc) => doc.id === id)).filter(Boolean);

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={d.controle.trace.open}
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-150",
          open ? "bg-blue text-white" : "text-ink-faint hover:bg-blue-soft hover:text-blue-deep"
        )}
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {open && (
        <span
          className={cn(
            "rise-in absolute top-full z-50 mt-2 block w-80 rounded-xl border border-blue/25 bg-card p-4 text-left shadow-(--shadow-pop)",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <span className="block font-mono text-[10px] font-bold tracking-[0.14em] text-blue uppercase">
            {d.controle.trace.title}
          </span>
          <span className="mt-1 block text-[13px] font-bold text-ink">{t(`controle.figures.${f.key}`)}</span>

          <dl className="mt-3 space-y-2.5 border-t border-line pt-3">
            {(
              [
                [d.controle.trace.updatedAt, fmtDate(f.updatedAt, lang, { day: "numeric", month: "long", year: "numeric" })],
                [d.controle.trace.origin, t(`controle.origins.${f.originKey}`)],
                [d.controle.trace.method, t(`controle.methods.${f.methodKey}`)],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10.5px] font-bold tracking-wide text-ink-faint uppercase">{k}</dt>
                <dd className="mt-0.5 text-[12px] leading-relaxed text-ink">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-[10.5px] font-bold tracking-wide text-ink-faint uppercase">{d.controle.trace.status}</dt>
              <dd className="mt-1 flex flex-col gap-1">
                <StatusPill tone={statusTone[f.status]} className="self-start">
                  {t(`controle.status.${f.status}`)}
                </StatusPill>
                <span className="text-[11.5px] leading-relaxed text-ink-soft">{t(`controle.statusHint.${f.status}`)}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[10.5px] font-bold tracking-wide text-ink-faint uppercase">{d.controle.trace.docs}</dt>
              <dd className="mt-1">
                {docs.length === 0 ? (
                  <span className="text-[11.5px] text-ink-faint">{d.controle.trace.noDocs}</span>
                ) : (
                  <ul className="space-y-1">
                    {docs.map((doc) => (
                      <li key={doc!.id} className="flex items-start gap-1.5 text-[11.5px] leading-snug text-blue-deep">
                        <FileText className="mt-0.5 h-3 w-3 shrink-0" />
                        <span>{doc!.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          </dl>
        </span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Tuile d'indicateur (bloc avancement)                                        */
/* -------------------------------------------------------------------------- */

export function FigureTile({
  f,
  icon: Icon,
  tone = "blue",
}: {
  f: TracedFigure;
  icon: React.ComponentType<{ className?: string }>;
  tone?: Tone;
}) {
  const { d, t, lang } = useI18n();
  const stale = isStale(f.updatedAt);
  const missing = f.value === null;

  return (
    <div className="card flex flex-col p-4.5">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[10px]",
            tone === "blue" && "bg-blue-soft text-blue-deep",
            tone === "ok" && "bg-ok-soft text-ok-deep",
            tone === "safety" && "bg-safety-soft text-safety-deep",
            tone === "danger" && "bg-danger-soft text-danger",
            tone === "viz" && "bg-viz-soft text-viz",
            tone === "neutral" && "bg-line-soft text-ink-soft"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <p className="min-w-0 flex-1 pt-1 text-[12.5px] leading-snug font-semibold text-ink-soft">
          {t(`controle.figures.${f.key}`)}
        </p>
        <Provenance f={f} />
      </div>

      <p className="mt-3 mb-3.5">
        {missing ? (
          <span className="figure-void inline-block rounded-md px-3 py-1 text-[13px] font-semibold text-ink-faint italic">
            {d.controle.notProvided}
          </span>
        ) : (
          <span className={cn("font-mono text-[26px] leading-none font-bold tracking-tight text-ink", stale && "stale-hatch")}>
            {formatFigure(f, lang)}
          </span>
        )}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line-soft pt-2.5">
        <Freshness at={f.updatedAt} />
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", f.status === "valide" ? "bg-ok" : f.status === "aValider" ? "bg-safety" : "bg-ink-faint")} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ligne de relevé (situation financière, financement)                         */
/* -------------------------------------------------------------------------- */

export function FigureRow({ f, emphasis = false }: { f: TracedFigure; emphasis?: boolean }) {
  const { d, t, lang } = useI18n();
  const stale = isStale(f.updatedAt);
  const missing = f.value === null;

  return (
    <tr className={cn("text-[12.5px]", emphasis && "bg-blue-soft/35")}>
      <td className="py-2.5 pr-3">
        <span className={cn("text-ink", emphasis ? "font-bold" : "font-medium")}>{t(`controle.figures.${f.key}`)}</span>
      </td>
      <td className="px-3 py-2.5 text-right">
        {missing ? (
          <span className="figure-void inline-block rounded-md px-2 py-0.5 text-[11.5px] font-semibold text-ink-faint italic">
            {d.controle.notProvided}
          </span>
        ) : (
          <span
            className={cn(
              "font-mono font-bold whitespace-nowrap",
              emphasis ? "text-[15px] text-blue-deep" : "text-[13px] text-ink",
              stale && "stale-hatch"
            )}
          >
            {formatFigure(f, lang)}
          </span>
        )}
      </td>
      <td className="hidden px-3 py-2.5 text-right sm:table-cell">
        <Freshness at={f.updatedAt} />
      </td>
      <td className="hidden px-3 py-2.5 md:table-cell">
        <StatusPill tone={statusTone[f.status]} dot={false}>
          {t(`controle.status.${f.status}`)}
        </StatusPill>
      </td>
      <td className="py-2.5 pl-3 text-right">
        <Provenance f={f} />
      </td>
    </tr>
  );
}

export function FigureTable({ figures, emphasise = [] }: { figures: TracedFigure[]; emphasise?: string[] }) {
  const { d } = useI18n();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-line text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">
            <th className="py-2 pr-3">{d.controle.indicator}</th>
            <th className="px-3 py-2 text-right">{d.common.amount}</th>
            <th className="hidden px-3 py-2 text-right sm:table-cell">{d.controle.freshness.updated}</th>
            <th className="hidden px-3 py-2 md:table-cell">{d.controle.trace.status}</th>
            <th className="py-2 pl-3 text-right">
              <span className="sr-only">{d.controle.trace.open}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {figures.map((f) => (
            <FigureRow key={f.key} f={f} emphasis={emphasise.includes(f.key)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bloc non partagé par le promoteur                                           */
/* -------------------------------------------------------------------------- */

export function NotSharedBlock({ label }: { label: string }) {
  const { d } = useI18n();
  return (
    <div className="blueprint-grid flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line px-6 py-9 text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-line-soft text-ink-faint">
        <EyeOff className="h-4.5 w-4.5" />
      </span>
      <p className="text-[13px] font-bold text-ink">
        {label} — {d.controle.notShared}
      </p>
      <p className="max-w-sm text-[12px] leading-relaxed text-ink-soft">{d.controle.notSharedHint}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bandeau « lecture seule »                                                   */
/* -------------------------------------------------------------------------- */

export function ReadOnlyBanner({ orgName, reference }: { orgName: string; reference: string }) {
  const { d } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-(--radius-card) border border-blue/25 bg-blue-soft/45 px-4 py-3">
      <span className="flex items-center gap-2 text-[12.5px] font-bold text-blue-deep">
        <Lock className="h-4 w-4" />
        {d.controle.readOnly}
      </span>
      <span className="h-4 w-px bg-blue/25" />
      <span className="min-w-0 text-[12px] text-ink">
        <span className="font-semibold">{orgName}</span> · <span className="font-mono text-[11.5px]">{reference}</span>
      </span>
      <span className="ml-auto max-w-[52ch] text-[11.5px] leading-relaxed text-ink-soft">{d.controle.readOnlyHint}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tampon d'un rapport publié                                                  */
/* -------------------------------------------------------------------------- */

export function ReportSeal({
  reference,
  version,
  date,
  animate = false,
}: {
  reference: string;
  version: number;
  date: string;
  animate?: boolean;
}) {
  const { d } = useI18n();
  return (
    <span
      className={cn(
        "report-seal inline-flex shrink-0 flex-col items-center rounded-[6px] px-3 py-1.5 text-ok-deep",
        animate && "seal-press"
      )}
      title={d.controle.rapports.frozenHint}
    >
      <span className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase">{d.controle.rapports.frozen}</span>
      <span className="font-mono text-[9.5px] tracking-[0.08em] opacity-80">
        {reference} · v{version}
      </span>
      <span className="font-mono text-[9.5px] tracking-[0.08em] opacity-80">{date}</span>
    </span>
  );
}
