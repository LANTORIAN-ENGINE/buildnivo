"use client";

import { Bell, ChevronDown, LogOut, Menu, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { personas, projectById, projects } from "@/data";
import { useI18n } from "@/lib/i18n";
import { isExternal } from "@/lib/permissions";
import { useDemo } from "@/lib/store";
import { Avatar, cn, LanguageSelect, StatusPill, Tooltip } from "@/components/ui";

function useClickOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);
  return ref;
}

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { d, t } = useI18n();
  const { persona, setPersona, activeProjectId, setActiveProjectId, discovery, setDiscovery, alerts, toast } = useDemo();
  const router = useRouter();

  const [personaOpen, setPersonaOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const personaRef = useClickOutside(() => setPersonaOpen(false));
  const notifRef = useClickOutside(() => setNotifOpen(false));

  const project = projectById(activeProjectId);
  const unhandled = alerts.filter((a) => a.projectId === activeProjectId && !a.handled);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button onClick={onOpenMenu} className="rounded-lg p-2 text-ink-soft hover:bg-line-soft lg:hidden" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>

        {/* Sélecteur de chantier actif */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative min-w-0">
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              aria-label={d.common.project}
              className="w-full min-w-0 cursor-pointer appearance-none rounded-[10px] border border-transparent bg-transparent py-1.5 pr-8 pl-2 text-[16px] font-bold text-ink transition-colors hover:border-line hover:bg-line-soft/60 sm:text-[18px]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          </div>
          {project && (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-[12.5px] whitespace-nowrap text-ink-soft">
                {project.city} · {project.units}
              </span>
              <StatusPill tone={project.status === "enCours" ? "ok" : project.status === "livraison" ? "safety" : "blue"}>
                {t(`chantiers.status.${project.status}`)}
              </StatusPill>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5 lg:gap-2.5">
          {/* Recherche globale */}
          <div className="relative hidden xl:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              placeholder={d.common.search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push("/documents");
                }
              }}
              className="h-9.5 w-72 rounded-[10px] border border-line bg-paper pl-9 text-[12.5px] text-ink placeholder:text-ink-faint focus:border-blue focus:outline-none"
            />
          </div>

          {/* Mode découverte */}
          <Tooltip label={d.topbar.discovery} side="bottom">
            <button
              onClick={() => {
                setDiscovery(!discovery);
                toast(discovery ? d.topbar.discoveryOff : d.topbar.discoveryOn);
              }}
              aria-pressed={discovery}
              className={cn(
                "inline-flex h-9.5 items-center gap-1.5 rounded-[10px] px-3 text-[12.5px] font-semibold transition-colors duration-150",
                discovery ? "bg-blue-soft text-blue-deep" : "text-ink-soft hover:bg-line-soft"
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden lg:inline">{d.topbar.discovery}</span>
            </button>
          </Tooltip>

          {/* Langue */}
          <LanguageSelect />

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={d.topbar.notifications}
              aria-expanded={notifOpen}
              className="relative rounded-[10px] p-2 text-ink-soft transition-colors hover:bg-line-soft hover:text-ink"
            >
              <Bell className="h-[19px] w-[19px]" />
              {unhandled.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger px-1 font-mono text-[10px] font-bold text-white">
                  {unhandled.length}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="rise-in absolute right-0 z-50 mt-2 w-88 rounded-xl border border-line bg-card shadow-(--shadow-pop)">
                <p className="border-b border-line px-4 py-2.5 text-[12.5px] font-bold text-ink">{d.dashboard.alerts.title}</p>
                <ul className="max-h-80 overflow-y-auto p-1.5">
                  {unhandled.length === 0 && <li className="px-3 py-4 text-[12.5px] text-ink-soft">{d.dashboard.alerts.empty}</li>}
                  {unhandled.map((a) => (
                    <li key={a.id}>
                      <Link
                        href="/dashboard"
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 hover:bg-line-soft/70"
                      >
                        <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", a.severity === "critique" ? "bg-danger" : a.severity === "elevee" ? "bg-safety" : "bg-blue")} />
                        <span>
                          <span className="block text-[12.5px] font-semibold text-ink">{a.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-[11.5px] text-ink-soft">{a.detail}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Persona */}
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setPersonaOpen((v) => !v)}
              aria-expanded={personaOpen}
              className="flex items-center gap-2 rounded-[10px] p-1.5 transition-colors hover:bg-line-soft"
            >
              <Avatar name={`${persona.firstName} ${persona.lastName}`} size="sm" />
              <span className="hidden text-left lg:block">
                <span className="block max-w-36 truncate text-[12.5px] leading-tight font-bold text-ink">
                  {persona.firstName} {persona.lastName[0]}.
                </span>
                <span className="block text-[10.5px] leading-tight text-ink-soft">{t(`roles.${persona.role}`)}</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-ink-faint" />
            </button>
            {personaOpen && (
              <div className="rise-in absolute right-0 z-50 mt-2 max-h-[70vh] w-72 overflow-y-auto rounded-xl border border-line bg-card p-1.5 shadow-(--shadow-pop)">
                <p className="px-3 pt-2 pb-1.5 text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">{d.topbar.switchPersona}</p>
                {/* Entreprise de travaux puis intervenants de l'opération. */}
                {(
                  [
                    { label: d.login.internalTitle, list: personas.filter((p) => !isExternal(p.role)) },
                    { label: d.login.externalTitle, list: personas.filter((p) => isExternal(p.role)) },
                  ] as const
                ).map((group) => (
                  <div key={group.label}>
                    <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-blue-deep uppercase">{group.label}</p>
                    {group.list.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPersona(p);
                          setPersonaOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-line-soft/70",
                          p.id === persona.id && "bg-blue-soft/70"
                        )}
                      >
                        <Avatar name={`${p.firstName} ${p.lastName}`} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate text-[12.5px] font-semibold text-ink">
                            {p.firstName} {p.lastName}
                          </span>
                          <span className="block truncate text-[11px] text-ink-soft">
                            {t(`roles.${p.role}`)} · {p.company}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
                <div className="mt-1 border-t border-line pt-1">
                  <Link
                    href="/connexion"
                    onClick={() => setPersonaOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-ink-soft hover:bg-line-soft/70 hover:text-ink"
                  >
                    <LogOut className="h-4 w-4" />
                    {d.topbar.logout}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
