"use client";

/** Questions posées avant de signer. Ouverture par transition de grille (hauteur fluide). */

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqItemsSite } from "@/data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";

export function FaqAccordion({ className }: { className?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(faqItemsSite[0]);

  return (
    <div className={cn("divide-y divide-line rounded-(--radius-card) border border-line bg-card", className)}>
      {faqItemsSite.map((id) => {
        const isOpen = open === id;
        return (
          <div key={id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : id)}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-line-soft/40"
            >
              <span className={cn("flex-1 text-[14px] font-bold transition-colors duration-150", isOpen ? "text-blue-deep" : "text-ink")}>
                {t(`site.faq.items.${id}.q`)}
              </span>
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  isOpen ? "rotate-45 bg-blue text-blue-ink" : "bg-line-soft text-ink-soft"
                )}
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[76ch] px-5 pb-5 text-[13px] leading-relaxed text-ink-soft">
                  {t(`site.faq.items.${id}.a`)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
