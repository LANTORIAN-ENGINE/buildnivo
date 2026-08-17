/** Domaine BuildNivo — démo frontend, données 100 % factices. */

export type Role =
  | "direction"
  | "conducteur"
  | "chef"
  | "ouvrier"
  | "soustraitant"
  /* Intervenants externes de l'opération (réunion du 31/07/2026) */
  | "moa" // maître d'ouvrage / promoteur
  | "moex" // maître d'œuvre d'exécution
  | "architecte"
  | "bet" // bureau d'études (VRD, fluides, électricité, structure, charpente)
  | "controleur" // contrôleur technique (type Veritas)
  | "csps" // coordonnateur sécurité et protection de la santé
  /* Contrôle financier (brief du 16/08/2026) : garant, banque, assureur,
     courtier, investisseur, escrow, séquestre, organisme institutionnel.
     Un seul rôle, strictement en lecture. */
  | "financier";

/** Rôles internes à l'entreprise de travaux (par opposition aux intervenants externes). */
export const internalRoles: Role[] = ["direction", "conducteur", "chef", "ouvrier", "soustraitant"];

/** Spécialités des bureaux d'études. */
export type Discipline = "vrd" | "fluides" | "electricite" | "structure" | "charpente";

export interface Persona {
  id: string;
  role: Role;
  firstName: string;
  lastName: string;
  jobKey: string; // clé i18n du métier
  company: string;
  companyId?: string;
  discipline?: Discipline;
  /** Rôle « financier » : accès de contrôle dont dépend le périmètre partagé. */
  accessId?: string;
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

export type CompanyKind =
  | "generale"
  | "soustraitant"
  | "fournisseur"
  | "moa"
  | "moex"
  | "architecte"
  | "bet"
  | "controle"
  | "financier";

export interface Company {
  id: string;
  name: string;
  kind: CompanyKind;
  trade?: Trade;
  discipline?: Discipline;
  /** Rôle plateforme accordé aux comptes de cette société. */
  role?: Role;
  /** Clé i18n décrivant la mission contractuelle (intervenants externes). */
  missionKey?: string;
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
  discipline?: Discipline;
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

export type DocCategory =
  | "plan"
  | "cctp"
  | "contrat"
  | "administratif"
  | "livraison"
  | "compteRendu"
  | "planExe" // plan d'exécution déposé par un bureau d'études
  | "noteCalcul"
  | "esquisse"
  | "avis"; // avis contrôleur technique / SPS

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
  | "incoherence"
  | "visa"
  | "securite";

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

export type ReminderKind = "entreprise" | "document" | "fournisseur" | "livraison" | "tache" | "visa";

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

/* ------------------------------------------------------------------------- */
/* Circuit de visa des plans d'exécution (MOEX ↔ BET ↔ contrôleur technique)  */
/* ------------------------------------------------------------------------- */

export type VisaStatus =
  | "enAttente"
  | "favorable"
  | "favorableObs" // favorable avec observations
  | "defavorable";

export interface PlanSubmission {
  id: string; // « EXE-ELE-204 »
  projectId: string;
  name: string;
  discipline: Discipline;
  version: string; // « ind. B »
  /** Société émettrice (bureau d'études ou architecte). */
  submittedBy: string; // companyId
  submittedAt: string;
  /** Avis du maître d'œuvre d'exécution. */
  status: VisaStatus;
  reviewedAt?: string;
  observations: string[];
  /** Contre-visa du contrôleur technique, uniquement après visa MOEX. */
  ctStatus?: VisaStatus;
  ctNote?: string;
  /** Note de calcul jointe au dépôt. */
  calcNote?: boolean;
  zoneId?: string;
  /** Tâche ou lot dont le démarrage dépend de ce visa. */
  blocksKey?: string;
  dueAt?: string;
}

/** Avis d'un intervenant, repris automatiquement dans le compte rendu hebdomadaire. */
export type AvisNature = "reglementaire" | "observation";

export interface Avis {
  id: string;
  projectId: string;
  authorRole: Role;
  author: string; // « Veritas OI — J.-M. Perrin »
  nature: AvisNature;
  subject: string;
  body: string;
  date: string;
  severity: AlertSeverity;
  /** Le maître d'ouvrage peut masquer les avis non réglementaires du CR diffusé. */
  hidden: boolean;
  docRef?: string;
  submissionId?: string;
}

/* --------------------- Réunions de chantier hebdomadaires ------------------ */

export type MeetingStatus = "planifiee" | "brouillon" | "diffuse";

export interface MeetingAttendee {
  name: string;
  role: Role;
  company: string;
  present: boolean;
  excused?: boolean;
}

export interface SiteMeeting {
  id: string; // « CR-35 »
  projectId: string;
  number: number;
  date: string;
  nextDate: string;
  status: MeetingStatus;
  attendees: MeetingAttendee[];
  /** Sections rédigées par l'IA à partir des données du chantier. */
  sections: { key: string; text: string }[];
  /** Avis repris dans le compte rendu. */
  avisIds: string[];
  actions: { label: string; owner: string; due: string }[];
}

/* ------------- Production documentaire assistée (CCTP, estimatif) ---------- */

export type DraftKind = "cctp" | "estimatif" | "contrat" | "ordreService";

export interface AiDocDraft {
  id: string;
  projectId: string;
  kind: DraftKind;
  title: string;
  /** Documents sources analysés (plans, CCTP existants). */
  sourceDocIds: string[];
  lines: { label: string; detail: string; qty?: string; amount?: number }[];
  status: "aValider" | "valide";
  /** Temps de rédaction manuel estimé, en heures — argument commercial MOEX. */
  savedHours: number;
}

/* --------------- Reprise d'un chantier déjà démarré (onboarding) ----------- */

export interface RepriseFile {
  name: string;
  categoryKey: DocCategory;
  pages: number;
  extractedKey: string; // clé i18n de ce que l'IA en a tiré
}

export interface RepriseStep {
  key: string;
  status: "fait" | "enCours" | "attente";
}

export interface RepriseResult {
  progress: number;
  invoicedPct: number;
  monthsLeft: number;
  lots: { lotKey: string; progress: number; invoiced: number; marketAmount: number }[];
  remaining: string[];
  gaps: string[];
}

export interface CopilotAnswer {
  matchers: string[];
  answer: string;
  sources: { docId: string; page?: number }[];
  actions?: CopilotAction[];
}

/* ========================================================================== */
/* BuildNivo Finance — accès « Contrôle financier »                           */
/* (brief produit du 16/08/2026 : garant, banque, assureur, courtier,         */
/*  investisseur, escrow, séquestre, organisme institutionnel)                */
/* ========================================================================== */

/** Nature de l'organisme invité. Un seul rôle plateforme, huit métiers. */
export type FinancialOrgKind =
  | "garant"
  | "banque"
  | "assureur"
  | "courtier"
  | "investisseur"
  | "escrow"
  | "sequestre"
  | "institutionnel";

/** Statut de validation d'une donnée partagée (§9 Traçabilité). */
export type DataStatus = "valide" | "aValider" | "declaratif";

export type FigureUnit = "euro" | "pct" | "days" | "count";

/**
 * Donnée tracée : une valeur ne circule jamais seule vers un financeur.
 * Elle porte sa date de mise à jour, son origine, son mode de calcul, son
 * statut de validation et ses pièces justificatives (§9 du brief).
 * `value: null` = donnée non renseignée — affichée comme telle, jamais à 0.
 */
export interface TracedFigure {
  /** Clé i18n du libellé. */
  key: string;
  value: number | null;
  unit: FigureUnit;
  updatedAt: string; // ISO jour
  /** Clés i18n : d'où vient la donnée, comment elle est calculée. */
  originKey: string;
  methodKey: string;
  status: DataStatus;
  /** Pièces justificatives partagées à l'appui. */
  docIds?: string[];
  /** Écart affiché en second plan (avenants, dépassement…). */
  deltaOf?: string;
}

/** Bloc « Identification » du tableau de bord standardisé (§3). */
export interface OperationIdentity {
  projectId: string;
  promoter: string;
  spv: string; // société de projet
  address: string;
  programKey: string; // clé i18n de la nature du programme
  operationAmount: number;
  worksAmount: number;
  startDate: string;
  contractualDelivery: string;
  forecastDelivery: string;
  updatedAt: string;
}

export type MilestoneState = "atteint" | "aVenir" | "retard";

export interface FinanceMilestone {
  id: string;
  projectId: string;
  label: string;
  planned: string;
  actual?: string;
  state: MilestoneState;
  /** Écart en jours (positif = retard). */
  driftDays: number;
}

/** Les huit familles de risques à incidence matérielle (§3). */
export type RiskCategory =
  | "delai"
  | "budget"
  | "achevement"
  | "financement"
  | "tresorerie"
  | "assurances"
  | "autorisations"
  | "continuite";

export type RiskLevel = "vert" | "orange" | "rouge";
export type RiskStatus = "ouvert" | "enCours" | "maitrise" | "clos";

export interface MaterialRisk {
  id: string;
  projectId: string;
  category: RiskCategory;
  level: RiskLevel;
  title: string;
  summary: string;
  detectedAt: string;
  /** Incidence estimée, formulée pour un financeur. */
  impact: string;
  /** Mesures correctives engagées. */
  measures: string[];
  status: RiskStatus;
  updatedAt: string;
}

/* ------------------------- Rapport périodique (§4) ------------------------- */

export type ReportStatus = "brouillon" | "aValider" | "publie";

export interface FinanceReportVersion {
  version: number;
  at: string;
  author: string;
  /** Motif de la nouvelle version : une correction ne réécrit jamais l'ancienne. */
  note: string;
}

export interface FinanceReport {
  id: string; // « RPT-2026-08 »
  projectId: string;
  periodKey: string; // clé i18n du mois
  periodEnd: string;
  status: ReportStatus;
  version: number;
  generatedAt: string;
  publishedAt?: string;
  validatedBy?: string;
  /** Les treize rubriques standardisées, dans l'ordre du brief. */
  sections: { key: string; text: string }[];
  photoIds: string[];
  docIds: string[];
  nextUpdate: string;
  history: FinanceReportVersion[];
  /** Données incomplètes ou anciennes signalées avant publication. */
  gaps: string[];
}

/* --------------------- Paramétrage de l'accès (§8, §10) -------------------- */

export type AccessStatus = "invite" | "actif" | "suspendu" | "revoque";

export interface FinancialUser {
  name: string;
  jobKey: string;
  email: string;
  lastSeen?: string;
}

/** Périmètre optionnel : le socle avancement/budget/délai/risque reste standard. */
export interface AccessShare {
  commercialisation: boolean;
  tresorerie: boolean;
  sequestre: boolean;
  photos: boolean;
}

export interface AccessNotify {
  publication: boolean;
  rappel: boolean;
  risque: boolean;
}

export interface FinancialAccess {
  id: string;
  projectId: string;
  orgId: string; // companyId de l'organisme invité
  /** Nom saisi à la volée quand l'organisme n'est pas au référentiel. */
  orgName?: string;
  kind: FinancialOrgKind;
  /** Référence du contrat qui justifie l'accès (garantie, prêt, police). */
  reference: string;
  users: FinancialUser[];
  startDate: string;
  endDate: string;
  status: AccessStatus;
  invitedAt: string;
  revokedAt?: string;
  sharedDocIds: string[];
  share: AccessShare;
  frequency: "mensuelle" | "trimestrielle";
  notify: AccessNotify;
}

/* ---------------------- Journal des accès (§9 in fine) --------------------- */

export type AccessLogAction =
  | "connexion"
  | "synthese"
  | "rapport"
  | "document"
  | "export"
  | "revocation";

export interface AccessLogEntry {
  id: string;
  accessId: string;
  /** Horodatage complet : « 2026-08-14 09:12 ». */
  at: string;
  user: string;
  action: AccessLogAction;
  target?: string;
  ip: string;
}

/* -------------------- Tableau de bord standardisé (§3) --------------------- */

export interface OperationSnapshot {
  projectId: string;
  identity: OperationIdentity;
  /** Avancement physique prévu / constaté / écart / retard global. */
  progress: TracedFigure[];
  /** Situation financière : les onze lignes du brief. */
  financial: TracedFigure[];
  /** Financement et commercialisation : partagés seulement si autorisés. */
  funding: TracedFigure[];
  /** Besoins de trésorerie prévisionnels. */
  cashCurve: { month: string; need: number; available: number }[];
  /** Évolution de l'avancement au cours des derniers mois. */
  progressCurve: { month: string; planned: number; actual: number }[];
}

/** Rappel automatique du cycle de publication (§5). */
export type FinanceReminderKind = "echeance" | "donneesAnciennes" | "validation" | "publication";

export interface FinanceReminder {
  id: string;
  projectId: string;
  kind: FinanceReminderKind;
  target: string;
  subject: string;
  body: string;
  dueAt: string;
  status: "aValider" | "envoyee";
}
