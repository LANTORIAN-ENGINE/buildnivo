"use client";

import { useEffect, useState } from "react";
import { Building2, Check, Fingerprint, KeyRound, Nfc, ScanFace } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LogoMark, cn } from "@/components/ui";

const METHODS = ["password", "faceid", "fingerprint", "nfc"] as const;
type AuthMethod = (typeof METHODS)[number];

const CYCLE_MS = 4200;

const methodIcons: Record<AuthMethod, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  password: KeyRound,
  faceid: ScanFace,
  fingerprint: Fingerprint,
  nfc: Nfc,
};

function PasswordPanel({
  emailLabel,
  passwordLabel,
  submitLabel,
  orLabel,
  ssoLabel,
}: {
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
  orLabel: string;
  ssoLabel: string;
}) {
  return (
    <div className="w-full space-y-2.5">
      <div>
        <p className="text-[9.5px] font-semibold tracking-wide text-ink-faint uppercase">{emailLabel}</p>
        <div className="mt-1 rounded-md border border-line bg-card px-2.5 py-2 font-mono text-[10.5px] text-ink">s.begue@batir-oi.re</div>
      </div>
      <div>
        <p className="text-[9.5px] font-semibold tracking-wide text-ink-faint uppercase">{passwordLabel}</p>
        <div className="mt-1 rounded-md border border-line bg-card px-2.5 py-2 font-mono text-[10.5px] text-ink">
          ••••••••
          <span className="auth-caret ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-ink" />
        </div>
      </div>
      <div className="rounded-md bg-blue py-2 text-center text-[11px] font-bold text-blue-ink">{submitLabel}</div>
      <div className="flex items-center gap-2 pt-0.5">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[9px] font-semibold text-ink-faint uppercase">{orLabel}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="flex items-center justify-center gap-1.5 rounded-md border border-line bg-card py-2 text-[11px] font-bold text-ink">
        <Building2 className="h-3.5 w-3.5 text-blue" />
        {ssoLabel}
      </div>
    </div>
  );
}

function FaceIdPanel() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden">
      <span className="absolute top-0 left-0 h-6 w-6 rounded-tl-xl border-t-2 border-l-2 border-blue" />
      <span className="absolute top-0 right-0 h-6 w-6 rounded-tr-xl border-t-2 border-r-2 border-blue" />
      <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-xl border-b-2 border-l-2 border-blue" />
      <span className="absolute right-0 bottom-0 h-6 w-6 rounded-br-xl border-r-2 border-b-2 border-blue" />
      <ScanFace className="h-14 w-14 text-blue" strokeWidth={1.5} />
      <span className="auth-scanline absolute inset-x-2 top-2 h-0.5 rounded-full bg-blue/70 shadow-[0_0_8px_2px_oklch(0.51_0.2_264/0.35)]" />
    </div>
  );
}

function FingerprintPanel() {
  return (
    <div className="relative h-28 w-28">
      <Fingerprint className="absolute inset-0 h-full w-full text-blue/20" strokeWidth={1.25} />
      <Fingerprint className="auth-fill absolute inset-0 h-full w-full text-blue" strokeWidth={1.25} />
    </div>
  );
}

function NfcPanel() {
  return (
    <div className="relative flex h-28 w-full items-center justify-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-blue/30 bg-blue-soft">
        <span className="auth-ripple absolute inset-0 rounded-full border-2 border-blue/50" />
        <span className="auth-ripple absolute inset-0 rounded-full border-2 border-blue/50" style={{ animationDelay: "0.5s" }} />
        <Nfc className="h-7 w-7 text-blue" />
      </div>
      <div className="auth-tap absolute right-4 bottom-0 w-[92px] rounded-lg border border-line bg-card px-2 py-1.5 shadow-(--shadow-card)">
        <div className="flex items-center gap-1">
          <LogoMark className="h-2.5 w-2.5 text-blue" />
          <p className="text-[8.5px] font-bold tracking-wide text-ink uppercase">S. Bègue</p>
        </div>
        <p className="mt-0.5 font-mono text-[8.5px] text-ink-soft">BN-0003</p>
      </div>
    </div>
  );
}

/** Vitrine animée des modes de connexion — conçue pour le panneau bleu de la page d'accueil. */
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
      className={cn("flex w-full max-w-[320px] flex-col items-center gap-5", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="rounded-md border border-blue-ink/30 bg-blue-ink/10 px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide text-blue-ink uppercase">
          {d.login.auth.simulated}
        </span>
        <p className="text-[16px] font-bold text-blue-ink">{d.login.auth.title}</p>
      </div>

      {/* Téléphone terrain — scène purement démonstrative */}
      <div
        aria-hidden="true"
        className="w-[252px] rounded-[36px] border border-blue-ink/20 bg-card p-2.5 shadow-[0_24px_60px_oklch(0.2_0.1_264/0.45)]"
      >
        <div className="overflow-hidden rounded-[26px] border border-line-soft bg-paper">
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="font-mono text-[10px] font-semibold text-ink-faint">07:42</span>
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-ink-faint" />
              <span className="h-1 w-1 rounded-full bg-ink-faint" />
              <span className="h-2 w-4 rounded-[3px] border border-ink-faint p-px">
                <span className="block h-full w-2/3 rounded-[1px] bg-ok" />
              </span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-4">
            <LogoMark className="h-4 w-4 text-blue" />
            <span className="text-[12.5px] font-bold text-ink">Buildnivo</span>
          </div>
          <div key={method} className="rise-in flex h-[300px] flex-col items-center justify-center gap-3.5 px-4">
            {method === "password" && (
              <PasswordPanel
                emailLabel={d.login.auth.fieldEmail}
                passwordLabel={d.login.auth.fieldPassword}
                submitLabel={d.login.auth.submit}
                orLabel={d.login.auth.or}
                ssoLabel={d.login.auth.sso}
              />
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
          <div className="mx-4 h-0.5 overflow-hidden rounded-full bg-line-soft">
            <div
              key={`progress-${method}`}
              className="auth-progress h-full origin-left rounded-full bg-blue"
              style={{ animationPlayState: paused ? "paused" : "running" }}
            />
          </div>
          <div className="mx-auto mt-3 mb-2.5 h-1 w-16 rounded-full bg-line" />
        </div>
      </div>

      <div className="grid w-full max-w-[280px] grid-cols-2 gap-2" role="group" aria-label={d.login.auth.title}>
        {METHODS.map((m, i) => {
          const Icon = methodIcons[m];
          return (
            <button
              key={m}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-[11.5px] font-semibold transition-colors duration-150 focus-visible:outline-blue-ink",
                i === active
                  ? "border-transparent bg-card text-blue shadow-(--shadow-card)"
                  : "border-blue-ink/25 bg-transparent text-blue-ink/85 hover:bg-blue-ink/10 hover:text-blue-ink",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t(`login.auth.methods.${m}`)}
            </button>
          );
        })}
      </div>

      <p className="max-w-[300px] text-center text-[10.5px] leading-relaxed text-blue-ink/65">{d.login.auth.note}</p>
    </div>
  );
}
