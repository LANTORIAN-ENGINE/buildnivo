/**
 * Données de la vitrine commerciale (pages publiques avant connexion).
 *
 * Structure uniquement : identifiants, positions, prix, matrices d'accès. Tous les
 * libellés vivent dans les dictionnaires i18n sous `site.*` (accès via `t("site.…")`).
 * Source : « BuildNivo — Document de référence produit », Blue Valoris FZCO, v2.0.
 */

/* -------------------------------------------------------------------------- */
/* Hero — le mur d'outils qui converge vers une plateforme unique              */
/* -------------------------------------------------------------------------- */

/** Puce d'outil dispersé : position en %, inclinaison et rythme de flottement. */
export interface ScatterTool {
  id: string;
  /** position au repos, en % du cadre */
  x: number;
  y: number;
  tilt: number;
  dur: number;
  delay: number;
}

export const scatterTools: ScatterTool[] = [
  { id: "whatsapp", x: 6, y: 12, tilt: -4, dur: 7.5, delay: 0 },
  { id: "excel", x: 60, y: 6, tilt: 3, dur: 8.5, delay: 0.6 },
  { id: "mails", x: 30, y: 22, tilt: 2, dur: 6.8, delay: 1.1 },
  { id: "pdf", x: 78, y: 20, tilt: -3, dur: 9, delay: 0.3 },
  { id: "calls", x: 2, y: 38, tilt: 3, dur: 7.9, delay: 1.6 },
  { id: "photos", x: 46, y: 34, tilt: -2, dur: 8.2, delay: 0.9 },
  { id: "paper", x: 82, y: 44, tilt: 4, dur: 7.2, delay: 1.4 },
  { id: "payroll", x: 14, y: 54, tilt: -3, dur: 8.8, delay: 0.2 },
  { id: "planning", x: 55, y: 55, tilt: 2, dur: 7.4, delay: 1.9 },
  { id: "accounting", x: 33, y: 68, tilt: 3, dur: 9.3, delay: 0.7 },
  { id: "drive", x: 74, y: 66, tilt: -4, dur: 8, delay: 1.2 },
  { id: "minutes", x: 4, y: 76, tilt: 2, dur: 7.7, delay: 0.4 },
  { id: "clock", x: 58, y: 82, tilt: -2, dur: 8.6, delay: 1.7 },
  { id: "delivery", x: 26, y: 89, tilt: 3, dur: 7.1, delay: 1 },
];

/** Bandeau défilant : ce que la plateforme remplace. */
export const replacedTools = [
  "whatsapp",
  "excel",
  "mails",
  "pdf",
  "calls",
  "photos",
  "paper",
  "payroll",
  "planning",
  "accounting",
  "drive",
  "minutes",
  "clock",
  "delivery",
  "quotes",
  "sms",
];

/** Chiffres clés affichés en compteurs animés. */
export const keyFigures = {
  marketLow: 8,
  marketHigh: 12,
  marketGrowth: 10,
  multiProduct: 78,
  sixProducts: 52,
  projectPrice: 790,
  extraProjectPrice: 299,
  essentialPrice: 99,
  businessPrice: 299,
  studioPrice: 99,
  trialDays: 30,
  graceDays: 15,
  targetMin: 20,
  targetMax: 300,
  mvpDifficulty: 7,
  fullDifficulty: 9,
  demoRoles: 14,
  demoModules: 19,
};

/* -------------------------------------------------------------------------- */
/* Ce que couvre la plateforme — passerelles vers la démo                      */
/* -------------------------------------------------------------------------- */

export type ModulePole = "terrain" | "gestion" | "intelligence" | "collaboration";

export interface SiteModule {
  id: string;
  pole: ModulePole;
  /** écran correspondant dans la démo */
  href: string;
}

export const siteModules: SiteModule[] = [
  { id: "pointage", pole: "terrain", href: "/pointage" },
  { id: "taches", pole: "terrain", href: "/taches" },
  { id: "journal", pole: "terrain", href: "/journal" },
  { id: "photos", pole: "terrain", href: "/photos" },
  { id: "reserves", pole: "terrain", href: "/reserves" },
  { id: "chantiers", pole: "terrain", href: "/chantiers" },
  { id: "documents", pole: "gestion", href: "/documents" },
  { id: "achats", pole: "gestion", href: "/achats" },
  { id: "finances", pole: "gestion", href: "/finances" },
  { id: "equipes", pole: "gestion", href: "/equipes" },
  { id: "visas", pole: "gestion", href: "/visas" },
  { id: "reprise", pole: "gestion", href: "/reprise" },
  { id: "controle", pole: "gestion", href: "/controle" },
  { id: "rapports", pole: "intelligence", href: "/rapports" },
  { id: "copilote", pole: "intelligence", href: "/copilote" },
  { id: "dashboard", pole: "intelligence", href: "/dashboard" },
  { id: "messages", pole: "collaboration", href: "/messages" },
  { id: "reunions", pole: "collaboration", href: "/reunions" },
  { id: "support", pole: "collaboration", href: "/support" },
];

export const modulePoles: ModulePole[] = ["terrain", "gestion", "intelligence", "collaboration"];

/* -------------------------------------------------------------------------- */
/* L'empilement de valeur : Project → Company → Studios                        */
/* -------------------------------------------------------------------------- */

export interface ProductLevel {
  id: "project" | "company" | "studios";
  /** niveau affiché en repère de plan (N+00, N+01, N+02) */
  level: string;
  price: number;
  /** identifiants des fonctions listées, libellés dans i18n */
  features: string[];
}

export const productLevels: ProductLevel[] = [
  {
    id: "project",
    level: "N+00",
    price: 790,
    features: ["pointage", "taches", "photos", "reserves", "documents", "journal", "planning", "echanges", "effectifs", "reporting"],
  },
  {
    id: "company",
    level: "N+01",
    price: 99,
    features: ["crm", "rh", "multiChantier", "paie", "ged", "achats", "stocks", "erp", "dashboards", "iaDoc", "automations"],
  },
  {
    id: "studios",
    level: "N+02",
    price: 99,
    features: ["promoteur", "architecte", "moe", "entreprise"],
  },
];

/** Les trois états possibles d'une entreprise sur la plateforme. */
export const companyStates = ["member", "trial", "subscriber"] as const;

/** Frontière fonctionnelle : cas d'usage chantier ↔ équivalent entreprise. */
export const frontierRows = ["pointage", "documents", "taches", "avancement", "fournitures"];

/** Continuité de service en cas d'impayé de l'abonnement Project. */
export const graceSteps = [
  { id: "j0", day: 0 },
  { id: "j15", day: 15 },
  { id: "lock", day: 16 },
];

/** Socle gratuit permanent (Project) et bascule payante (Company). */
export interface FreeTierRow {
  id: string;
  paid: boolean;
}

export const freeTierRows: FreeTierRow[] = [
  { id: "profil", paid: false },
  { id: "participation", paid: false },
  { id: "pointageProjet", paid: false },
  { id: "photosProblemes", paid: false },
  { id: "messagerie", paid: false },
  { id: "crHebdo", paid: false },
  { id: "essai", paid: false },
  { id: "pointageConsolide", paid: true },
  { id: "crmErp", paid: true },
  { id: "historique", paid: true },
  { id: "rapportsAvances", paid: true },
];

/* -------------------------------------------------------------------------- */
/* Grille tarifaire                                                            */
/* -------------------------------------------------------------------------- */

export interface Plan {
  id: string;
  family: "project" | "company" | "studio";
  price: number;
  featured?: boolean;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "project",
    family: "project",
    price: 790,
    featured: true,
    features: ["operation", "usersInternes", "intervenants", "acquereurs", "controleFinancier", "ged", "planning", "journal", "reserves", "photos", "cr", "pointage", "ia", "automations"],
  },
  {
    id: "essential",
    family: "company",
    price: 99,
    features: ["crm", "cloud", "ged", "documents", "agenda", "iaDoc", "collaboration"],
  },
  {
    id: "business",
    family: "company",
    price: 299,
    features: ["erp", "rh", "pointageMulti", "compta", "banque", "crm", "ia", "ocr", "emails", "automations", "stocks", "achats", "dashboards"],
  },
  {
    id: "studio",
    family: "studio",
    price: 99,
    features: ["promoteur", "architecte", "moe", "entreprise"],
  },
];

/* -------------------------------------------------------------------------- */
/* Cloisonnement des données par rôle (RBAC)                                   */
/* -------------------------------------------------------------------------- */

/** Complet · Agrégé · Urgence (bris de glace tracé) · Aucun · Sans objet. */
export type AccessLevel = "full" | "aggregate" | "urgent" | "none" | "na";

export type RbacRole =
  | "moa"
  | "moex"
  | "entreprise"
  | "chef"
  | "architecte"
  | "fournisseur"
  | "banque"
  | "acquereur"
  | "sav";

export const rbacRoles: RbacRole[] = [
  "moa",
  "moex",
  "entreprise",
  "chef",
  "architecte",
  "fournisseur",
  "banque",
  "acquereur",
  "sav",
];

export interface RbacBarrier {
  id: "nominative" | "commercial" | "documentary";
  columns: string[];
  access: Record<RbacRole, AccessLevel[]>;
}

export const rbacBarriers: RbacBarrier[] = [
  {
    id: "nominative",
    columns: ["ownNames", "otherNames", "headcount"],
    access: {
      moa: ["none", "urgent", "aggregate"],
      moex: ["none", "urgent", "aggregate"],
      entreprise: ["full", "none", "aggregate"],
      chef: ["full", "none", "aggregate"],
      architecte: ["none", "none", "aggregate"],
      fournisseur: ["none", "none", "none"],
      banque: ["none", "none", "none"],
      acquereur: ["none", "none", "none"],
      sav: ["none", "none", "none"],
    },
  },
  {
    id: "commercial",
    columns: ["ownMarket", "otherMarkets", "globalFinance"],
    access: {
      moa: ["na", "full", "full"],
      moex: ["na", "full", "full"],
      entreprise: ["full", "none", "none"],
      chef: ["full", "none", "none"],
      architecte: ["full", "none", "none"],
      fournisseur: ["full", "none", "none"],
      banque: ["none", "none", "aggregate"],
      acquereur: ["none", "none", "none"],
      sav: ["none", "none", "none"],
    },
  },
  {
    id: "documentary",
    columns: ["ownLot", "general", "financial"],
    access: {
      moa: ["full", "full", "full"],
      moex: ["full", "full", "none"],
      entreprise: ["full", "aggregate", "none"],
      chef: ["full", "aggregate", "none"],
      architecte: ["full", "full", "none"],
      fournisseur: ["none", "none", "none"],
      banque: ["none", "none", "none"],
      acquereur: ["none", "aggregate", "none"],
      sav: ["none", "aggregate", "none"],
    },
  },
];

/** Déclencheur d'alerte manuel : gravité et destinataires proposés. */
export const alertSeverities = ["mineur", "serieux", "grave"] as const;
export const alertRecipients = ["banque", "investisseur", "fournisseur"] as const;

/* -------------------------------------------------------------------------- */
/* Studios métier                                                              */
/* -------------------------------------------------------------------------- */

export interface Studio {
  id: "promoteur" | "architecte" | "moe" | "entreprise";
  price: number;
  features: string[];
}

export const studios: Studio[] = [
  { id: "promoteur", price: 99, features: ["bilan", "commercialisation", "acquereurs", "appels", "livraison", "sav", "marge", "tresorerie", "controleFinancier"] },
  { id: "architecte", price: 99, features: ["cctp", "dpgf", "quantitatifs", "bim", "plans", "variantes", "notices"] },
  { id: "moe", price: 99, features: ["cr", "visas", "opr", "reserves", "planning", "execution", "dashboards"] },
  { id: "entreprise", price: 99, features: ["materiel", "stocks", "achats", "productivite", "soustraitance", "pointage"] },
];

/* -------------------------------------------------------------------------- */
/* Intelligence artificielle transversale                                      */
/* -------------------------------------------------------------------------- */

export const aiCapabilities = ["dictation", "reports", "rag", "risks", "reminders", "classification"] as const;

export const aiGovernance = ["scope", "human", "sources", "audit"] as const;

/* -------------------------------------------------------------------------- */
/* BuildNivo Supply                                                            */
/* -------------------------------------------------------------------------- */

export const supplySteps = ["quantitatif", "detection", "request", "scenarios", "logistics"] as const;

export interface SupplyScenario {
  id: "local" | "mixte" | "import";
  /** délai indicatif en jours (démo) */
  days: number;
  /** indice de coût, base 100 = achat local (démo) */
  index: number;
}

export const supplyScenarios: SupplyScenario[] = [
  { id: "local", days: 6, index: 100 },
  { id: "mixte", days: 21, index: 79 },
  { id: "import", days: 38, index: 62 },
];

/* -------------------------------------------------------------------------- */
/* Différenciation concurrentielle                                             */
/* -------------------------------------------------------------------------- */

export type Coverage = "yes" | "partial" | "no";

export const compareCriteria = ["hub", "erp", "crm", "bim", "network", "pme"] as const;

export interface CompetitorRow {
  id: string;
  self?: boolean;
  coverage: Record<(typeof compareCriteria)[number], Coverage>;
}

export const competitors: CompetitorRow[] = [
  {
    id: "buildnivo",
    self: true,
    coverage: { hub: "yes", erp: "yes", crm: "yes", bim: "partial", network: "yes", pme: "yes" },
  },
  {
    id: "procore",
    coverage: { hub: "no", erp: "partial", crm: "no", bim: "partial", network: "no", pme: "no" },
  },
  {
    id: "autodesk",
    coverage: { hub: "no", erp: "no", crm: "no", bim: "yes", network: "no", pme: "no" },
  },
  {
    id: "cmic",
    coverage: { hub: "no", erp: "yes", crm: "partial", bim: "partial", network: "no", pme: "no" },
  },
  {
    id: "b2o",
    coverage: { hub: "no", erp: "yes", crm: "yes", bim: "no", network: "no", pme: "yes" },
  },
  {
    id: "field",
    coverage: { hub: "partial", erp: "no", crm: "no", bim: "partial", network: "no", pme: "yes" },
  },
];

export const differentiators = [
  "simple",
  "mobile",
  "gratuit",
  "cloisonnement",
  "rh",
  "iaAction",
  "acquereurs",
  "tarif",
  "francophone",
] as const;

/* -------------------------------------------------------------------------- */
/* Noyau MVP & principes techniques                                            */
/* -------------------------------------------------------------------------- */

export const mvpCore = [
  "users",
  "pointage",
  "taches",
  "journal",
  "photos",
  "documents",
  "cr",
  "essai",
  "rbac",
] as const;

export const techPrinciples = ["cloud", "modulaire", "permissions", "offline", "stockage", "notifications", "siret"] as const;

/* -------------------------------------------------------------------------- */
/* Preuves, questions fréquentes, contact                                      */
/* -------------------------------------------------------------------------- */

/** Témoignages de démonstration — personnes et citations factices. */
export interface Testimonial {
  id: string;
  name: string;
  company: string;
  hue: number;
}

export const testimonials: Testimonial[] = [
  { id: "promoteur", name: "Élodie Rivière", company: "Foncière Bourbon Promotion", hue: 262 },
  { id: "entreprise", name: "Sylvain Bègue", company: "Bâtir Océan Indien", hue: 220 },
  { id: "moe", name: "Nadège Técher", company: "Cap Sud Maîtrise d'Œuvre", hue: 152 },
];

export const faqItemsSite = [
  "gratuit",
  "essai",
  "cloisonnement",
  "impaye",
  "encours",
  "horsligne",
  "ia",
  "deploiement",
] as const;

export const contactChannels = ["demo", "phone", "email"] as const;

/** Étapes proposées après une demande de démonstration. */
export const demoSteps = ["contact", "cadrage", "pilote", "deploiement"] as const;

/** Zone de lancement et ambitions à moyen terme. */
export const launchZones = ["france", "outremer"] as const;
export const nextZones = ["maurice", "eau", "afrique", "portugal"] as const;
