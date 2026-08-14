"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type {
  AiAlert,
  AiDocDraft,
  AiReminder,
  Avis,
  ChatMessage,
  ClockMethod,
  Conversation,
  JournalEntry,
  Persona,
  PlanSubmission,
  PurchaseOrder,
  Reserve,
  ReserveStatus,
  SiteMeeting,
  SitePhoto,
  SiteTask,
  SupportTicket,
  TaskStatus,
  TimeEntry,
  VisaStatus,
} from "@/types";
import {
  aiAlerts,
  aiDocDrafts,
  aiReminders,
  avisList,
  conversations as seedConversations,
  inDays,
  journalEntries,
  personas,
  planSubmissions,
  purchaseOrders,
  reserves,
  siteMeetings,
  sitePhotos,
  siteTasks,
  supportTickets,
  timeEntries,
} from "@/data";

interface Toast {
  id: number;
  message: string;
}

interface DemoState {
  persona: Persona;
  setPersona: (p: Persona) => void;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  discovery: boolean;
  setDiscovery: (v: boolean) => void;

  entries: TimeEntry[];
  tasks: SiteTask[];
  journal: JournalEntry[];
  photos: SitePhoto[];
  alerts: AiAlert[];
  reminders: AiReminder[];
  reserveItems: Reserve[];
  orders: PurchaseOrder[];
  convs: Conversation[];
  tickets: SupportTicket[];
  submissions: PlanSubmission[];
  avis: Avis[];
  meetings: SiteMeeting[];
  drafts: AiDocDraft[];

  toasts: Toast[];
  toast: (message: string) => void;

  clockDemo: (method: ClockMethod) => string;
  fixAnomaly: (entryId: string) => void;
  validateDay: () => void;
  setTaskStatus: (taskId: string, status: TaskStatus) => void;
  addTask: (task: SiteTask) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  markAlertHandled: (alertId: string) => void;
  sendReminder: (reminderId: string) => void;
  setReserveStatus: (reserveId: string, status: ReserveStatus) => void;
  confirmDelivery: (orderId: string) => void;
  sendMessage: (convId: string, text: string) => void;
  receiveReply: (convId: string) => void;
  markConversationRead: (convId: string) => void;
  addTicket: (ticket: SupportTicket) => void;
  /** Visa du maître d'œuvre d'exécution sur un plan d'exécution déposé. */
  setVisa: (submissionId: string, status: VisaStatus, observations?: string[]) => void;
  /** Contre-visa du contrôleur technique. */
  setCtVisa: (submissionId: string, status: VisaStatus, note?: string) => void;
  addSubmission: (submission: PlanSubmission) => void;
  addAvis: (avis: Avis) => void;
  /** Le maître d'ouvrage masque un avis non réglementaire du compte rendu diffusé. */
  toggleAvisHidden: (avisId: string) => void;
  diffuseMeeting: (meetingId: string) => void;
  validateDraft: (draftId: string) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoState | null>(null);

const clone = <T,>(arr: T[]): T[] => arr.map((x) => ({ ...x }));

const cloneConvs = (arr: Conversation[]): Conversation[] =>
  arr.map((c) => ({ ...c, messages: c.messages.map((m) => ({ ...m })), replies: [...c.replies] }));

const nowHHMM = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersona] = useState<Persona>(personas[1]); // conducteur par défaut
  const [activeProjectId, setActiveProjectId] = useState("p-sunset");
  const [discovery, setDiscovery] = useState(true);

  const [entries, setEntries] = useState<TimeEntry[]>(() => clone(timeEntries));
  const [tasks, setTasks] = useState<SiteTask[]>(() => clone(siteTasks));
  const [journal, setJournal] = useState<JournalEntry[]>(() => clone(journalEntries));
  const [photos] = useState<SitePhoto[]>(() => clone(sitePhotos));
  const [alerts, setAlerts] = useState<AiAlert[]>(() => clone(aiAlerts));
  const [reminders, setReminders] = useState<AiReminder[]>(() => clone(aiReminders));
  const [reserveItems, setReserveItems] = useState<Reserve[]>(() => clone(reserves));
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => clone(purchaseOrders));
  const [convs, setConvs] = useState<Conversation[]>(() => cloneConvs(seedConversations));
  const [tickets, setTickets] = useState<SupportTicket[]>(() => clone(supportTickets));
  const [submissions, setSubmissions] = useState<PlanSubmission[]>(() => clone(planSubmissions));
  const [avis, setAvis] = useState<Avis[]>(() => clone(avisList));
  const [meetings, setMeetings] = useState<SiteMeeting[]>(() => clone(siteMeetings));
  const [drafts, setDrafts] = useState<AiDocDraft[]>(() => clone(aiDocDrafts));

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const toast = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const clockDemo = useCallback(
    (method: ClockMethod): string => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setEntries((prev) => [
        {
          id: `te-demo-${Date.now()}`,
          employeeId: "BN-0104",
          projectId: "p-sunset",
          date: inDays(0),
          clockIn: hhmm,
          method,
          geoOk: true,
          state: "present",
          validated: false,
          hours: 0,
        },
        ...prev,
      ]);
      return hhmm;
    },
    []
  );

  const fixAnomaly = useCallback((entryId: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, anomalyKey: undefined, validated: true } : e))
    );
  }, []);

  const validateDay = useCallback(() => {
    setEntries((prev) => prev.map((e) => (e.anomalyKey ? e : { ...e, validated: true })));
  }, []);

  const setTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  }, []);

  const addTask = useCallback((task: SiteTask) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  const addJournalEntry = useCallback((entry: JournalEntry) => {
    setJournal((prev) => [entry, ...prev]);
  }, []);

  const markAlertHandled = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, handled: true } : a)));
  }, []);

  const sendReminder = useCallback((reminderId: string) => {
    setReminders((prev) => prev.map((r) => (r.id === reminderId ? { ...r, status: "envoyee" } : r)));
  }, []);

  const setReserveStatus = useCallback((reserveId: string, status: ReserveStatus) => {
    setReserveItems((prev) => prev.map((r) => (r.id === reserveId ? { ...r, status } : r)));
  }, []);

  const confirmDelivery = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "livree" } : o)));
  }, []);

  const sendMessage = useCallback((convId: string, text: string) => {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      from: "me",
      kind: "text",
      text,
      date: inDays(0),
      time: nowHHMM(),
      read: false,
    };
    setConvs((prev) => (prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, msg] } : c))));
  }, []);

  const receiveReply = useCallback((convId: string) => {
    setConvs((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const [next, ...rest] = c.replies;
        const text = next ?? "Bien reçu 👍 Je reviens vers vous rapidement.";
        const channelSpeaker: Record<string, string> = {
          "cv-sunset": "BN-0110",
          "cv-moe": "EXT-9002",
          "cv-albany": "BN-0141",
        };
        const from = c.kind === "direct" ? (c.memberId ?? "BN-0003") : (channelSpeaker[c.id] ?? "BN-0142");
        const reply: ChatMessage = {
          id: `msg-r-${Date.now()}`,
          from,
          kind: "text",
          text,
          date: inDays(0),
          time: nowHHMM(),
        };
        return {
          ...c,
          replies: rest,
          messages: [...c.messages.map((m) => (m.from === "me" ? { ...m, read: true } : m)), reply],
        };
      })
    );
  }, []);

  const markConversationRead = useCallback((convId: string) => {
    setConvs((prev) => prev.map((c) => (c.id === convId ? { ...c, unread: 0 } : c)));
  }, []);

  const addTicket = useCallback((ticket: SupportTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  }, []);

  const setVisa = useCallback((submissionId: string, status: VisaStatus, observations?: string[]) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, status, reviewedAt: inDays(0), observations: observations ?? s.observations }
          : s
      )
    );
  }, []);

  const setCtVisa = useCallback((submissionId: string, status: VisaStatus, note?: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, ctStatus: status, ctNote: note ?? s.ctNote } : s))
    );
  }, []);

  const addSubmission = useCallback((submission: PlanSubmission) => {
    setSubmissions((prev) => [submission, ...prev]);
  }, []);

  const addAvis = useCallback((item: Avis) => {
    setAvis((prev) => [item, ...prev]);
  }, []);

  const toggleAvisHidden = useCallback((avisId: string) => {
    setAvis((prev) => prev.map((a) => (a.id === avisId ? { ...a, hidden: !a.hidden } : a)));
  }, []);

  const diffuseMeeting = useCallback((meetingId: string) => {
    setMeetings((prev) => prev.map((m) => (m.id === meetingId ? { ...m, status: "diffuse" } : m)));
  }, []);

  const validateDraft = useCallback((draftId: string) => {
    setDrafts((prev) => prev.map((dr) => (dr.id === draftId ? { ...dr, status: "valide" } : dr)));
  }, []);

  const resetDemo = useCallback(() => {
    setEntries(clone(timeEntries));
    setTasks(clone(siteTasks));
    setJournal(clone(journalEntries));
    setAlerts(clone(aiAlerts));
    setReminders(clone(aiReminders));
    setReserveItems(clone(reserves));
    setOrders(clone(purchaseOrders));
    setConvs(cloneConvs(seedConversations));
    setTickets(clone(supportTickets));
    setSubmissions(clone(planSubmissions));
    setAvis(clone(avisList));
    setMeetings(clone(siteMeetings));
    setDrafts(clone(aiDocDrafts));
  }, []);

  const value = useMemo<DemoState>(
    () => ({
      persona,
      setPersona,
      activeProjectId,
      setActiveProjectId,
      discovery,
      setDiscovery,
      entries,
      tasks,
      journal,
      photos,
      alerts,
      reminders,
      reserveItems,
      orders,
      convs,
      tickets,
      submissions,
      avis,
      meetings,
      drafts,
      toasts,
      toast,
      clockDemo,
      fixAnomaly,
      validateDay,
      setTaskStatus,
      addTask,
      addJournalEntry,
      markAlertHandled,
      sendReminder,
      setReserveStatus,
      confirmDelivery,
      sendMessage,
      receiveReply,
      markConversationRead,
      addTicket,
      setVisa,
      setCtVisa,
      addSubmission,
      addAvis,
      toggleAvisHidden,
      diffuseMeeting,
      validateDraft,
      resetDemo,
    }),
    [
      persona,
      activeProjectId,
      discovery,
      entries,
      tasks,
      journal,
      photos,
      alerts,
      reminders,
      reserveItems,
      orders,
      convs,
      tickets,
      submissions,
      avis,
      meetings,
      drafts,
      toasts,
      toast,
      clockDemo,
      fixAnomaly,
      validateDay,
      setTaskStatus,
      addTask,
      addJournalEntry,
      markAlertHandled,
      sendReminder,
      setReserveStatus,
      confirmDelivery,
      sendMessage,
      receiveReply,
      markConversationRead,
      addTicket,
      setVisa,
      setCtVisa,
      addSubmission,
      addAvis,
      toggleAvisHidden,
      diffuseMeeting,
      validateDraft,
      resetDemo,
    ]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoState {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
