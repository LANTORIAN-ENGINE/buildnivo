"use client";

import {
  Bot,
  Building2,
  Camera,
  Check,
  CheckCheck,
  ChevronLeft,
  FileText,
  Info,
  ListChecks,
  MessageCircle,
  Mic,
  Paperclip,
  Phone,
  Play,
  Search,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, Conversation } from "@/types";
import { employeeById, fullName, inDays, projectById } from "@/data";
import { fmtDate, useI18n } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { Avatar, Button, cn, DemoTip, PhotoScene, Tooltip } from "@/components/ui";

/** Barres du faux message vocal — hauteurs déterministes. */
const WAVE = [5, 9, 14, 8, 12, 16, 10, 6, 11, 15, 9, 5, 8, 13, 7, 10, 14, 6, 9, 12];

function convName(c: Conversation): string {
  if (c.kind === "channel") return c.title ?? c.id;
  const emp = c.memberId ? employeeById(c.memberId) : undefined;
  return emp ? fullName(emp) : c.id;
}

function lastMessage(c: Conversation): ChatMessage | undefined {
  return c.messages[c.messages.length - 1];
}

export default function MessagesPage() {
  const { d, t, lang } = useI18n();
  const { convs, sendMessage, receiveReply, markConversationRead, addTask, toast, activeProjectId } = useDemo();

  const [selectedId, setSelectedId] = useState<string | null>("cv-sofia");
  const [mobileThread, setMobileThread] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [input, setInput] = useState("");
  const [typingConvId, setTypingConvId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const today = inDays(0);
  const selected = convs.find((c) => c.id === selectedId) ?? null;

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  // Défilement bas à chaque nouveau message ou changement de fil.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selectedId, selected?.messages.length, typingConvId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return convs.filter((c) => {
      if (filter === "unread" && c.unread === 0) return false;
      if (!q) return true;
      return convName(c).toLowerCase().includes(q) || lastMessage(c)?.text?.toLowerCase().includes(q);
    });
  }, [convs, query, filter]);

  const pinned = filtered.filter((c) => c.pinned);
  const others = filtered.filter((c) => !c.pinned);

  const openConv = (id: string) => {
    setSelectedId(id);
    setMobileThread(true);
    markConversationRead(id);
  };

  const submit = () => {
    const text = input.trim();
    if (!text || !selected) return;
    const convId = selected.id;
    sendMessage(convId, text);
    setInput("");
    timers.current.push(
      window.setTimeout(() => setTypingConvId(convId), 700),
      window.setTimeout(() => {
        setTypingConvId((cur) => (cur === convId ? null : cur));
        receiveReply(convId);
      }, 2300)
    );
  };

  const taskFromMessage = (msg: ChatMessage) => {
    const project = projectById(selected?.projectId ?? activeProjectId) ?? projectById(activeProjectId)!;
    addTask({
      id: `t-msg-${Date.now()}`,
      title: (msg.text ?? "").slice(0, 70),
      projectId: project.id,
      zoneId: project.zones[0].id,
      trade: "secondOeuvre",
      due: inDays(3),
      priority: "normale",
      status: "aFaire",
      photos: msg.kind === "photo" ? 1 : 0,
      comments: [],
      createdBy: "humain",
    });
    toast(d.taches.form.created);
  };

  const previewText = (c: Conversation): string => {
    const m = lastMessage(c);
    if (!m) return "";
    if (m.kind === "photo") return `📷 ${d.photos.title.split(" ")[0]}`;
    if (m.kind === "voice") return `🎙 ${d.messages.voiceLabel}`;
    if (m.kind === "doc") return `📎 ${m.docName}`;
    return `${m.from === "me" ? `${d.messages.you} : ` : ""}${m.text ?? ""}`;
  };

  const senderName = (id: string) => {
    const emp = employeeById(id);
    return emp ? fullName(emp) : id;
  };

  // Regroupe les messages par jour pour les séparateurs de date.
  const groups = useMemo(() => {
    if (!selected) return [];
    const byDate = new Map<string, ChatMessage[]>();
    for (const m of selected.messages) {
      const arr = byDate.get(m.date) ?? [];
      arr.push(m);
      byDate.set(m.date, arr);
    }
    return [...byDate.entries()];
  }, [selected]);

  const headerSub = (c: Conversation): string => {
    if (c.kind === "channel") {
      const p = c.projectId ? projectById(c.projectId) : undefined;
      return `${d.messages.channel} · ${c.members} ${d.messages.members}${p ? ` · ${p.city}` : ""}`;
    }
    const emp = c.memberId ? employeeById(c.memberId) : undefined;
    if (typingConvId === c.id) return d.messages.typing;
    return emp ? `${t(`jobs.${emp.jobKey}`)} · ${c.online ? d.messages.online : d.messages.offline}` : "";
  };

  return (
    <div className="flex h-[calc(100dvh-152px)] min-h-[540px] flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-bold tracking-tight text-ink">{d.messages.title}</h1>
          <DemoTip text={d.tips.messages.main} />
        </div>
        <p className="text-[12.5px] text-ink-soft">{d.messages.subtitle}</p>
      </div>

      <div className="card grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[320px_1fr]">
        {/* ------------------------------ Liste ------------------------------ */}
        <div className={cn("flex min-h-0 flex-col border-line lg:border-r", mobileThread && "hidden lg:flex")}>
          <div className="space-y-2.5 border-b border-line p-3.5">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={d.messages.search}
                className="h-9.5 w-full rounded-[10px] border border-line bg-paper pl-9 text-[12.5px] focus:border-blue focus:outline-none"
              />
            </div>
            <div className="flex gap-1.5">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors duration-150",
                    filter === f ? "bg-blue-soft text-blue-deep" : "text-ink-soft hover:bg-line-soft"
                  )}
                >
                  {f === "all" ? d.messages.filterAll : d.messages.filterUnread}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {filtered.length === 0 && <p className="px-3 py-6 text-center text-[12px] text-ink-faint">{d.messages.noResult}</p>}
            {[
              { label: d.messages.pinned, list: pinned },
              { label: d.messages.others, list: others },
            ].map(
              (section) =>
                section.list.length > 0 && (
                  <div key={section.label}>
                    <p className="px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-[0.12em] text-ink-faint uppercase">{section.label}</p>
                    {section.list.map((c) => {
                      const last = lastMessage(c);
                      const emp = c.kind === "direct" && c.memberId ? employeeById(c.memberId) : undefined;
                      const isActive = c.id === selectedId;
                      return (
                        <button
                          key={c.id}
                          onClick={() => openConv(c.id)}
                          aria-current={isActive}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors duration-150",
                            isActive ? "bg-blue-soft/80" : "hover:bg-line-soft/70"
                          )}
                        >
                          <span className="relative shrink-0">
                            {c.kind === "direct" && emp ? (
                              <Avatar name={fullName(emp)} />
                            ) : (
                              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-blue-soft text-blue-deep">
                                <Building2 className="h-4.5 w-4.5" />
                              </span>
                            )}
                            {c.kind === "direct" && c.online && (
                              <span className="presence-dot absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-ok" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline justify-between gap-2">
                              <span className={cn("truncate text-[13px]", c.unread > 0 ? "font-bold text-ink" : "font-semibold text-ink")}>
                                {convName(c)}
                              </span>
                              <span className="shrink-0 font-mono text-[10.5px] text-ink-faint">
                                {last ? (last.date === today ? last.time : fmtDate(last.date, lang)) : ""}
                              </span>
                            </span>
                            <span className="mt-0.5 flex items-center justify-between gap-2">
                              <span className={cn("truncate text-[11.5px]", c.unread > 0 ? "font-semibold text-ink" : "text-ink-soft")}>
                                {typingConvId === c.id ? d.messages.typing : previewText(c)}
                              </span>
                              {c.unread > 0 && (
                                <span className="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-blue px-1 font-mono text-[10px] font-bold text-white">
                                  {c.unread}
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )
            )}
          </div>
        </div>

        {/* -------------------------------- Fil ------------------------------- */}
        {selected ? (
          <div className={cn("flex min-h-0 flex-col", !mobileThread && "hidden lg:flex")}>
            {/* En-tête du fil */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <button onClick={() => setMobileThread(false)} className="rounded-lg p-1.5 text-ink-soft hover:bg-line-soft lg:hidden" aria-label={d.common.close}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              {selected.kind === "direct" && selected.memberId ? (
                <span className="relative">
                  <Avatar name={convName(selected)} />
                  {selected.online && <span className="presence-dot absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-ok" />}
                </span>
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-blue-soft text-blue-deep">
                  <Building2 className="h-4.5 w-4.5" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-ink">{convName(selected)}</p>
                <p className={cn("truncate text-[11.5px]", typingConvId === selected.id ? "font-semibold text-blue-deep" : "text-ink-soft")}>
                  {headerSub(selected)}
                </p>
              </div>
              <Tooltip label={d.messages.callToast} side="bottom">
                <button onClick={() => toast(d.messages.callToast)} className="rounded-[10px] p-2 text-ink-soft transition-colors hover:bg-line-soft hover:text-ink" aria-label={d.messages.call}>
                  <Phone className="h-4.5 w-4.5" />
                </button>
              </Tooltip>
              <button onClick={() => toast(d.tips.messages.main)} className="rounded-[10px] p-2 text-ink-soft transition-colors hover:bg-line-soft hover:text-ink" aria-label="Info">
                <Info className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="min-h-0 flex-1 space-y-1 overflow-y-auto bg-paper/60 px-4 py-4">
              {groups.map(([date, msgs]) => (
                <div key={date}>
                  <p className="my-3 text-center">
                    <span className="rounded-full bg-line-soft px-3 py-1 text-[10.5px] font-bold tracking-wide text-ink-soft uppercase">
                      {date === today ? d.common.today : fmtDate(date, lang, { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                  </p>
                  {msgs.map((m, i) => {
                    if (m.kind === "system") {
                      return (
                        <p key={m.id} className="my-2.5 text-center">
                          <span className="inline-flex max-w-[85%] items-center gap-1.5 rounded-full bg-viz-soft px-3 py-1.5 text-[11px] leading-snug font-semibold text-viz">
                            <Bot className="h-3 w-3 shrink-0" /> {m.text}
                          </span>
                        </p>
                      );
                    }
                    const own = m.from === "me";
                    const prev = msgs[i - 1];
                    const showSender = !own && selected.kind === "channel" && (!prev || prev.from !== m.from);
                    return (
                      <div key={m.id} className={cn("group flex w-full items-end gap-2 py-0.5", own ? "justify-end" : "justify-start")}>
                        {!own && !showSender && <span className="w-7 shrink-0" />}
                        {!own && showSender && (
                          <span className="shrink-0 self-end">
                            <Avatar name={senderName(m.from)} size="sm" />
                          </span>
                        )}
                        {!own && selected.kind === "direct" && !showSender && null}

                        {/* Action « créer une tâche » au survol */}
                        {own && m.kind === "text" && null}

                        <div className={cn("max-w-[78%] sm:max-w-[65%]", own && "order-1")}>
                          {showSender && <p className="mb-0.5 ml-1 text-[10.5px] font-bold text-ink-soft">{senderName(m.from)}</p>}

                          {m.kind === "text" && (
                            <div
                              className={cn(
                                "rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed",
                                own ? "rounded-br-sm bg-blue text-blue-ink" : "rounded-bl-sm border border-line bg-card text-ink"
                              )}
                            >
                              {m.text}
                            </div>
                          )}

                          {m.kind === "photo" && (
                            <div className={cn("overflow-hidden rounded-2xl border", own ? "rounded-br-sm border-blue/30" : "rounded-bl-sm border-line")}>
                              <div className="h-36 w-60">
                                <PhotoScene hue={m.photoHue ?? 200} />
                              </div>
                              {m.text && <p className={cn("px-3 py-2 text-[12px] leading-snug", own ? "bg-blue text-blue-ink" : "bg-card text-ink")}>{m.text}</p>}
                            </div>
                          )}

                          {m.kind === "doc" && (
                            <div
                              className={cn(
                                "flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5",
                                own ? "rounded-br-sm bg-blue text-blue-ink" : "rounded-bl-sm border border-line bg-card text-ink"
                              )}
                            >
                              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", own ? "bg-white/15" : "bg-blue-soft text-blue-deep")}>
                                <FileText className="h-4 w-4" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-[12.5px] font-bold">{m.docName}</span>
                                <span className={cn("block font-mono text-[10.5px]", own ? "text-blue-ink/70" : "text-ink-faint")}>{m.docMeta}</span>
                              </span>
                            </div>
                          )}

                          {m.kind === "voice" && (
                            <div
                              className={cn(
                                "flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5",
                                own ? "rounded-br-sm bg-blue text-blue-ink" : "rounded-bl-sm border border-line bg-card text-ink"
                              )}
                            >
                              <button
                                onClick={() => toast(d.messages.callToast)}
                                aria-label={d.messages.voiceLabel}
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                  own ? "bg-white/20 text-white" : "bg-blue text-white"
                                )}
                              >
                                <Play className="ml-0.5 h-3.5 w-3.5" />
                              </button>
                              <span className="flex h-6 items-end gap-[2px]" aria-hidden="true">
                                {WAVE.map((h, wi) => (
                                  <span key={wi} className={cn("w-[3px] rounded-full", own ? "bg-white/60" : "bg-blue/50")} style={{ height: `${h}px` }} />
                                ))}
                              </span>
                              <span className={cn("font-mono text-[11px] font-semibold", own ? "text-blue-ink/80" : "text-ink-soft")}>
                                0:{String(m.voiceSec ?? 12).padStart(2, "0")}
                              </span>
                            </div>
                          )}

                          <p className={cn("mt-0.5 flex items-center gap-1 text-[10px] text-ink-faint", own ? "justify-end pr-1" : "pl-1")}>
                            <span className="font-mono">{m.time}</span>
                            {own &&
                              (m.read ? (
                                <CheckCheck className="h-3 w-3 text-blue" aria-label={d.messages.read} />
                              ) : (
                                <Check className="h-3 w-3" aria-label={d.messages.delivered} />
                              ))}
                          </p>
                        </div>

                        {/* Créer une tâche depuis un message reçu */}
                        {!own && m.kind === "text" && (
                          <Tooltip label={d.messages.createTask}>
                            <button
                              onClick={() => taskFromMessage(m)}
                              aria-label={d.messages.createTask}
                              className="mb-4 rounded-lg p-1.5 text-ink-faint opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-blue-soft hover:text-blue-deep focus-visible:opacity-100"
                            >
                              <ListChecks className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {typingConvId === selected.id && (
                <div className="flex items-end gap-2 py-1">
                  <Avatar name={selected.kind === "direct" ? convName(selected) : "Buildnivo"} size="sm" />
                  <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-line bg-card px-3.5 py-2.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-faint" style={{ animationDelay: `${i * 0.18}s` }} />
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* Composeur */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex items-center gap-1.5 border-t border-line px-3 py-2.5"
            >
              <Tooltip label={d.messages.attachDoc}>
                <button type="button" onClick={() => toast(d.messages.attachToast)} className="rounded-[10px] p-2 text-ink-soft transition-colors hover:bg-line-soft hover:text-ink" aria-label={d.messages.attachDoc}>
                  <Paperclip className="h-4.5 w-4.5" />
                </button>
              </Tooltip>
              <Tooltip label={d.messages.attachPhoto}>
                <button type="button" onClick={() => toast(d.messages.attachToast)} className="rounded-[10px] p-2 text-ink-soft transition-colors hover:bg-line-soft hover:text-ink" aria-label={d.messages.attachPhoto}>
                  <Camera className="h-4.5 w-4.5" />
                </button>
              </Tooltip>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={d.messages.inputPlaceholder}
                aria-label={d.messages.inputPlaceholder}
                className="h-10 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 text-[13px] focus:border-blue focus:outline-none"
              />
              {input.trim() ? (
                <Button type="submit" className="h-10 w-10 rounded-full p-0" aria-label={d.common.send}>
                  <Send className="h-4.5 w-4.5" />
                </Button>
              ) : (
                <Tooltip label={d.messages.voiceNote}>
                  <button type="button" onClick={() => toast(d.messages.attachToast)} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-soft text-blue-deep transition-colors hover:bg-blue/15" aria-label={d.messages.voiceNote}>
                    <Mic className="h-4.5 w-4.5" />
                  </button>
                </Tooltip>
              )}
            </form>
          </div>
        ) : (
          <div className="hidden flex-col items-center justify-center gap-3 p-8 text-center lg:flex">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-soft text-blue-deep">
              <MessageCircle className="h-6 w-6" />
            </span>
            <p className="text-[14px] font-bold text-ink">{d.messages.emptyTitle}</p>
            <p className="max-w-sm text-[12.5px] leading-relaxed text-ink-soft">{d.messages.emptyHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
