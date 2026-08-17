"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { SidebarNav } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { canSee, homeFor, isFinancial, moduleForPath } from "@/lib/permissions";
import { useDemo } from "@/lib/store";
import { Toaster } from "@/components/ui";

/**
 * Le périmètre d'un profil ne tient pas qu'à la navigation : une URL saisie à
 * la main ne doit pas ouvrir un écran hors périmètre. Un intervenant financier
 * est en outre ramené sur l'opération de son accès — les autres opérations du
 * promoteur ne lui sont ni listées, ni accessibles.
 */
function useScopeGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { persona, accesses, activeProjectId, setActiveProjectId } = useDemo();

  useEffect(() => {
    const moduleKey = moduleForPath(pathname);
    if (moduleKey && !canSee(persona.role, moduleKey)) router.replace(homeFor(persona.role));
  }, [pathname, persona.role, router]);

  useEffect(() => {
    if (!isFinancial(persona.role) || !persona.accessId) return;
    const access = accesses.find((a) => a.id === persona.accessId);
    if (access && access.projectId !== activeProjectId) setActiveProjectId(access.projectId);
  }, [persona, accesses, activeProjectId, setActiveProjectId]);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useScopeGuard();

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh shrink-0 lg:block">
        <SidebarNav />
      </aside>

      {/* Drawer mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-100 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/45" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <div className="rise-in absolute inset-y-0 left-0 flex">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
            <button
              onClick={() => setMenuOpen(false)}
              className="mt-4 ml-2 h-9 w-9 self-start rounded-full bg-card p-2 text-ink shadow-(--shadow-pop)"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 lg:px-6">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}
