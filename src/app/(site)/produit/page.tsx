"use client";

/** Les deux produits : ce que couvre Project, ce que couvre Company, et la frontière. */

import { ArrowRight, Check, Cpu, Layers } from "lucide-react";
import { keyFigures } from "@/data";
import { useI18n } from "@/lib/i18n";
import { Chip, CtaLink, Eyebrow, FinalCta, PageHero, SectionHeading, SiteSection, StatBlock } from "@/components/site/kit";
import { CountUp, Reveal, Stagger } from "@/components/site/motion";
import { LevelStack } from "@/components/site/figures/LevelStack";
import { NetworkEffect } from "@/components/site/figures/NetworkEffect";
import { GraceTimeline, TrialTimeline } from "@/components/site/figures/TrialTimeline";

export default function ProductPage() {
  const { d } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={d.site.stack.eyebrow}
        title={d.site.stack.title}
        lead={d.site.stack.lead}
        aside={
          <Reveal delay={160} dir="right">
            <div className="rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-6 backdrop-blur-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                <StatBlock
                  onDark
                  value={
                    <>
                      <CountUp to={keyFigures.projectPrice} /> €
                    </>
                  }
                  label={d.site.stack.levels.project.name}
                  hint={d.site.stack.levels.project.priceLabel}
                />
                <StatBlock
                  onDark
                  value={
                    <>
                      <CountUp to={keyFigures.trialDays} /> j
                    </>
                  }
                  label={d.site.growth.states.trial.name}
                  hint={d.site.growth.trialOnce}
                />
              </div>
              <p className="mt-6 border-t border-blue-ink/15 pt-4 text-[12.5px] leading-relaxed text-blue-ink/70">
                {d.site.stack.pointageNote}
              </p>
            </div>
          </Reveal>
        }
      >
        <div className="flex flex-wrap gap-3">
          <CtaLink href="/connexion" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
            {d.site.nav.demo}
          </CtaLink>
          <CtaLink href="/tarifs" variant="ghostDark">
            {d.site.common.seePricing}
          </CtaLink>
        </div>
      </PageHero>

      {/* Empilement */}
      <SiteSection>
        <LevelStack />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-(--radius-card) border border-ok/30 bg-ok-soft/40 p-5">
              <p className="text-[12px] font-bold tracking-[0.1em] text-ok-deep uppercase">{d.site.common.free}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{d.site.stack.ruleProject}</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="h-full rounded-(--radius-card) border border-blue/30 bg-blue-soft/45 p-5">
              <p className="text-[12px] font-bold tracking-[0.1em] text-blue-deep uppercase">{d.site.common.paid}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{d.site.stack.ruleCompany}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-8">
          <p className="text-[13px] font-bold text-ink">{d.site.stack.frontierTitle}</p>
          <div className="mt-3 overflow-x-auto rounded-(--radius-card) border border-line bg-card">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-3 text-[11.5px] font-bold text-ok-deep">{d.site.stack.frontierProject}</th>
                  <th className="px-4 py-3 text-[11.5px] font-bold text-blue-deep">{d.site.stack.frontierCompany}</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(d.site.stack.frontier) as (keyof typeof d.site.stack.frontier)[]).map((row) => (
                  <tr key={row} className="border-b border-line-soft last:border-0 hover:bg-line-soft/40">
                    <td className="px-4 py-3 text-[12.5px] text-ink">{d.site.stack.frontier[row].project}</td>
                    <td className="px-4 py-3 text-[12.5px] text-ink-soft">{d.site.stack.frontier[row].company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </SiteSection>

      {/* Mécanique d'acquisition */}
      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.growth.eyebrow} title={d.site.growth.title} lead={d.site.growth.lead} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal dir="left">
            <NetworkEffect />
          </Reveal>
          <div>
            <ol className="space-y-3">
              {(Object.keys(d.site.growth.steps) as (keyof typeof d.site.growth.steps)[]).map((step, i) => (
                <Reveal key={step} delay={i * 90}>
                  <li className="flex gap-3.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-soft font-mono text-[11px] font-bold text-blue-deep">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-bold text-ink">{d.site.growth.steps[step].title}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-soft">
                        {d.site.growth.steps[step].text}
                      </span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={360}>
              <div className="mt-6 rounded-xl border border-line bg-paper p-4">
                <p className="text-[12px] font-bold tracking-[0.1em] text-ink-faint uppercase">{d.site.growth.exampleTitle}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink">{d.site.growth.example}</p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={100} className="mt-10">
          <TrialTimeline />
        </Reveal>

        <Stagger className="mt-6 grid gap-3 md:grid-cols-3" step={80} itemClassName="h-full">
          {(Object.keys(d.site.growth.states) as (keyof typeof d.site.growth.states)[]).map((s, i) => (
            <article key={s} className="card h-full p-4">
              <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink-faint">0{i + 1}</span>
              <h3 className="mt-1 text-[13.5px] font-bold text-ink">{d.site.growth.states[s].name}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{d.site.growth.states[s].text}</p>
            </article>
          ))}
        </Stagger>

        <Reveal delay={120} className="mt-6">
          <div className="rounded-(--radius-card) border border-line bg-paper p-5">
            <p className="text-[12px] font-bold tracking-[0.1em] text-ink-faint uppercase">{d.site.growth.contractTitle}</p>
            <p className="mt-2 max-w-[80ch] text-[13.5px] leading-relaxed text-ink">{d.site.growth.contract}</p>
          </div>
        </Reveal>
      </SiteSection>

      {/* Continuité de service */}
      <SiteSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading eyebrow={d.site.growth.graceEyebrow} title={d.site.growth.graceTitle} lead={d.site.growth.graceLead} />
          <Reveal delay={100}>
            <GraceTimeline />
          </Reveal>
        </div>
      </SiteSection>

      {/* Noyau MVP */}
      <SiteSection tone="card">
        <SectionHeading eyebrow={d.site.mvp.eyebrow} title={d.site.mvp.title} lead={d.site.mvp.lead} />

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>{d.site.mvp.coreTitle}</Eyebrow>
            <ul className="mt-4 space-y-2">
              {(Object.keys(d.site.mvp.core) as (keyof typeof d.site.mvp.core)[]).map((c, i) => (
                <Reveal key={c} delay={i * 45}>
                  <li className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink">
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-ok" />
                    {d.site.mvp.core[c]}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow>{d.site.mvp.techTitle}</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(d.site.mvp.tech) as (keyof typeof d.site.mvp.tech)[]).map((k) => (
                <Chip key={k}>
                  <Cpu className="h-3.5 w-3.5 text-blue" />
                  {d.site.mvp.tech[k]}
                </Chip>
              ))}
            </div>

            <Reveal delay={140}>
              <div className="mt-8 card p-5">
                <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-ink-faint uppercase">
                  <Layers className="h-4 w-4 text-blue" />
                  {d.site.mvp.difficultyTitle}
                </p>
                {[
                  { label: d.site.mvp.difficultyFull, value: keyFigures.fullDifficulty, tone: "bg-danger" },
                  { label: d.site.mvp.difficultyMvp, value: keyFigures.mvpDifficulty, tone: "bg-safety" },
                ].map((row, i) => (
                  <div key={row.label} className="mt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[12.5px] font-semibold text-ink">{row.label}</span>
                      <span className="font-mono text-[13px] font-semibold text-ink">{row.value}/10</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line-soft">
                      <Reveal delay={200 + i * 120}>
                        <span className={`block h-1.5 rounded-full ${row.tone}`} style={{ width: `${row.value * 10}%` }} />
                      </Reveal>
                    </div>
                  </div>
                ))}
                <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-soft">
                  {d.site.mvp.difficultyNote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </SiteSection>

      <FinalCta />
    </>
  );
}
