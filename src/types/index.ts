/** Domaine BuildNivo — démo frontend, données 100 % factices. */

export type Role =
  | "direction"
  | "conducteur"
  | "chef"
  | "ouvrier"
  | "soustraitant";

export interface Persona {
  id: string;
  role: Role;
  firstName: string;
  lastName: string;
  jobKey: string; // clé i18n du métier
  company: string;
}

export type Trade =
  | "grosOeuvre"
  | "secondOeuvre"
  | "electricite"
  | "plomberie"
  | "etancheite"
  | "menuiserie"
  | "peinture"
  | "vrd";

export interface Company {
  id: string;
  name: string;
  kind: "generale" | "soustraitant" | "fournisseur";
  trade?: Trade;
  city: string;
  contact: string;
  phone: string;
  /** Statut des documents administratifs (attestations, assurances). */
  docsOk: boolean;
  expiringDoc?: string;
}

export interface Zone {
  id: string;
  label: string; // « Bât. A — R+2 »
  progress: number; // 0..100
}

export type ProjectStatus = "enCours" | "demarrage" | "livraison" | "sav";

export interface Project {
  id: string;
  name: string;
  city: string;
  units: string; // « 48 logements », « Collège 600 élèves »
  status: ProjectStatus;
  progress: number;
  plannedProgress: number;
  budgetTotal: number; // €
  budgetSpent: number;
  delayDays: number; // retard prévisionnel (jours)
  startDate: string; // ISO
  endDate: string;
  zones: Zone[];
  headcountToday: number;
  headcountPlanned: number;
  weather: { key: string; tempC: number; windKmh: number };
  /** Courbe avancement planifié/réalisé par mois. */
  curve: { month: string; planned: number; actual: number }[];
  budgetBreakdown: { key: string; pct: number }[];
}

export interface Employee {
  id: string; // matricule « BN-0412 »
  firstName: string;
  lastName: string;
  jobKey: string;
  trade: Trade;
  companyId: string;
  projectId: string;
  phone: string;
  role: Role;
}

export type ClockMethod = "nfc" | "qr" | "geo" | "manual";
export type PresenceState = "present" | "pause" | "parti" | "absent";

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  date: string; // ISO jour
  clockIn?: string; // « 06:58 »
  breakStart?: string;
  breakEnd?: string;
  clockOut?: string;
  method: ClockMethod;
  geoOk: boolean;
  state: PresenceState;
  anomalyKey?: string; // clé i18n de l'anomalie
  validated: boolean;
  hours: number;
}

export type TaskStatus = "aFaire" | "enCours" | "aValider" | "terminee" | "bloquee";
export type TaskPriority = "haute" | "normale" | "basse";

export interface SiteTask {
  id: string;
  title: string;
  projectId: string;
  zoneId: string;
  trade: Trade;
  assigneeCompanyId?: string;
  assigneeEmployeeId?: string;
  due: string; // ISO
  priority: TaskPriority;
  status: TaskStatus;
  photos: number;
  comments: { author: string; text: string; at: string }[];
  createdBy: "ia" | "humain";
}

export type JournalItemKind =
  | "presence"
  | "tache"
  | "livraison"
  | "incident"
  | "photo"
  | "meteo"
  | "note";

export interface JournalEntry {
  id: string;
  projectId: string;
  date: string;
  time: string;
  kind: JournalItemKind;
  text: string;
  author: string; // « Auto », « S. Bègue »
  viaVoice?: boolean;
}

export type PhotoTag = "probleme" | "avancement" | "reserve" | "livraison" | "securite";

export interface SitePhoto {
  id: string;
  projectId: string;
  zoneId: string;
  tag: PhotoTag;
  caption: string;
  author: string;
  date: string;
  time: string;
  /** Teintes du placeholder SVG. */
  hue: number;
  linkedTaskId?: string;
}

export type DocCategory = "plan" | "cctp" | "contrat" | "administratif" | "livraison" | "compteRendu";

export interface SiteDocument {
  id: string;
  name: string;
  projectId: string;
  category: DocCategory;
  version: string; // « ind. C »
  sizeKb: number;
  updatedAt: string;
  author: string;
  history: { version: string; date: string; author: string }[];
  aiClassified: boolean;
}

export type AlertSeverity = "critique" | "elevee" | "info";
export type AlertKind =
  | "planning"
  | "effectif"
  | "livraison"
  | "document"
  | "budget"
  | "incoherence";

export interface AiAlert {
  id: string;
  projectId: string;
  kind: AlertKind;
  severity: AlertSeverity;
  title: string;
  detail: string;
  suggestedActionKey: string;
  date: string;
  handled: boolean;
}

export type ReminderKind = "entreprise" | "document" | "fournisseur" | "livraison" | "tache";

export interface AiReminder {
  id: string;
  projectId: string;
  kind: ReminderKind;
  target: string;
  subject: string;
  body: string;
  status: "aValider" | "envoyee";
}

export type ReserveStatus = "ouverte" | "notifiee" | "levee" | "contestee";

export interface Reserve {
  id: string;
  projectId: string;
  zoneId: string;
  companyId: string;
  title: string;
  status: ReserveStatus;
  openedAt: string;
  due: string;
  photoId?: string;
}

export type OrderStatus = "brouillon" | "envoyee" | "confirmee" | "livraisonPartielle" | "livree" | "retard";

export interface PurchaseOrder {
  id: string; // « CMD-2026-114 »
  projectId: string;
  supplierId: string;
  label: string;
  amount: number;
  status: OrderStatus;
  ordered: string;
  expected: string;
}

export interface FinanceRow {
  id: string;
  projectId: string;
  lotKey: string;
  budget: number;
  engaged: number;
  invoiced: number;
  paid: number;
}

export type MessageKind = "text" | "photo" | "doc" | "voice" | "system";

export interface ChatMessage {
  id: string;
  /** « me » (persona) ou id d'employé. */
  from: "me" | string;
  kind: MessageKind;
  text?: string;
  date: string; // ISO jour
  time: string; // « 14:32 »
  /** Teinte du placeholder photo. */
  photoHue?: number;
  docName?: string;
  docMeta?: string; // « ind. C · 4,7 Mo »
  voiceSec?: number;
  /** Pour ses propres messages : lu par le destinataire. */
  read?: boolean;
}

export interface Conversation {
  id: string;
  kind: "direct" | "channel";
  /** Canaux : titre affiché. Direct : dérivé du membre. */
  title?: string;
  memberId?: string;
  members?: number;
  projectId?: string;
  pinned?: boolean;
  online?: boolean;
  unread: number;
  messages: ChatMessage[];
  /** Réponses scriptées consommées dans l'ordre après chaque envoi. */
  replies: string[];
}

export type TicketStatus = "ouvert" | "enCours" | "resolu";

export interface SupportTicket {
  id: string;
  ref: string; // « SAV-2026-041 »
  subject: string;
  categoryKey: string;
  status: TicketStatus;
  updatedAt: string;
  excerpt: string;
}

export interface FaqItem {
  id: string;
  categoryKey: string;
  q: string;
  a: string;
}

export interface CopilotAction {
  kind: "anomalie" | "tache" | "achat" | "risque" | "journal" | "avancement";
  label: string;
  detail: string;
}

export interface CopilotAnswer {
  matchers: string[];
  answer: string;
  sources: { docId: string; page?: number }[];
  actions?: CopilotAction[];
}
