"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SidebarNav } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { Toaster } from "@/components/ui";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
