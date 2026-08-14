"use client";

/** Cloisonnement des données par rôle : les trois barrières, les alertes, l'audit. */

import { ArrowRight, FileLock2, ShieldAlert, Users } from "lucide-react";
import { alertRecipients, alertSeverities, rbacBarriers } from "@/data";
import { useI18n } from "@/lib/i18n";
import { Chip, CtaLink, Eyebrow, FinalCta, PageHero, SectionHeading, SiteSection } from "@/components/site/kit";
import { Reveal, Stagger } from "@/components/site/motion";
import { BarrierMatrix, BarrierTable } from "@/components/site/figures/BarrierMatrix";

export default function SecurityPage() {
  const { d, t } = useI18n();

  return (
    <>
      <PageHero
        eyebrow={d.site.rbac.eyebrow}
        title={d.site.rbac.title}
        lead={d.site.rbac.lead}
        aside={
          <Reveal delay={160} dir="right">
            <ul className="space-y-3">
              {rbacBarriers.map((b, i) => (
                <li
                  key={b.id}
                  className="rounded-(--radius-card) border border-blue-ink/20 bg-blue-ink/8 p-4 backdrop-blur-sm"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <p className="text-[13px] font-bold text-blue-ink">{t(`site.rbac.barriers.${b.id}.name`)}</p>
                  <p className="mt-1 text-[12px] leading-snug text-blue-ink/70">{t(`site.rbac.barriers.${b.id}.text`)}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        }
      >
        <CtaLink href="/connexion" variant="onDark" icon={<ArrowRight className="h-4 w-4" />}>
          {d.site.common.seeDemo}
        </CtaLink>
      </PageHero>

      {/* Explorateur par rôle */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.nav.security} title={d.site.rbac.explorerTitle} lead={d.site.rbac.pick} />
        <Reveal delay={100} className="mt-8">
          <BarrierMatrix />
        </Reveal>
      </SiteSection>

      {/* Les trois tableaux complets */}
      {rbacBarriers.map((barrier, i) => (
        <SiteSection key={barrier.id} tone={i % 2 === 0 ? "card" : "paper"}>
          <SectionHeading
            eyebrow={`0${i + 1}`}
            title={t(`site.rbac.barriers.${barrier.id}.name`)}
            lead={t(`site.rbac.barriers.${barrier.id}.text`)}
          />
          <Reveal delay={100} className="mt-8">
            <BarrierTable barrierId={barrier.id} />
          </Reveal>
          <Reveal delay={140} className="mt-5">
            <div className="rounded-(--radius-card) border border-blue/25 bg-blue-soft/40 p-5">
              <p className="max-w-[86ch] text-[13px] leading-relaxed text-ink">{t(`site.rbac.principles.${barrier.id}`)}</p>
            </div>
          </Reveal>
        </SiteSection>
      ))}

      {/* Classification documentaire */}
      <SiteSection tone="card">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeading eyebrow={d.site.nav.security} title={d.site.rbac.classifyTitle} />
          <Reveal delay={100}>
            <div className="card p-6">
              <p className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] text-ink-faint uppercase">
                <FileLock2 className="h-4 w-4 text-blue" />
                {d.site.rbac.classifyTitle}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{d.site.rbac.classify}</p>
            </div>
          </Reveal>
        </div>
      </SiteSection>

      {/* Alerte incident */}
      <SiteSection>
        <SectionHeading eyebrow={d.site.rbac.audit} title={d.site.rbac.alertTitle} lead={d.site.rbac.alertLead} />

        <Stagger className="mt-10 grid gap-4 md:grid-cols-3" step={90} itemClassName="h-full">
          <article className="card h-full p-5">
            <Eyebrow>{d.site.rbac.alertSeverityTitle}</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-2">
              {alertSeverities.map((s) => (
                <Chip key={s} tone={s === "grave" ? "blue" : "line"}>
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {t(`site.rbac.alertSeverity.${s}`)}
                </Chip>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-soft">{d.site.common.accessHint.urgent}</p>
          </article>

          <article className="card h-full p-5">
            <Eyebrow>{d.site.rbac.alertRecipientTitle}</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-2">
              {alertRecipients.map((r) => (
                <Chip key={r}>
                  <Users className="h-3.5 w-3.5 text-blue" />
                  {t(`site.rbac.alertRecipients.${r}`)}
                </Chip>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-soft">{d.site.rbac.alertSigned}</p>
          </article>

          <article className="card h-full p-5">
            <Eyebrow>{d.site.rbac.alertContentTitle}</Eyebrow>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-soft">{d.site.rbac.alertContent}</p>
          </article>
        </Stagger>
      </SiteSection>

      <FinalCta />
    </>
  );
}
