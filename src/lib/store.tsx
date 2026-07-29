"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type {
  AiAlert,
  AiReminder,
  ChatMessage,
  ClockMethod,
  Conversation,
  JournalEntry,
  Persona,
  PurchaseOrder,
  Reserve,
  ReserveStatus,
  SitePhoto,
  SiteTask,
  SupportTicket,
  TaskStatus,
  TimeEntry,
} from "@/types";
import {
  aiAlerts,
  aiReminders,
  conversations as seedConversations,
  inDays,
  journalEntries,
  personas,
  purchaseOrders,
  reserves,
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
        const from = c.kind === "direct" ? (c.memberId ?? "BN-0003") : (c.id === "cv-sunset" ? "BN-0110" : "BN-0142");
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
