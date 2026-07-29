"use client";

import { ArrowRight, Bot, Camera, HandshakeIcon, HardHat, Hammer, LineChart, NotebookPen, QrCode, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Role } from "@/types";
import { personas } from "@/data";
import { useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Avatar, Badge, LanguageSelect, Logo } from "@/components/ui";
import { AuthShowcase } from "@/components/AuthShowcase";

const roleIcons: Record<Role, React.ComponentType<{ className?: string }>> = {
  direction: LineChart,
  conducteur: ClipboardList,
  chef: HardHat,
  ouvrier: Hammer,
  soustraitant: HandshakeIcon,
};

export default function LoginPage() {
  const { d, t } = useI18n();
  const { setPersona } = useDemo();
  const router = useRouter();

  const pitches = [
    { icon: QrCode, text: d.login.pitch.pointage },
    { icon: NotebookPen, text: d.login.pitch.journal },
    { icon: Bot, text: d.login.pitch.ia },
    { icon: Camera, text: d.login.pitch.soustraitants },
  ];

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Panneau bleu : simulation des modes de connexion */}
      <aside className="auth-panel order-2 flex flex-col px-8 py-10 lg:order-1 lg:w-[42%] lg:max-w-[600px] lg:px-10 lg:py-7">
        {/* cn() n'est qu'un clsx : passer « hidden » au Logo entrerait en conflit
            avec son inline-flex de base, d'où le wrapper qui porte l'affichage. */}
        <span className="hidden self-start lg:block">
          <Logo dark />
        </span>
        <div className="flex flex-1 items-center justify-center py-6 lg:py-4">
          <AuthShowcase />
        </div>
      </aside>

      {/* Choix de profil */}
      <main className="blueprint-grid order-1 flex flex-1 flex-col lg:order-2">
        <header className="flex items-center px-6 py-5 lg:px-12">
          <span className="lg:hidden">
            <Logo />
          </span>
          <span className="ml-auto">
            <LanguageSelect />
          </span>
        </header>

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 pb-12 lg:px-12 xl:max-w-5xl 2xl:max-w-6xl">
          <div>
            <Badge tone="blue" className="mb-4">{d.common.demoBadge}</Badge>
            <h1 className="text-[30px] leading-tight font-bold tracking-tight text-ink lg:text-[36px]">{d.login.welcome}</h1>
            <p className="mt-3 max-w-[64ch] text-[14.5px] leading-relaxed text-ink-soft">{d.login.subtitle}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {personas.map((p) => {
              const Icon = roleIcons[p.role];
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPersona(p);
                    router.push("/dashboard");
                  }}
                  className="group card flex flex-col gap-3 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-blue/50 hover:shadow-(--shadow-pop)"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={`${p.firstName} ${p.lastName}`} />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-ink">
                        {p.firstName} {p.lastName}
                      </p>
                      <p className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                        <Icon className="h-3.5 w-3.5 text-blue" />
                        {t(`roles.${p.role}`)}
                      </p>
                    </div>
                  </div>
                  <p className="min-h-9 text-[12px] leading-relaxed text-ink-soft">{t(`login.personaHint.${p.role}`)}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[12.5px] font-bold text-blue group-hover:text-blue-deep">
                    {d.login.choosePersona}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}

            {/* Piliers du produit */}
            <div className="flex flex-col justify-center gap-2.5 rounded-(--radius-card) border border-dashed border-blue/35 bg-blue-soft/40 p-4">
              {pitches.map(({ icon: Icon, text }) => (
                <p key={text} className="flex items-start gap-2.5 text-[12px] leading-snug font-medium text-blue-deep">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                  {text}
                </p>
              ))}
            </div>
          </div>

          <p className="mt-8 max-w-[78ch] text-[11.5px] leading-relaxed text-ink-faint">{d.login.demoNotice}</p>
        </div>
      </main>
    </div>
  );
}
