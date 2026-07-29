"use client";

import { clsx, type ClassValue } from "clsx";
import { Check, ChevronDown, Sparkles, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { type Lang, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";

export const cn = (...args: ClassValue[]) => clsx(args);

/* ---------------------------------- Logo ---------------------------------- */

/** Marque relevée au pixel sur reference.png : trois barres à côtés verticaux,
 *  bords haut et bas obliques (5 unités de montée pour 10 de large), base commune.
 *  Rythme court / haute / moyenne, la plus haute au centre, toutes pleines. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 38" className={className} aria-hidden="true" fill="currentColor">
      <polygon points="0,17 10,12 10,33 0,38" />
      <polygon points="12,5 22,0 22,33 12,38" />
      <polygon points="24,13 34,8 34,33 24,38" />
    </svg>
  );
}

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-7 w-7", dark ? "text-white" : "text-blue")} />
      <span className={cn("text-lg font-bold tracking-tight", dark ? "text-white" : "text-ink")}>
        BuildNivo
      </span>
    </span>
  );
}

/* --------------------------------- Button --------------------------------- */

type ButtonVariant = "primary" | "soft" | "ghost" | "danger" | "ok" | "outline";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[9px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-9.5 px-4 text-[13px]",
        variant === "primary" && "bg-blue text-blue-ink hover:bg-blue-deep active:bg-blue-deep",
        variant === "soft" && "bg-blue-soft text-blue-deep hover:bg-blue/15",
        variant === "ghost" && "text-ink-soft hover:bg-line-soft hover:text-ink",
        variant === "outline" && "border border-line bg-card text-ink hover:border-ink-faint hover:bg-line-soft/60",
        variant === "danger" && "bg-danger text-white hover:bg-danger-deep",
        variant === "ok" && "bg-ok text-white hover:bg-ok-deep",
        className
      )}
    />
  );
}

/* ------------------------------- StatusPill ------------------------------- */

export type Tone = "blue" | "ok" | "safety" | "danger" | "neutral" | "viz";

const pillTones: Record<Tone, string> = {
  blue: "bg-blue-soft text-blue-deep",
  ok: "bg-ok-soft text-ok-deep",
  safety: "bg-safety-soft text-safety-deep",
  danger: "bg-danger-soft text-danger-deep",
  neutral: "bg-line-soft text-ink-soft",
  viz: "bg-viz-soft text-viz",
};

const dotTones: Record<Tone, string> = {
  blue: "bg-blue",
  ok: "bg-ok",
  safety: "bg-safety",
  danger: "bg-danger",
  neutral: "bg-ink-faint",
  viz: "bg-viz",
};

export function StatusPill({
  tone = "neutral",
  children,
  dot = true,
  pulse = false,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap",
        pillTones[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotTones[tone], pulse && "presence-dot")} />}
      {children}
    </span>
  );
}

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide uppercase", pillTones[tone], className)}>
      {children}
    </span>
  );
}

/* ------------------------------- ProgressBar ------------------------------ */

export function ProgressBar({
  value,
  tone = "blue",
  className,
}: {
  value: number;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line-soft", className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-300", dotTones[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* --------------------------------- Avatar --------------------------------- */

const avatarHues = [220, 262, 152, 30, 300, 190, 90];

export function Avatar({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  const hue = avatarHues[hash % avatarHues.length];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        size === "sm" && "h-7 w-7 text-[10px]",
        size === "md" && "h-9 w-9 text-[12px]",
        size === "lg" && "h-12 w-12 text-[15px]",
        className
      )}
      style={{ background: `oklch(0.55 0.14 ${hue})` }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* ---------------------------------- Tabs ---------------------------------- */

export function Tabs({
  items,
  active,
  onChange,
  className,
}: {
  items: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1 rounded-[11px] border border-line bg-line-soft/50 p-1", className)} role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={active === it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-150",
            active === it.id ? "bg-card text-blue-deep shadow-[0_1px_2px_oklch(0_0_0/0.07)]" : "text-ink-soft hover:text-ink"
          )}
        >
          {it.label}
          {typeof it.count === "number" && (
            <span className={cn("rounded-full px-1.5 text-[10.5px] font-bold", active === it.id ? "bg-blue-soft text-blue-deep" : "bg-line text-ink-soft")}>
              {it.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* --------------------------------- Tooltip -------------------------------- */

export function Tooltip({ label, children, side = "top" }: { label: string; children: React.ReactNode; side?: "top" | "bottom" }) {
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 w-max max-w-[240px] -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-[11.5px] font-medium text-white opacity-0 shadow-(--shadow-pop) transition-opacity duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100",
          side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
        )}
      >
        {label}
      </span>
    </span>
  );
}

/* ------------------------- DemoTip (mode découverte) ----------------------- */

export function DemoTip({ text, className }: { text: string; className?: string }) {
  const { discovery } = useDemo();
  const { d } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!discovery) return null;

  return (
    <span ref={ref} className={cn("relative inline-flex", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-full bg-blue-soft px-2 py-0.5 text-[10.5px] font-bold text-blue-deep transition-colors duration-150 hover:bg-blue/15"
      >
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        {d.tips.label}
      </button>
      {open && (
        <span className="rise-in absolute top-full left-0 z-50 mt-2 block w-72 rounded-xl border border-blue/25 bg-card p-3.5 shadow-(--shadow-pop)">
          <span className="block text-[12.5px] leading-relaxed text-ink">{text}</span>
          <button
            onClick={() => setOpen(false)}
            className="mt-2.5 inline-flex rounded-md bg-blue-soft px-2.5 py-1 text-[11.5px] font-semibold text-blue-deep hover:bg-blue/15"
          >
            {d.tips.gotIt}
          </button>
        </span>
      )}
    </span>
  );
}

/* ---------------------------------- Modal --------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
      <div className={cn("rise-in relative max-h-[88vh] w-full overflow-y-auto rounded-2xl bg-card shadow-(--shadow-pop)", wide ? "max-w-3xl" : "max-w-lg")}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-card px-5 py-3.5">
          <h2 id={titleId} className="text-[15px] font-bold text-ink">
            {title}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-soft hover:bg-line-soft hover:text-ink" aria-label="Close">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------- SectionCard ------------------------------ */

export function SectionCard({
  title,
  actions,
  tip,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  tip?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("card", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 pb-1">
          <div className="flex items-center gap-2.5">
            {title && <h2 className="text-[15px] font-bold text-ink">{title}</h2>}
            {tip && <DemoTip text={tip} />}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn("px-5 pt-2 pb-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/* -------------------------------- EmptyState ------------------------------ */

export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="blueprint-grid flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line px-6 py-10 text-center">
      <span className="text-blue">{icon}</span>
      <p className="text-[14px] font-semibold text-ink">{title}</p>
      {hint && <p className="max-w-sm text-[12.5px] leading-relaxed text-ink-soft">{hint}</p>}
      {action}
    </div>
  );
}

/* ------------------------- Photo chantier simulée -------------------------- */

/**
 * Photo de chantier simulée en SVG (démo 100 % hors-ligne) : silhouette
 * d'immeuble en cours, grue, teinte déterministe par photo.
 */
export function PhotoScene({ hue, className }: { hue: number; className?: string }) {
  const sky = `oklch(0.93 0.035 ${hue})`;
  const skyLow = `oklch(0.86 0.055 ${hue})`;
  const far = `oklch(0.72 0.045 ${hue})`;
  const near = `oklch(0.48 0.05 ${hue})`;
  const slab = `oklch(0.60 0.045 ${hue})`;
  return (
    <svg viewBox="0 0 400 240" className={cn("block h-full w-full", className)} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${hue}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky} />
          <stop offset="1" stopColor={skyLow} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#sky-${hue})`} />
      {/* grue */}
      <g stroke={near} strokeWidth="4" fill="none" opacity="0.85">
        <path d="M70 235 V40 M40 40 H210 M70 18 V40 M40 40 L70 18 L110 40" />
        <path d="M150 40 V64 M150 64 h-10 h20" strokeWidth="3" />
      </g>
      {/* bâtiment arrière */}
      <g fill={far}>
        <rect x="235" y="90" width="130" height="150" rx="2" />
      </g>
      {/* bâtiment principal en chantier */}
      <g>
        <rect x="120" y="110" width="150" height="130" fill={near} rx="2" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={132 + col * 36}
              y={122 + row * 40}
              width="24"
              height="26"
              fill={sky}
              opacity={(row * 4 + col) % 3 === 0 ? 0.55 : 0.9}
            />
          ))
        )}
        {/* dalle supérieure + banches */}
        <rect x="114" y="102" width="162" height="10" fill={slab} rx="2" />
        <rect x="128" y="84" width="10" height="18" fill={slab} />
        <rect x="168" y="84" width="10" height="18" fill={slab} />
        <rect x="208" y="84" width="10" height="18" fill={slab} />
      </g>
      {/* échafaudage */}
      <g stroke={slab} strokeWidth="2.5" opacity="0.8">
        <path d="M280 240 V128 M300 240 V128 M280 145 H300 M280 180 H300 M280 215 H300 M280 128 H300" fill="none" />
      </g>
      {/* sol */}
      <rect y="232" width="400" height="8" fill={near} opacity="0.9" />
    </svg>
  );
}

/* --------------------------- Sélecteur de langue --------------------------- */

export function FlagFR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="20" height="40" fill="#002395" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#ED2939" />
    </svg>
  );
}

export function FlagEN({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4.5" />
      <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
}

const languages: { id: Lang; label: string; Flag: typeof FlagFR }[] = [
  { id: "fr", label: "Français", Flag: FlagFR },
  { id: "en", label: "English", Flag: FlagEN },
];

export function LanguageSelect({ className }: { className?: string }) {
  const { lang, setLang, d } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = languages.find((l) => l.id === lang) ?? languages[0];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={d.topbar.language}
        className="flex h-9.5 items-center gap-2 rounded-[10px] border border-line bg-card px-2.5 transition-colors duration-150 hover:border-ink-faint hover:bg-line-soft/60"
      >
        <current.Flag className="h-3.5 w-5 rounded-[3px] shadow-[inset_0_0_0_1px_oklch(0_0_0/0.08)]" />
        <span className="text-[11.5px] font-bold text-ink uppercase">{current.id}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-ink-faint transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={d.topbar.language}
          className="rise-in absolute right-0 z-50 mt-2 w-44 rounded-xl border border-line bg-card p-1.5 shadow-(--shadow-pop)"
        >
          {languages.map((l) => (
            <li key={l.id}>
              <button
                role="option"
                aria-selected={lang === l.id}
                onClick={() => {
                  setLang(l.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] font-semibold transition-colors duration-150",
                  lang === l.id ? "bg-blue-soft/70 text-blue-deep" : "text-ink hover:bg-line-soft/70"
                )}
              >
                <l.Flag className="h-3.5 w-5 rounded-[3px] shadow-[inset_0_0_0_1px_oklch(0_0_0/0.08)]" />
                <span className="flex-1">{l.label}</span>
                {lang === l.id && <Check className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------- Toaster -------------------------------- */

export function Toaster() {
  const { toasts } = useDemo();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-120 flex w-80 flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="rise-in pointer-events-auto rounded-xl border border-line bg-ink px-4 py-3 text-[12.5px] font-medium text-white shadow-(--shadow-pop)">
          {t.message}
        </div>
      ))}
    </div>
  );
}
