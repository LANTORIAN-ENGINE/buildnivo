"use client";

/**
 * Boîte à outils de mouvement de la vitrine.
 *
 * Règle : le mouvement ne sert qu'à rendre lisible une idée du produit (une donnée qui
 * remonte, des outils qui se rassemblent, une barrière qui s'ouvre). Toutes les
 * révélations passent par des transitions CSS pour rester dans leur état final quand
 * `prefers-reduced-motion` écrase les durées (voir globals.css).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui";

/* --------------------------------- Hooks ---------------------------------- */

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Détecte l'entrée d'un élément dans le viewport (une seule fois par défaut). */
export function useInView<T extends HTMLElement>({
  once = true,
  amount = 0.2,
  rootMargin = "0px 0px -10% 0px",
}: { once?: boolean; amount?: number; rootMargin?: string } = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Sans IntersectionObserver, on montre le contenu plutôt que de le cacher.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: amount, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, amount, rootMargin]);

  return { ref, inView };
}

/** Progression 0→1 de la traversée d'un élément dans le viewport (sections épinglées). */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, -rect.top / travel)));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress };
}

/* ------------------------------- Révélations ------------------------------- */

type RevealDirection = "up" | "left" | "right" | "scale";

export function Reveal({
  children,
  delay = 0,
  dir = "up",
  className,
  amount,
}: {
  children: React.ReactNode;
  /** retard en millisecondes */
  delay?: number;
  dir?: RevealDirection;
  className?: string;
  amount?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ amount });
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "reveal",
        dir === "left" && "reveal-left",
        dir === "right" && "reveal-right",
        dir === "scale" && "reveal-scale",
        inView && "is-in",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Révélation en cascade : chaque enfant direct part avec `step` ms de décalage. */
export function Stagger({
  children,
  step = 70,
  start = 0,
  dir = "up",
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  step?: number;
  start?: number;
  dir?: RevealDirection;
  className?: string;
  /** appliqué à chaque enveloppe : « h-full » quand la grille étire les cartes */
  itemClassName?: string;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className={className}>
      {items.flat().map((child, i) => (
        <Reveal key={i} delay={start + i * step} dir={dir} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/* --------------------------------- Compteur -------------------------------- */

/** Compteur animé : démarre à l'entrée dans le viewport, format localisé. */
export function CountUp({
  to,
  from = 0,
  decimals = 0,
  duration = 1400,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  from?: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ amount: 0.5 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      // ease-out exponentiel : la valeur s'installe, elle ne freine pas mollement
      const eased = 1 - Math.pow(2, -10 * t);
      setValue(from + (to - from) * (t === 1 ? 1 : eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* --------------------------------- Marquee --------------------------------- */

/** Bandeau défilant : le contenu est dupliqué pour une boucle sans couture. */
export function Marquee({
  children,
  duration = 46,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("marquee-mask group relative overflow-hidden", className)}>
      <div
        className="marquee-track flex w-max items-center gap-3 group-hover:[animation-play-state:paused]"
        style={{ ["--dur" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex items-center gap-3">{children}</div>
        <div className="flex items-center gap-3" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Typewriter ------------------------------- */

/** Frappe caractère par caractère — utilisé pour la dictée du chef de chantier. */
export function useTypewriter(text: string, { speed = 26, active = true }: { speed?: number; active?: boolean } = {}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  const reset = useCallback(() => setIndex(0), []);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setIndex(text.length);
      return;
    }
    if (index >= text.length) return;
    const id = setTimeout(() => setIndex((i) => i + 1), speed);
    return () => clearTimeout(id);
  }, [active, index, reduced, speed, text.length]);

  return { typed: text.slice(0, index), done: index >= text.length, reset };
}
