"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlarmClockCheck,
  Bot,
  Building2,
  Camera,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Euro,
  FileBarChart2,
  FolderOpen,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  MessageCircle,
  NotebookPen,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { cn, LogoMark } from "@/components/ui";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  labelKey: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    labelKey: "pilotage",
    items: [
      { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
      { href: "/chantiers", labelKey: "chantiers", icon: Building2 },
    ],
  },
  {
    labelKey: "terrain",
    items: [
      { href: "/pointage", labelKey: "pointage", icon: AlarmClockCheck },
      { href: "/taches", labelKey: "taches", icon: ListChecks },
      { href: "/journal", labelKey: "journal", icon: NotebookPen },
      { href: "/photos", labelKey: "photos", icon: Camera },
    ],
  },
  {
    labelKey: "gestion",
    items: [
      { href: "/reserves", labelKey: "reserves", icon: ClipboardList },
      { href: "/achats", labelKey: "achats", icon: ShoppingCart },
      { href: "/finances", labelKey: "finances", icon: Euro },
      { href: "/documents", labelKey: "documents", icon: FolderOpen },
    ],
  },
  {
    labelKey: "intelligence",
    items: [
      { href: "/rapports", labelKey: "rapports", icon: FileBarChart2 },
      { href: "/copilote", labelKey: "copilote", icon: Bot },
    ],
  },
  {
    labelKey: "communication",
    items: [
      { href: "/messages", labelKey: "messages", icon: MessageCircle },
      { href: "/support", labelKey: "support", icon: LifeBuoy },
    ],
  },
  {
    labelKey: "entreprise",
    items: [
      { href: "/equipes", labelKey: "equipes", icon: Users },
      { href: "/parametres", labelKey: "parametres", icon: Settings },
    ],
  },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { d, t } = useI18n();
  const { convs } = useDemo();
  const [collapsed, setCollapsed] = useState(false);
  const unreadTotal = convs.reduce((s, c) => s + c.unread, 0);

  return (
    <nav
      aria-label="Navigation"
      className={cn(
        "flex h-full flex-col bg-linear-to-b from-blue to-blue-deep text-blue-ink transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-[248px]"
      )}
    >
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 pt-5 pb-4" onClick={onNavigate}>
        <LogoMark className="h-7 w-7 shrink-0 text-white" />
        {!collapsed && <span className="text-[17px] font-bold tracking-tight text-white">Buildnivo</span>}
      </Link>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((g) => (
          <div key={g.labelKey} className="mt-3 first:mt-1">
            {!collapsed && (
              <p className="px-2.5 pb-1.5 text-[10px] font-bold tracking-[0.14em] text-white/45 uppercase">
                {t(`nav.groups.${g.labelKey}`)}
              </p>
            )}
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname === it.href || pathname.startsWith(it.href + "/");
                const Icon = it.icon;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? t(`nav.${it.labelKey}`) : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-[13px] font-semibold transition-colors duration-150",
                        active ? "bg-white text-blue-deep shadow-[0_1px_3px_oklch(0_0_0/0.18)]" : "text-white/80 hover:bg-white/10 hover:text-white",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <span className="relative shrink-0">
                        <Icon className="h-[18px] w-[18px]" />
                        {collapsed && it.labelKey === "messages" && unreadTotal > 0 && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-safety" aria-hidden="true" />
                        )}
                      </span>
                      {!collapsed && <span className="truncate">{t(`nav.${it.labelKey}`)}</span>}
                      {!collapsed && it.labelKey === "messages" && unreadTotal > 0 && (
                        <span
                          className={cn(
                            "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[10.5px] font-bold",
                            active ? "bg-blue text-white" : "bg-white/20 text-white"
                          )}
                        >
                          {unreadTotal}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/12 px-3 py-3">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            "hidden w-full items-center gap-3 rounded-[10px] px-2.5 py-2 text-[13px] font-semibold text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white lg:flex",
            collapsed && "justify-center px-0"
          )}
          aria-label={d.nav.collapse}
        >
          {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
          {!collapsed && d.nav.collapse}
        </button>
        {!collapsed && <p className="mt-2 px-2.5 text-[10.5px] text-white/40">{d.nav.prototype}</p>}
      </div>
    </nav>
  );
}
