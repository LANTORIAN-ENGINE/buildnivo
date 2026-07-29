"use client";

import {
  ChevronDown,
  Clock3,
  LifeBuoy,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Ticket,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { TicketStatus } from "@/types";
import { faqItems, inDays } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Badge, Button, cn, DemoTip, SectionCard, StatusPill, Tabs, type Tone } from "@/components/ui";

const statusTones: Record<TicketStatus, Tone> = {
  ouvert: "safety",
  enCours: "blue",
  resolu: "ok",
};

const contactRows = [
  { icon: Phone, labelKey: "phone" as const, value: "0262 71 03 40", hintKey: "hours" as const },
  { icon: Smartphone, labelKey: "whatsapp" as const, value: "0692 71 03 40", hintKey: "whatsappHint" as const },
  { icon: Mail, labelKey: "email" as const, value: "support@buildnivo.demo", hintKey: "responseTime" as const },
];

export default function SupportPage() {
  const { d, t, lang } = useI18n();
  const { tickets, addTicket, toast } = useDemo();

  const [tab, setTab] = useState("aide");
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(faqItems[0].id);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "pointage", description: "" });

  const filteredFaq = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqItems;
    return faqItems.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || t(`support.categories.${f.categoryKey}`).toLowerCase().includes(q)
    );
  }, [query, t]);

  const openTickets = tickets.filter((tk) => tk.status !== "resolu").length;

  const submitTicket = () => {
    if (!form.subject.trim()) return;
    addTicket({
      id: `tk-${Date.now()}`,
      ref: `SAV-2026-0${42 + tickets.length}`,
      subject: form.subject.trim(),
      categoryKey: form.category,
      status: "ouvert",
      updatedAt: inDays(0),
      excerpt: form.description.trim() || form.subject.trim(),
    });
    setForm({ subject: "", category: "pointage", description: "" });
    setFormOpen(false);
    setTab("tickets");
    toast(d.support.form.created);
  };

  const fieldCls = "w-full rounded-[9px] border border-line bg-paper px-3 text-[13px] focus:border-blue focus:outline-none";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.support.title}</h1>
            <DemoTip text={d.tips.support.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.support.subtitle}</p>
        </div>
        <p className="flex items-center gap-2 rounded-xl bg-ok-soft px-3.5 py-2 text-[12px] font-semibold text-ok-deep">
          <ShieldCheck className="h-4 w-4" />
          {d.support.statusOk} · <span className="font-mono">99,97 %</span> {d.support.uptime}
        </p>
      </div>

      <Tabs
        items={[
          { id: "aide", label: d.support.tabs.aide },
          { id: "tickets", label: d.support.tabs.tickets, count: openTickets },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "aide" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
          {/* FAQ */}
          <SectionCard title={d.support.faqTitle}>
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={d.support.searchFaq}
                className="h-10 w-full rounded-[10px] border border-line bg-paper pl-9 text-[13px] focus:border-blue focus:outline-none"
              />
            </div>

            {filteredFaq.length === 0 && (
              <p className="rounded-xl bg-line-soft/60 px-4 py-6 text-center text-[12.5px] text-ink-soft">{d.support.noResult}</p>
            )}

            <div className="divide-y divide-line-soft">
              {filteredFaq.map((f) => {
                const open = openFaq === f.id;
                return (
                  <div key={f.id} className="py-1">
                    <button
                      onClick={() => setOpenFaq(open ? null : f.id)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2.5 text-left hover:bg-line-soft/50"
                    >
                      <Badge tone={open ? "blue" : "neutral"} className="w-32 shrink-0 justify-center text-center normal-case">
                        {t(`support.categories.${f.categoryKey}`)}
                      </Badge>
                      <span className="flex-1 text-[13.5px] leading-snug font-semibold text-ink">{f.q}</span>
                      <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-faint transition-transform duration-150", open && "rotate-180")} />
                    </button>
                    {open && (
                      <p className="rise-in mb-2.5 ml-[140px] max-w-[62ch] rounded-xl bg-blue-soft/40 px-4 py-3 text-[12.5px] leading-relaxed text-ink max-md:ml-1.5">
                        {f.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Contact */}
          <div className="space-y-4">
            <SectionCard title={d.support.contactTitle} className="h-fit" bodyClassName="space-y-1">
              {contactRows.map((row) => (
                <div key={row.labelKey} className="flex items-center gap-3.5 rounded-xl px-2 py-3 hover:bg-line-soft/50">
                  <span className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px] bg-blue-soft text-blue-deep">
                    <row.icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-semibold text-ink-soft">{d.support[row.labelKey]}</p>
                    <p className="truncate font-mono text-[13.5px] font-bold text-ink">{row.value}</p>
                    <p className="mt-0.5 text-[11px] text-ink-faint">{d.support[row.hintKey]}</p>
                  </div>
                </div>
              ))}
              <p className="mt-2 flex items-center gap-2 rounded-xl bg-line-soft/60 px-3.5 py-2.5 text-[11.5px] font-medium text-ink-soft">
                <Clock3 className="h-3.5 w-3.5 shrink-0" /> {d.support.hours}
              </p>
            </SectionCard>

            <button
              onClick={() => {
                setTab("tickets");
                setFormOpen(true);
              }}
              className="card group flex w-full items-center gap-3.5 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-blue/50 hover:shadow-(--shadow-pop)"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-blue text-white">
                <LifeBuoy className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[13.5px] font-bold text-ink group-hover:text-blue-deep">{d.support.newTicket}</span>
                <span className="block text-[11.5px] text-ink-soft">{d.support.responseTime}</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {tab === "tickets" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => setFormOpen((v) => !v)} variant={formOpen ? "outline" : "primary"}>
              <Plus className={cn("h-4 w-4 transition-transform duration-150", formOpen && "rotate-45")} />
              {formOpen ? d.common.cancel : d.support.newTicket}
            </Button>
          </div>

          {formOpen && (
            <SectionCard title={d.support.newTicket} className="rise-in border-blue/30">
              <div className="grid gap-4 md:grid-cols-[1fr_240px]">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.support.form.subject}</span>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder={d.support.form.subjectPlaceholder}
                    className={cn(fieldCls, "h-10")}
                    autoFocus
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.support.form.category}</span>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={cn(fieldCls, "h-10")}>
                    {(["pointage", "compte", "facturation", "ia", "mobile"] as const).map((c) => (
                      <option key={c} value={c}>
                        {t(`support.categories.${c}`)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[12px] font-bold text-ink">{d.support.form.description}</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={d.support.form.descriptionPlaceholder}
                  rows={3}
                  className={cn(fieldCls, "resize-none py-2.5")}
                />
              </label>
              <div className="mt-4 flex justify-end">
                <Button onClick={submitTicket} disabled={!form.subject.trim()}>
                  {d.support.form.submit}
                </Button>
              </div>
            </SectionCard>
          )}

          <SectionCard bodyClassName="divide-y divide-line-soft">
            {tickets.map((tk) => (
              <div key={tk.id} className="flex flex-wrap items-start gap-3 py-3.5">
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                    tk.status === "resolu" ? "bg-ok-soft text-ok-deep" : tk.status === "enCours" ? "bg-blue-soft text-blue-deep" : "bg-safety-soft text-safety-deep"
                  )}
                >
                  <Ticket className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-blue-deep">{tk.ref}</span>
                    <span className="text-[13.5px] font-bold text-ink">{tk.subject}</span>
                    <Badge tone="neutral" className="normal-case">
                      {t(`support.categories.${tk.categoryKey}`)}
                    </Badge>
                  </p>
                  <p className="mt-1 max-w-[85ch] text-[12px] leading-relaxed text-ink-soft">{tk.excerpt}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <StatusPill tone={statusTones[tk.status]}>{t(`support.status.${tk.status}`)}</StatusPill>
                  <span className="text-[10.5px] text-ink-faint">
                    {d.support.updated} <span className="font-mono">{fmtDate(tk.updatedAt, lang)}</span>
                  </span>
                </div>
              </div>
            ))}
          </SectionCard>
        </div>
      )}
    </div>
  );
}
