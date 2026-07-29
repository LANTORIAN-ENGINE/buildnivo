"use client";

import {
  AlertTriangle,
  Bot,
  CalendarClock,
  CheckCheck,
  FileText,
  ListChecks,
  Mic,
  NotebookPen,
  Send,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useRef, useState } from "react";
import type { CopilotAction, CopilotAnswer } from "@/types";
import { copilotAnswers, copilotFallback, dictationActions, dictationText, documents } from "@/data";
import { useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Avatar, Button, cn, DemoTip, SectionCard, StatusPill, type Tone } from "@/components/ui";

const actionMeta: Record<CopilotAction["kind"], { icon: React.ComponentType<{ className?: string }>; tone: Tone }> = {
  anomalie: { icon: AlertTriangle, tone: "danger" },
  tache: { icon: ListChecks, tone: "blue" },
  achat: { icon: ShoppingCart, tone: "viz" },
  risque: { icon: CalendarClock, tone: "safety" },
  journal: { icon: NotebookPen, tone: "neutral" },
  avancement: { icon: TrendingUp, tone: "ok" },
};

interface ChatMsg {
  from: "user" | "ai";
  text: string;
  sources?: CopilotAnswer["sources"];
}

export default function CopilotePage() {
  const { d, t } = useI18n();
  const { persona, toast } = useDemo();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [dictating, setDictating] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<Set<number>>(new Set());
  const chatEnd = useRef<HTMLDivElement>(null);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      const lower = q.toLowerCase();
      const match = copilotAnswers.find((a) => a.matchers.some((kw) => lower.includes(kw))) ?? copilotFallback;
      setMessages((m) => [...m, { from: "ai", text: match.answer, sources: match.sources }]);
      setThinking(false);
      window.setTimeout(() => chatEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 60);
    }, 900);
  };

  const dictate = () => {
    if (dictating) return;
    setDictating(true);
    setTranscript(null);
    setAccepted(new Set());
    window.setTimeout(() => {
      setTranscript(dictationText);
      setDictating(false);
    }, 1800);
  };

  const acceptOne = (i: number) => {
    setAccepted((s) => new Set(s).add(i));
    toast(d.copilote.accepted);
  };

  const acceptAll = () => {
    setAccepted(new Set(dictationActions.map((_, i) => i)));
    toast(d.copilote.allAccepted);
  };

  const suggestions = [
    d.copilote.suggestions.facade,
    d.copilote.suggestions.delaiPlombier,
    d.copilote.suggestions.planApplicable,
    d.copilote.suggestions.docsManquants,
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.copilote.title}</h1>
            <DemoTip text={d.tips.copilote.main} />
          </div>
          <p className="mt-0.5 text-[13px] text-ink-soft">{d.copilote.subtitle}</p>
        </div>
        <p className="flex items-center gap-2 rounded-xl bg-ok-soft px-3.5 py-2 text-[12px] font-semibold text-ok-deep">
          <ShieldCheck className="h-4 w-4" /> {d.copilote.scopeNote}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        {/* Chat documentaire */}
        <SectionCard className="flex min-h-[560px] flex-col" bodyClassName="flex flex-1 flex-col pt-4">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <div className="blueprint-grid flex h-full min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line p-6 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue text-white">
                  <Bot className="h-6 w-6" />
                </span>
                <p className="max-w-md text-[13px] leading-relaxed text-ink-soft">{d.tips.copilote.main}</p>
              </div>
            )}
            {messages.map((m, i) =>
              m.from === "user" ? (
                <div key={i} className="flex items-start justify-end gap-2.5">
                  <p className="max-w-[75%] rounded-2xl rounded-tr-sm bg-blue px-4 py-2.5 text-[13px] leading-relaxed text-blue-ink">{m.text}</p>
                  <Avatar name={`${persona.firstName} ${persona.lastName}`} size="sm" />
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <div className="max-w-[80%]">
                    <p className="rounded-2xl rounded-tl-sm border border-line bg-line-soft/50 px-4 py-2.5 text-[13px] leading-relaxed text-ink">{m.text}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-[10.5px] font-bold tracking-wider text-ink-faint uppercase">{d.copilote.sources}</p>
                        {m.sources.map((s) => {
                          const doc = documents.find((x) => x.id === s.docId);
                          return (
                            <p key={s.docId} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-blue-deep">
                              <FileText className="h-3 w-3" />
                              {doc?.name ?? s.docId}
                              {s.page && <span className="font-mono text-ink-faint">p.{s.page}</span>}
                              <span className="font-mono text-[10px] text-ink-faint">({doc?.version})</span>
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
            {thinking && (
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue text-white">
                  <Bot className="h-3.5 w-3.5" />
                </span>
                <span className="animate-pulse text-[12.5px] text-ink-faint">…</span>
              </div>
            )}
            <div ref={chatEnd} />
          </div>

          <div className="mt-4 border-t border-line pt-3.5">
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-line bg-card px-3 py-1.5 text-[11.5px] font-medium text-ink-soft transition-colors hover:border-blue hover:text-blue-deep"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={d.copilote.placeholder}
                className="h-10.5 flex-1 rounded-[10px] border border-line bg-paper px-3.5 text-[13px] focus:border-blue focus:outline-none"
              />
              <Button type="submit" disabled={!input.trim() || thinking} aria-label={d.common.send}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </SectionCard>

        {/* Dictée terrain → actions */}
        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-blue" /> {d.copilote.dictation}
            </span>
          }
          tip={d.tips.copilote.dictation}
          className="h-fit"
        >
          <p className="text-[12.5px] leading-relaxed text-ink-soft">{d.copilote.dictationHint}</p>

          <Button className="mt-3.5 w-full" onClick={dictate} disabled={dictating}>
            <Mic className={cn("h-4 w-4", dictating && "animate-pulse")} />
            {dictating ? d.copilote.listening : d.copilote.dictate}
          </Button>

          {transcript && (
            <>
              <blockquote className="rise-in mt-4 rounded-xl border border-blue/25 bg-blue-soft/50 p-3.5 text-[12.5px] leading-relaxed text-blue-deep italic">
                « {transcript} »
              </blockquote>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-[12px] font-bold tracking-wider text-ink-faint uppercase">{d.copilote.proposedActions}</p>
                <Button size="sm" variant="soft" onClick={acceptAll} disabled={accepted.size === dictationActions.length}>
                  <CheckCheck className="h-3.5 w-3.5" /> {d.copilote.acceptAll}
                </Button>
              </div>

              <div className="mt-2.5 space-y-2.5">
                {dictationActions.map((a, i) => {
                  const meta = actionMeta[a.kind];
                  const Icon = meta.icon;
                  const done = accepted.has(i);
                  return (
                    <div key={i} className={cn("rise-in rounded-xl border p-3", done ? "border-ok/40 bg-ok-soft/60" : "border-line bg-card")} style={{ animationDelay: `${i * 70}ms` }}>
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                              meta.tone === "danger" && "bg-danger-soft text-danger",
                              meta.tone === "blue" && "bg-blue-soft text-blue-deep",
                              meta.tone === "viz" && "bg-viz-soft text-viz",
                              meta.tone === "safety" && "bg-safety-soft text-safety-deep",
                              meta.tone === "neutral" && "bg-line-soft text-ink-soft",
                              meta.tone === "ok" && "bg-ok-soft text-ok-deep"
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div>
                            <p className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[12.5px] leading-snug font-bold text-ink">{a.label}</span>
                              <StatusPill tone={meta.tone} dot={false} className="px-2 py-0.5 text-[10px]">
                                {t(`copilote.actionKinds.${a.kind}`)}
                              </StatusPill>
                            </p>
                            <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{a.detail}</p>
                          </div>
                        </div>
                        {done ? (
                          <span className="mt-1 shrink-0 text-ok-deep">
                            <CheckCheck className="h-4.5 w-4.5" />
                          </span>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => acceptOne(i)}>
                            {d.copilote.accept}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
