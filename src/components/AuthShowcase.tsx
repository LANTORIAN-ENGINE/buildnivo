"use client";

import { useEffect, useState } from "react";
import { Check, Fingerprint, KeyRound, Nfc, ScanFace } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Badge, LogoMark, cn } from "@/components/ui";

const METHODS = ["password", "faceid", "fingerprint", "nfc"] as const;
type AuthMethod = (typeof METHODS)[number];

const CYCLE_MS = 4200;

const methodIcons: Record<AuthMethod, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  password: KeyRound,
  faceid: ScanFace,
  fingerprint: Fingerprint,
  nfc: Nfc,
};

function PasswordPanel({ emailLabel, passwordLabel, submitLabel }: { emailLabel: string; passwordLabel: string; submitLabel: string }) {
  return (
    <div className="w-full space-y-2">
      <div>
        <p className="text-[9.5px] font-semibold tracking-wide text-ink-faint uppercase">{emailLabel}</p>
        <div className="mt-1 rounded-md border border-line bg-card px-2.5 py-1.5 font-mono text-[10.5px] text-ink">s.begue@batir-oi.re</div>
      </div>
      <div>
        <p className="text-[9.5px] font-semibold tracking-wide text-ink-faint uppercase">{passwordLabel}</p>
        <div className="mt-1 rounded-md border border-line bg-card px-2.5 py-1.5 font-mono text-[10.5px] text-ink">
          ••••••••
          <span className="auth-caret ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-ink" />
        </div>
      </div>
      <div className="rounded-md bg-blue py-1.5 text-center text-[11px] font-bold text-blue-ink">{submitLabel}</div>
    </div>
  );
}

function FaceIdPanel() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden">
      <span className="absolute top-0 left-0 h-5 w-5 rounded-tl-xl border-t-2 border-l-2 border-blue" />
      <span className="absolute top-0 right-0 h-5 w-5 rounded-tr-xl border-t-2 border-r-2 border-blue" />
      <span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl-xl border-b-2 border-l-2 border-blue" />
      <span className="absolute right-0 bottom-0 h-5 w-5 rounded-br-xl border-r-2 border-b-2 border-blue" />
      <ScanFace className="h-12 w-12 text-blue" strokeWidth={1.5} />
      <span className="auth-scanline absolute inset-x-2 top-2 h-0.5 rounded-full bg-blue/70 shadow-[0_0_8px_2px_oklch(0.51_0.2_264/0.35)]" />
    </div>
  );
}

function FingerprintPanel() {
  return (
    <div className="relative h-24 w-24">
      <Fingerprint className="absolute inset-0 h-full w-full text-blue/20" strokeWidth={1.25} />
      <Fingerprint className="auth-fill absolute inset-0 h-full w-full text-blue" strokeWidth={1.25} />
    </div>
  );
}

function NfcPanel() {
  return (
    <div className="relative flex h-24 w-full items-center justify-center">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-blue/30 bg-blue-soft">
        <span className="auth-ripple absolute inset-0 rounded-full border-2 border-blue/50" />
        <span className="auth-ripple absolute inset-0 rounded-full border-2 border-blue/50" style={{ animationDelay: "0.5s" }} />
        <Nfc className="h-6 w-6 text-blue" />
      </div>
      <div className="auth-tap absolute right-3 bottom-0 w-[88px] rounded-lg border border-line bg-card px-2 py-1.5 shadow-(--shadow-card)">
        <div className="flex items-center gap-1">
          <LogoMark className="h-2.5 w-2.5 text-blue" />
          <p className="text-[8.5px] font-bold tracking-wide text-ink uppercase">S. Bègue</p>
        </div>
        <p className="mt-0.5 font-mono text-[8.5px] text-ink-soft">BN-0003</p>
      </div>
    </div>
  );
}

export function AuthShowcase({ className }: { className?: string }) {
  const { d, t } = useI18n();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % METHODS.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [active, paused, reduced]);

  const method = METHODS[active];

  return (
    <div
      className={cn("flex w-[264px] shrink-0 flex-col items-center gap-3", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <Badge tone="blue">{d.login.auth.simulated}</Badge>
        <p className="text-[13px] font-bold text-ink">{d.login.auth.title}</p>
      </div>

      {/* Téléphone terrain — scène purement démonstrative */}
      <div aria-hidden="true" className="w-[232px] rounded-[32px] border border-line bg-card p-2.5 shadow-(--shadow-pop)">
        <div className="overflow-hidden rounded-[22px] border border-line-soft bg-paper">
          <div className="flex items-center justify-between px-4 pt-2.5">
            <span className="font-mono text-[10px] font-semibold text-ink-faint">07:42</span>
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-ink-faint" />
              <span className="h-1 w-1 rounded-full bg-ink-faint" />
              <span className="h-2 w-4 rounded-[3px] border border-ink-faint p-px">
                <span className="block h-full w-2/3 rounded-[1px] bg-ok" />
              </span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-3">
            <LogoMark className="h-4 w-4 text-blue" />
            <span className="text-[12px] font-bold text-ink">Buildnivo</span>
          </div>
          <div key={method} className="rise-in flex h-[224px] flex-col items-center justify-center gap-3 px-4">
            {method === "password" && (
              <PasswordPanel emailLabel={d.login.auth.fieldEmail} passwordLabel={d.login.auth.fieldPassword} submitLabel={d.login.auth.submit} />
            )}
            {method === "faceid" && <FaceIdPanel />}
            {method === "fingerprint" && <FingerprintPanel />}
            {method === "nfc" && <NfcPanel />}
            {method !== "password" && (
              <p className="text-center text-[11px] leading-snug text-ink-soft">{t(`login.auth.prompts.${method}`)}</p>
            )}
            <div className="flex h-7 items-center">
              <span className="auth-success inline-flex items-center gap-1 rounded-full border border-ok/30 bg-ok-soft px-2.5 py-1 text-[11px] font-bold text-ok-deep">
                <Check className="h-3 w-3" />
                {d.login.auth.success}
              </span>
            </div>
          </div>
          <div className="mx-4 mb-3 h-0.5 overflow-hidden rounded-full bg-line-soft">
            <div
              key={`progress-${method}`}
              className="auth-progress h-full origin-left rounded-full bg-blue"
              style={{ animationPlayState: paused ? "paused" : "running" }}
            />
          </div>
        </div>
      </div>

      <div className="flex max-w-[264px] flex-wrap justify-center gap-1.5" role="group" aria-label={d.login.auth.title}>
        {METHODS.map((m, i) => {
          const Icon = methodIcons[m];
          return (
            <button
              key={m}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors duration-150",
                i === active
                  ? "border-blue bg-blue text-blue-ink"
                  : "border-line bg-card text-ink-soft hover:border-blue/50 hover:text-blue",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(`login.auth.methods.${m}`)}
            </button>
          );
        })}
      </div>

      <p className="max-w-[264px] text-center text-[10.5px] leading-relaxed text-ink-faint">{d.login.auth.note}</p>
    </div>
  );
}
