/**
 * Rôles et permissions par profil (réunion du 31/07/2026).
 *
 * Chaque profil n'accède qu'à son périmètre : les intervenants externes
 * (maître d'œuvre d'exécution, bureaux d'études, contrôleurs, architecte,
 * maître d'ouvrage) émettent des avis et déposent des documents sans voir
 * les données internes de l'entreprise de travaux (achats, paie, marges).
 */
import type { Role } from "@/types";

export type AccessLevel = "full" | "write" | "read" | "own" | "none";

/** Clés de module = clés de navigation (`nav.*`). */
export type ModuleKey =
  | "dashboard"
  | "chantiers"
  | "pointage"
  | "taches"
  | "journal"
  | "photos"
  | "visas"
  | "reunions"
  | "reserves"
  | "achats"
  | "finances"
  | "documents"
  | "reprise"
  | "rapports"
  | "copilote"
  | "messages"
  | "support"
  | "equipes"
  | "parametres";

/** Ordre d'affichage des rôles dans la matrice de permissions. */
export const roleOrder: Role[] = [
  "direction",
  "conducteur",
  "chef",
  "ouvrier",
  "soustraitant",
  "moa",
  "moex",
  "architecte",
  "bet",
  "controleur",
  "csps",
];

/** Rôles des intervenants extérieurs à l'entreprise de travaux. */
export const externalRoles: Role[] = ["moa", "moex", "architecte", "bet", "controleur", "csps"];

export const isExternal = (role: Role) => externalRoles.includes(role);

type Access = Record<Role, AccessLevel>;

const access = (
  direction: AccessLevel,
  conducteur: AccessLevel,
  chef: AccessLevel,
  ouvrier: AccessLevel,
  soustraitant: AccessLevel,
  moa: AccessLevel,
  moex: AccessLevel,
  architecte: AccessLevel,
  bet: AccessLevel,
  controleur: AccessLevel,
  csps: AccessLevel
): Access => ({ direction, conducteur, chef, ouvrier, soustraitant, moa, moex, architecte, bet, controleur, csps });

/*                        dir     cond    chef    ouvr    st      moa     moex    archi   bet     ct      csps  */
export const moduleAccess: Record<ModuleKey, Access> = {
  dashboard:  access("full", "full", "read", "own",  "own",  "read", "full", "read", "own",  "read", "read"),
  chantiers:  access("full", "full", "read", "none", "own",  "read", "full", "read", "own",  "read", "read"),
  pointage:   access("full", "full", "write","own",  "own",  "none", "read", "none", "none", "none", "read"),
  taches:     access("full", "full", "write","read", "own",  "none", "write","none", "none", "none", "none"),
  journal:    access("read", "full", "write","none", "read", "read", "full", "read", "none", "read", "read"),
  photos:     access("read", "full", "write","write","own",  "read", "full", "read", "none", "read", "write"),
  visas:      access("read", "write","none", "none", "none", "read", "full", "write","own",  "write","none"),
  reunions:   access("read", "write","read", "none", "read", "full", "full", "write","read", "write","write"),
  reserves:   access("read", "full", "write","none", "own",  "read", "full", "read", "none", "read", "none"),
  achats:     access("full", "full", "read", "none", "none", "none", "none", "none", "none", "none", "none"),
  finances:   access("full", "write","none", "none", "none", "read", "read", "none", "none", "none", "none"),
  documents:  access("full", "full", "read", "read", "own",  "read", "full", "write","own",  "read", "write"),
  reprise:    access("full", "write","none", "none", "none", "read", "full", "none", "none", "none", "none"),
  rapports:   access("full", "full", "read", "none", "none", "read", "full", "none", "none", "none", "none"),
  copilote:   access("full", "full", "write","none", "none", "read", "full", "read", "own",  "read", "read"),
  messages:   access("full", "full", "full", "write","write","write","full", "write","write","write","write"),
  support:    access("full", "full", "write","write","write","write","write","write","write","write","write"),
  equipes:    access("full", "full", "read", "none", "none", "read", "read", "none", "none", "none", "none"),
  parametres: access("full", "full", "write","write","write","write","write","write","write","write","write"),
};

export const levelFor = (role: Role, moduleKey: ModuleKey): AccessLevel => moduleAccess[moduleKey][role];

export const canSee = (role: Role, moduleKey: ModuleKey): boolean => levelFor(role, moduleKey) !== "none";

export const canWrite = (role: Role, moduleKey: ModuleKey): boolean => {
  const lvl = levelFor(role, moduleKey);
  return lvl === "full" || lvl === "write" || lvl === "own";
};

/* ------------------------- Indicateurs par profil -------------------------- */

/**
 * Rubriques mises en avant sur la vue d'ensemble selon le profil connecté :
 * un contrôleur technique n'a pas les mêmes indicateurs qu'un promoteur.
 */
export type KpiKey =
  | "budget"
  | "progress"
  | "delay"
  | "team"
  | "myHours"
  | "myTasks"
  | "visasPending"
  | "visaDelay"
  | "myPlans"
  | "obsToLift"
  | "avisOpen"
  | "conformity"
  | "safetyAvis"
  | "nextMeeting"
  | "openReserves"
  | "marketInvoiced";

export const roleKpis: Record<Role, KpiKey[]> = {
  direction: ["budget", "progress", "delay", "team"],
  conducteur: ["budget", "progress", "delay", "team"],
  chef: ["team", "progress", "myTasks", "delay"],
  ouvrier: ["myHours", "myTasks", "team"],
  soustraitant: ["myTasks", "openReserves", "progress", "delay"],
  moa: ["progress", "marketInvoiced", "delay", "avisOpen"],
  moex: ["visasPending", "avisOpen", "progress", "delay"],
  architecte: ["myPlans", "obsToLift", "progress", "nextMeeting"],
  bet: ["myPlans", "visaDelay", "obsToLift", "nextMeeting"],
  controleur: ["conformity", "avisOpen", "visasPending", "safetyAvis"],
  csps: ["safetyAvis", "avisOpen", "team", "progress"],
};

/** Sections de la vue d'ensemble visibles par profil. */
export type DashSection = "curve" | "alerts" | "presence" | "deadlines" | "budget" | "visas" | "avis" | "meeting";

export const roleSections: Record<Role, DashSection[]> = {
  direction: ["curve", "alerts", "presence", "deadlines", "budget"],
  conducteur: ["curve", "alerts", "presence", "deadlines", "budget"],
  chef: ["curve", "alerts", "presence", "deadlines"],
  ouvrier: ["deadlines", "presence"],
  soustraitant: ["curve", "deadlines", "avis"],
  moa: ["curve", "alerts", "avis", "meeting", "budget"],
  moex: ["curve", "alerts", "visas", "avis", "meeting", "deadlines"],
  architecte: ["curve", "visas", "avis", "meeting"],
  bet: ["visas", "avis", "meeting", "curve"],
  controleur: ["visas", "avis", "meeting", "curve"],
  csps: ["avis", "presence", "meeting", "curve"],
};
