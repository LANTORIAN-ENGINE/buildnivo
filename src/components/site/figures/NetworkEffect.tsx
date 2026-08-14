"use client";

/**
 * L'effet réseau : une opération payée par un porteur fait entrer des dizaines
 * d'entreprises invitées, gratuitement. Les nœuds apparaissent en cascade quand la
 * figure entre à l'écran ; quelques entreprises basculent ensuite en Company.
 */

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { useInView, useReducedMotion } from "../motion";

const NODE_COUNT = 24;
const SUBSCRIBED = new Set([2, 6, 11, 17, 21]);

const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
  const inner = i < 9;
  const count = inner ? 9 : NODE_COUNT - 9;
  const idx = inner ? i : i - 9;
  const angle = (idx / count) * Math.PI * 2 + (inner ? 0.35 : 0.1);
  const radius = inner ? 78 : 132;
  return {
    id: i,
    x: 210 + Math.cos(angle) * radius * 1.32,
    y: 155 + Math.sin(angle) * radius * 0.86,
    subscribed: SUBSCRIBED.has(i),
  };
});

export function NetworkEffect({ className }: { className?: string }) {
  const { d } = useI18n();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.35 });
  const [grown, setGrown] = useState(0);

  // Les entreprises rejoignent l'opération une à une, comme des invitations acceptées.
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setGrown(NODE_COUNT);
      return;
    }
    setGrown(0);
    const id = setInterval(() => {
      setGrown((n) => {
        if (n >= NODE_COUNT) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 110);
    return () => clearInterval(id);
  }, [inView, reduced]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <svg viewBox="0 0 420 310" className="w-full" role="img" aria-label={d.site.growth.network.title}>
        {/* liaisons */}
        {nodes.map((n, i) => (
          <line
            key={`l-${n.id}`}
            x1="210"
            y1="155"
            x2={n.x}
            y2={n.y}
            stroke={n.subscribed ? "oklch(0.58 0.13 152 / 0.5)" : "oklch(0.51 0.2 264 / 0.28)"}
            strokeWidth="1.2"
            className={cn("transition-opacity duration-500", i < grown ? "opacity-100" : "opacity-0")}
          />
        ))}

        {/* flux de données qui remonte vers l'opération */}
        {inView && !reduced && (
          <>
            <circle cx="210" cy="155" r="86" fill="none" stroke="oklch(0.51 0.2 264 / 0.18)" strokeWidth="1" className="dash-flow" />
            <circle cx="210" cy="155" r="140" fill="none" stroke="oklch(0.51 0.2 264 / 0.12)" strokeWidth="1" className="dash-flow" />
          </>
        )}

        {/* entreprises invitées */}
        {nodes.map((n, i) => (
          <g
            key={`n-${n.id}`}
            className={cn("transition-all duration-500", i < grown ? "opacity-100" : "opacity-0")}
            style={{ transformOrigin: `${n.x}px ${n.y}px`, transform: i < grown ? "scale(1)" : "scale(0.4)" }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r="8.5"
              fill="var(--color-card)"
              stroke={n.subscribed ? "oklch(0.58 0.13 152)" : "oklch(0.51 0.2 264)"}
              strokeWidth="1.6"
            />
            <circle cx={n.x} cy={n.y} r="3" fill={n.subscribed ? "oklch(0.58 0.13 152)" : "oklch(0.51 0.2 264)"} />
          </g>
        ))}

        {/* le porteur de l'opération */}
        <g>
          <circle cx="210" cy="155" r="46" fill="oklch(0.51 0.2 264)" />
          <circle cx="210" cy="155" r="46" fill="none" stroke="oklch(1 0 0 / 0.35)" strokeWidth="1.5" />
          {!reduced && (
            <circle cx="210" cy="155" r="46" fill="none" stroke="oklch(0.51 0.2 264 / 0.35)" strokeWidth="2" className="node-ring" style={{ transformOrigin: "210px 155px" }} />
          )}
          {/* marque BuildNivo au centre, à l'échelle du viewBox */}
          <g transform="translate(193 137) scale(0.5)" fill="oklch(0.985 0.005 262)">
            <polygon points="0,17 10,12 10,33 0,38" />
            <polygon points="12,5 22,0 22,33 12,38" />
            <polygon points="24,13 34,8 34,33 24,38" />
          </g>
        </g>
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[12px] text-ink-soft">
          <span className="inline-flex h-2.5 w-2.5 rounded-full border-2 border-blue" />
          {d.site.growth.network.node}
          <span className="ml-3 inline-flex h-2.5 w-2.5 rounded-full border-2 border-ok" />
          Company
        </p>
        <p className="font-mono text-[12px] tracking-[0.12em] text-ink-faint uppercase">
          1 <span className="mx-1">→</span> {grown}
        </p>
      </div>
    </div>
  );
}
