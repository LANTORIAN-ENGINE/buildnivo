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
  | "controle"
  | "controleRapports"
  | "controleJustificatifs"
  | "controleAcces"
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
  "financier",
];

/** Rôles des intervenants extérieurs à l'entreprise de travaux. */
export const externalRoles: Role[] = ["moa", "moex", "architecte", "bet", "controleur", "csps"];

export const isExternal = (role: Role) => externalRoles.includes(role);

/**
 * Intervenants financiers : ils financent, garantissent, assurent ou contrôlent
 * l'opération sans participer au chantier. Accès strictement en lecture, limité
 * à l'opération pour laquelle ils ont été invités.
 */
export const isFinancial = (role: Role) => role === "financier";

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
  csps: AccessLevel,
  financier: AccessLevel
): Access => ({ direction, conducteur, chef, ouvrier, soustraitant, moa, moex, architecte, bet, controleur, csps, financier });

/*
 * Le contrôle financier n'ouvre que quatre écrans, tous en lecture. Il ne voit
 * ni la messagerie interne, ni les pointages, ni les achats, ni les autres
 * opérations du promoteur (§7 du brief). Les écrans de paramétrage de l'accès
 * appartiennent au promoteur, jamais à l'invité.
 */
/*                              dir     cond    chef    ouvr    st      moa     moex    archi   bet     ct      csps    fin   */
export const moduleAccess: Record<ModuleKey, Access> = {
  dashboard:             access("full", "full", "read", "own",  "own",  "read", "full", "read", "own",  "read", "read", "none"),
  chantiers:             access("full", "full", "read", "none", "own",  "read", "full", "read", "own",  "read", "read", "none"),
  pointage:              access("full", "full", "write","own",  "own",  "none", "read", "none", "none", "none", "read", "none"),
  taches:                access("full", "full", "write","read", "own",  "none", "write","none", "none", "none", "none", "none"),
  journal:               access("read", "full", "write","none", "read", "read", "full", "read", "none", "read", "read", "none"),
  photos:                access("read", "full", "write","write","own",  "read", "full", "read", "none", "read", "write", "none"),
  visas:                 access("read", "write","none", "none", "none", "read", "full", "write","own",  "write","none", "none"),
  reunions:              access("read", "write","read", "none", "read", "full", "full", "write","read", "write","write", "none"),
  reserves:              access("read", "full", "write","none", "own",  "read", "full", "read", "none", "read", "none", "none"),
  achats:                access("full", "full", "read", "none", "none", "none", "none", "none", "none", "none", "none", "none"),
  finances:              access("full", "write","none", "none", "none", "read", "read", "none", "none", "none", "none", "none"),
  documents:             access("full", "full", "read", "read", "own",  "read", "full", "write","own",  "read", "write", "none"),
  reprise:               access("full", "write","none", "none", "none", "read", "full", "none", "none", "none", "none", "none"),
  rapports:              access("full", "full", "read", "none", "none", "read", "full", "none", "none", "none", "none", "none"),
  copilote:              access("full", "full", "write","none", "none", "read", "full", "read", "own",  "read", "read", "none"),
  controle:              access("full", "read", "none", "none", "none", "full", "read", "none", "none", "none", "none", "read"),
  controleRapports:      access("full", "read", "none", "none", "none", "full", "read", "none", "none", "none", "none", "read"),
  controleJustificatifs: access("read", "read", "none", "none", "none", "full", "read", "none", "none", "none", "none", "read"),
  controleAcces:         access("full", "read", "none", "none", "none", "full", "none", "none", "none", "none", "none", "none"),
  messages:              access("full", "full", "full", "write","write","write","full", "write","write","write","write", "none"),
  support:               access("full", "full", "write","write","write","write","write","write","write","write","write", "write"),
  equipes:               access("full", "full", "read", "none", "none", "read", "read", "none", "none", "none", "none", "none"),
  parametres:            access("full", "full", "write","write","write","write","write","write","write","write","write", "write"),
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

/** Écran d'accueil du profil : le contrôle financier n'a pas de vue d'ensemble chantier. */
export const homeFor = (role: Role): string => (isFinancial(role) ? "/controle" : "/dashboard");

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
  /* Le contrôle financier a son propre tableau de bord standardisé (/controle). */
  financier: [],
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
  financier: [],
};

/* -------------------- Périmètre du contrôle financier ---------------------- */

/**
 * Correspondance route → module, utilisée pour empêcher l'accès direct par URL
 * à un écran hors périmètre (un garant qui saisirait /pointage, par exemple).
 * Les routes absentes de cette table ne sont pas contrôlées.
 */
export const moduleForPath = (pathname: string): ModuleKey | undefined => {
  const routes: [string, ModuleKey][] = [
    ["/controle/rapports", "controleRapports"],
    ["/controle/justificatifs", "controleJustificatifs"],
    ["/controle/acces", "controleAcces"],
    ["/controle", "controle"],
    ["/dashboard", "dashboard"],
    ["/chantiers", "chantiers"],
    ["/pointage", "pointage"],
    ["/taches", "taches"],
    ["/journal", "journal"],
    ["/photos", "photos"],
    ["/visas", "visas"],
    ["/reunions", "reunions"],
    ["/reprise", "reprise"],
    ["/reserves", "reserves"],
    ["/achats", "achats"],
    ["/finances", "finances"],
    ["/documents", "documents"],
    ["/rapports", "rapports"],
    ["/copilote", "copilote"],
    ["/messages", "messages"],
    ["/support", "support"],
    ["/equipes", "equipes"],
    ["/parametres", "parametres"],
  ];
  return routes.find(([href]) => pathname === href || pathname.startsWith(href + "/"))?.[1];
};
