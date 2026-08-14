/**
 * Intervenants externes de l'opération : circuit de visa des plans d'exécution,
 * avis réglementaires, réunions de chantier hebdomadaires, production
 * documentaire assistée et reprise d'un chantier déjà démarré.
 * (Périmètre issu de la réunion du 31/07/2026.)
 */
import type {
  AiDocDraft,
  Avis,
  PlanSubmission,
  RepriseFile,
  RepriseResult,
  RepriseStep,
  SiteMeeting,
} from "@/types";
import { daysAgo, inDays } from "./core";

/* ------------------------- Plans d'exécution & visas ----------------------- */

export const planSubmissions: PlanSubmission[] = [
  {
    id: "EXE-ELE-204",
    projectId: "p-sunset",
    name: "Plans EXE courants forts — Bât. A R+2/R+3",
    discipline: "electricite",
    version: "ind. B",
    submittedBy: "c-ohm",
    submittedAt: daysAgo(2),
    status: "enAttente",
    observations: [],
    calcNote: false,
    zoneId: "z-a-r2",
    blocksKey: "cloisonsR2",
    dueAt: inDays(1),
  },
  {
    id: "EXE-FLU-118",
    projectId: "p-sunset",
    name: "Plans EXE fluides — colonnes EU/EV Bât. A",
    discipline: "fluides",
    version: "ind. C",
    submittedBy: "c-fluides",
    submittedAt: daysAgo(6),
    status: "favorableObs",
    reviewedAt: daysAgo(4),
    observations: [
      "Reprendre le calepinage des réservations du logement 23 selon PLN-A-201 ind. C.",
      "Préciser la nature des fourreaux traversant le voile coupe-feu du R+1.",
    ],
    ctStatus: "favorable",
    ctNote: "Sans objet au titre de la mission L. Conformité EU/EV vérifiée.",
    calcNote: true,
    zoneId: "z-a-r1",
  },
  {
    id: "EXE-STR-090",
    projectId: "p-sunset",
    name: "Plans de coffrage + note de calcul dalle haute R+2",
    discipline: "structure",
    version: "ind. D",
    submittedBy: "c-structura",
    submittedAt: daysAgo(12),
    status: "favorable",
    reviewedAt: daysAgo(10),
    observations: [],
    ctStatus: "favorable",
    ctNote: "Avis favorable mission LP. Note de calcul conforme EC2 + zone cyclonique.",
    calcNote: true,
    zoneId: "z-a-r2",
  },
  {
    id: "EXE-CHA-042",
    projectId: "p-sunset",
    name: "Charpente et couverture — Bât. B, descente de charges",
    discipline: "charpente",
    version: "ind. A",
    submittedBy: "c-tramebois",
    submittedAt: daysAgo(5),
    status: "defavorable",
    reviewedAt: daysAgo(3),
    observations: [
      "Descente de charges établie sans la surcharge cyclonique réglementaire (DTU / Eurocode annexe DOM).",
      "Fixations des pannes non cotées sur les files 4 à 7.",
      "Redéposer en indice B sous 5 jours : la commande de charpente est bloquée.",
    ],
    calcNote: true,
    zoneId: "z-b-r1",
    blocksKey: "charpenteB",
    dueAt: inDays(2),
  },
  {
    id: "EXE-VRD-011",
    projectId: "p-sunset",
    name: "Profil en long réseaux EP — voirie lot 3",
    discipline: "vrd",
    version: "ind. B",
    submittedBy: "c-geovrd",
    submittedAt: daysAgo(1),
    status: "enAttente",
    observations: [],
    calcNote: false,
    zoneId: "z-ext",
    dueAt: inDays(4),
  },
  {
    id: "EXE-ARC-007",
    projectId: "p-sunset",
    name: "Esquisse modificative — hall d'entrée Bât. A",
    discipline: "structure",
    version: "esquisse 2",
    submittedBy: "c-archipel",
    submittedAt: daysAgo(4),
    status: "favorableObs",
    reviewedAt: daysAgo(2),
    observations: ["Impact chiffré à valider par le maître d'ouvrage avant ordre de service (+ 18 400 € estimés)."],
    calcNote: false,
    zoneId: "z-a-rdc",
  },
  {
    id: "EXE-ELE-198",
    projectId: "p-sunset",
    name: "Plans EXE courants faibles — VDI logements",
    discipline: "electricite",
    version: "ind. A",
    submittedBy: "c-ohm",
    submittedAt: daysAgo(21),
    status: "favorable",
    reviewedAt: daysAgo(18),
    observations: [],
    ctStatus: "favorableObs",
    ctNote: "Rappeler l'obligation de continuité des chemins de câbles coupe-feu au droit des gaines.",
    calcNote: false,
  },
  {
    id: "EXE-STR-101",
    projectId: "p-albany",
    name: "Semelles filantes zone Nord — plan de ferraillage",
    discipline: "structure",
    version: "ind. B",
    submittedBy: "c-structura",
    submittedAt: daysAgo(8),
    status: "favorable",
    reviewedAt: daysAgo(6),
    observations: [],
    ctStatus: "enAttente",
    calcNote: true,
    zoneId: "z-alb-fond",
  },
];

/* ------------------------------ Avis des acteurs --------------------------- */

export const avisList: Avis[] = [
  {
    id: "av-01",
    projectId: "p-sunset",
    authorRole: "controleur",
    author: "Veritas Océan Indien — J.-M. Perrin",
    nature: "reglementaire",
    subject: "Trémie ascenseur : protection collective non conforme",
    body:
      "Lors de la visite du R+2, le garde-corps provisoire de la trémie ascenseur était déposé sans dispositif de remplacement. Mise en sécurité constatée à 9h10. Avis suspensif sur la reprise des travaux dans la zone tant que la protection définitive n'est pas posée.",
    date: daysAgo(1),
    severity: "critique",
    hidden: false,
    docRef: "RAP-VT-2026-118",
  },
  {
    id: "av-02",
    projectId: "p-sunset",
    authorRole: "csps",
    author: "Prévencia SPS — K. Payet",
    nature: "reglementaire",
    subject: "Co-activité grue n°1 : plan de prévention à mettre à jour",
    body:
      "L'indisponibilité de la grue n°2 concentre tous les levages sur la grue n°1, en co-activité avec les équipes de cloisons. Le PPSPS doit être mis à jour avant lundi et un briefing sécurité tenu avec les trois entreprises concernées.",
    date: daysAgo(1),
    severity: "elevee",
    hidden: false,
    docRef: "PPSPS ind. 3",
  },
  {
    id: "av-03",
    projectId: "p-sunset",
    authorRole: "moex",
    author: "Cap Sud MOE — C. Hoareau",
    nature: "reglementaire",
    subject: "Avis défavorable — charpente Bât. B (EXE-CHA-042)",
    body:
      "La descente de charges ne prend pas en compte la surcharge cyclonique réglementaire. Redépôt en indice B exigé sous 5 jours ; la commande de charpente reste bloquée jusqu'au visa favorable.",
    date: daysAgo(3),
    severity: "elevee",
    hidden: false,
    submissionId: "EXE-CHA-042",
  },
  {
    id: "av-04",
    projectId: "p-sunset",
    authorRole: "architecte",
    author: "Atelier Archipel — L. Fontaine",
    nature: "observation",
    subject: "Teinte d'enduit du hall : nuance hors palette",
    body:
      "L'échantillon posé sur le hall Bât. A tire vers le gris. La teinte contractuelle reste « Blanc Corail » NCS S 0502-Y (CCTP Lot 03). Merci de reprendre l'échantillon avant généralisation.",
    date: daysAgo(2),
    severity: "info",
    hidden: false,
    docRef: "d-04",
  },
  {
    id: "av-05",
    projectId: "p-sunset",
    authorRole: "controleur",
    author: "Veritas Océan Indien — J.-M. Perrin",
    nature: "reglementaire",
    subject: "Demande de pièces — essais béton dalle R+2",
    body:
      "Merci de transmettre les procès-verbaux d'essais à 7 jours des éprouvettes de la dalle haute R+2 (BL-88412), ainsi que le PV de réception des supports d'étanchéité.",
    date: inDays(0),
    severity: "info",
    hidden: false,
  },
  {
    id: "av-06",
    projectId: "p-sunset",
    authorRole: "architecte",
    author: "Atelier Archipel — L. Fontaine",
    nature: "observation",
    subject: "Suggestion d'implantation des luminaires du hall",
    body:
      "Proposition de décaler la ligne de luminaires de 40 cm pour l'aligner sur le calepinage du faux plafond. Sans incidence réglementaire ni sur le marché.",
    date: daysAgo(4),
    severity: "info",
    hidden: true,
    submissionId: "EXE-ARC-007",
  },
  {
    id: "av-07",
    projectId: "p-sunset",
    authorRole: "csps",
    author: "Prévencia SPS — K. Payet",
    nature: "observation",
    subject: "Base vie : rangement des zones de circulation",
    body: "Palettes de rails stockées devant l'issue de secours du bungalow. Remise en ordre demandée au chef de chantier.",
    date: daysAgo(5),
    severity: "info",
    hidden: false,
  },
  {
    id: "av-08",
    projectId: "p-albany",
    authorRole: "controleur",
    author: "Veritas Océan Indien — J.-M. Perrin",
    nature: "reglementaire",
    subject: "Ferraillage semelles zone Nord : contrôle avant coulage",
    body: "Passage à prévoir avant coulage des semelles filantes. Merci de prévenir 48 h à l'avance via la plateforme.",
    date: daysAgo(2),
    severity: "elevee",
    hidden: false,
    submissionId: "EXE-STR-101",
  },
];

/* -------------------- Réunions de chantier hebdomadaires ------------------- */

const sunsetAttendees = [
  { name: "Cédric Hoareau", role: "moex" as const, company: "Cap Sud MOE", present: true },
  { name: "Hélène Vitry", role: "moa" as const, company: "Foncière Bourbon", present: true },
  { name: "Marc Dorseuil", role: "conducteur" as const, company: "Bâtir Océan Indien", present: true },
  { name: "Sofia Bègue", role: "chef" as const, company: "Bâtir Océan Indien", present: true },
  { name: "Léa Fontaine", role: "architecte" as const, company: "Atelier Archipel", present: true },
  { name: "Jean-Marc Perrin", role: "controleur" as const, company: "Veritas OI", present: true },
  { name: "Karine Payet", role: "csps" as const, company: "Prévencia SPS", present: false, excused: true },
  { name: "Rémi Lauret", role: "bet" as const, company: "Ohm Ingénierie", present: true },
  { name: "Bruno Dijoux", role: "soustraitant" as const, company: "PLOMB'ÉO", present: false },
];

export const siteMeetings: SiteMeeting[] = [
  {
    id: "CR-35",
    projectId: "p-sunset",
    number: 35,
    date: inDays(0),
    nextDate: inDays(7),
    status: "brouillon",
    attendees: sunsetAttendees,
    sections: [
      {
        key: "avancement",
        text:
          "Avancement réalisé 68 % pour 75 % planifié (retard 12 jours, stable). Dalle haute R+2 Bât. A coulée ce jour (3 toupies, BL-88412). Cloisons R+2 Bât. A terminées, en attente de contrôle. Étanchéité toiture Bât. A : relevés posés, essai à l'eau jeudi. Bât. B à l'arrêt sur les cloisons faute de rails (CMD-2026-118 confirmée à J+3).",
      },
      {
        key: "effectifs",
        text:
          "42 personnes présentes sur 48 prévues. Absence totale de PLOMB'ÉO ce jour, non prévenue : relance officielle envoyée. 3 plaquistes présents sur 6 : risque de 3 jours sur les cloisons Bât. B.",
      },
      {
        key: "visas",
        text:
          "EXE-CHA-042 (charpente Bât. B) : avis DÉFAVORABLE, redépôt indice B sous 5 jours. EXE-ELE-204 (courants forts R+2/R+3) : en attente de visa MOE, échéance demain — bloque la fermeture des cloisons. EXE-FLU-118 : favorable avec observations, levées à confirmer. EXE-STR-090 : favorable, contre-visa Veritas favorable.",
      },
      {
        key: "securite",
        text:
          "Garde-corps de la trémie ascenseur R+2 déposé sans remplacement : mise en sécurité à 9h10, avis suspensif du contrôleur technique sur la zone. PPSPS à mettre à jour avant lundi (co-activité grue n°1).",
      },
      {
        key: "administratif",
        text:
          "ElecRun OI : attestation URSSAF expirée depuis 10 jours, accès chantier suspendu à défaut de régularisation sous 48 h. Ohm Ingénierie : RC pro à renouveler sous 9 jours. Situation n°8 gros œuvre (214 500 € HT) en attente de validation MOE depuis 5 jours.",
      },
    ],
    avisIds: ["av-01", "av-02", "av-03", "av-04", "av-05", "av-06"],
    actions: [
      { label: "Viser les plans EXE courants forts (EXE-ELE-204)", owner: "Cap Sud MOE", due: inDays(1) },
      { label: "Redéposer la charpente Bât. B en indice B", owner: "Trame Bois Ingénierie", due: inDays(2) },
      { label: "Reposer la protection collective trémie ascenseur", owner: "Bâtir Océan Indien", due: inDays(1) },
      { label: "Régulariser l'attestation URSSAF", owner: "ElecRun OI", due: inDays(2) },
      { label: "Confirmer la date ferme des menuiseries R+1", owner: "Charpentes Payet", due: inDays(1) },
    ],
  },
  {
    id: "CR-34",
    projectId: "p-sunset",
    number: 34,
    date: daysAgo(7),
    nextDate: inDays(0),
    status: "diffuse",
    attendees: sunsetAttendees.map((a) => ({ ...a, present: true, excused: false })),
    sections: [
      {
        key: "avancement",
        text:
          "Avancement 63 % pour 68 % planifié. Coffrage dalle R+2 terminé, ferraillage réceptionné. Calepinage de façade validé : joints creux horizontaux tous les 2 niveaux selon PLN-A-201 ind. C.",
      },
      {
        key: "visas",
        text: "EXE-STR-090 visé favorable (dalle haute R+2). EXE-FLU-118 en cours d'instruction. Diffusion de l'indice C du plan étage courant : l'indice B est retiré du chantier.",
      },
      {
        key: "securite",
        text: "Visite SPS sans observation majeure. Rappel sur le port du harnais en rive de dalle.",
      },
    ],
    avisIds: ["av-07"],
    actions: [
      { label: "Diffuser l'indice C aux entreprises", owner: "Cap Sud MOE", due: daysAgo(5) },
      { label: "Commander les rails de cloisons Bât. B", owner: "Bâtir Océan Indien", due: daysAgo(2) },
    ],
  },
  {
    id: "CR-36",
    projectId: "p-sunset",
    number: 36,
    date: inDays(7),
    nextDate: inDays(14),
    status: "planifiee",
    attendees: sunsetAttendees.map((a) => ({ ...a, present: true, excused: false })),
    sections: [],
    avisIds: [],
    actions: [],
  },
  {
    id: "CR-08",
    projectId: "p-albany",
    number: 8,
    date: daysAgo(2),
    nextDate: inDays(5),
    status: "diffuse",
    attendees: [
      { name: "Cédric Hoareau", role: "moex", company: "Cap Sud MOE", present: true },
      { name: "Marc Dorseuil", role: "conducteur", company: "Bâtir Océan Indien", present: true },
      { name: "Pascal Nativel", role: "bet", company: "BET Structura", present: true },
      { name: "Jean-Marc Perrin", role: "controleur", company: "Veritas OI", present: false, excused: true },
    ],
    sections: [
      {
        key: "avancement",
        text: "Terrassement 64 %, fondations 18 %. Ferraillage des semelles filantes zone Nord terminé, conforme au bon BL-2214.",
      },
      { key: "visas", text: "EXE-STR-101 visé favorable par la MOE, contre-visa contrôleur technique en attente avant coulage." },
    ],
    avisIds: ["av-08"],
    actions: [{ label: "Prévenir Veritas 48 h avant coulage", owner: "Bâtir Océan Indien", due: inDays(1) }],
  },
];

/* ------------- Production documentaire assistée par l'IA (MOEX) ------------ */

export const aiDocDrafts: AiDocDraft[] = [
  {
    id: "gen-01",
    projectId: "p-sunset",
    kind: "cctp",
    title: "CCTP Lot 09 — Cloisons / Doublages (Bât. B)",
    sourceDocIds: ["d-01", "d-02", "d-09"],
    lines: [
      { label: "1. Consistance des travaux", detail: "Cloisons 98/48 et doublages thermo-acoustiques des 22 logements du Bât. B, déduits du plan PLN-B-104 ind. B (1 240 m² relevés automatiquement)." },
      { label: "2. Prescriptions techniques", detail: "Plaques hydrofugées en pièces humides, laine minérale 45 mm, exigence acoustique 53 dB entre logements (NRA DOM).", qty: "1 240 m²" },
      { label: "3. Tenue au feu", detail: "Gaines techniques coupe-feu 1 h, continuité au droit des planchers — cohérent avec l'observation du contrôleur technique sur EXE-ELE-198." },
      { label: "4. Limites de prestation", detail: "Réservations électriques dues par le lot 12 selon EXE-ELE-204 (en attente de visa)." },
      { label: "5. Contrôles et réception", detail: "Contrôle d'aplomb, essai acoustique par sondage, levée des réserves sous 15 jours." },
    ],
    status: "aValider",
    savedHours: 6,
  },
  {
    id: "gen-02",
    projectId: "p-sunset",
    kind: "estimatif",
    title: "Estimatif quantitatif — Lot 09 Cloisons Bât. B",
    sourceDocIds: ["d-02", "d-09"],
    lines: [
      { label: "Cloisons 98/48 BA13", detail: "Métré déduit du plan RDC + R+1 Bât. B", qty: "1 240 m²", amount: 62_000 },
      { label: "Doublage thermo-acoustique", detail: "Murs de façade, laine 45 mm", qty: "820 m²", amount: 31_160 },
      { label: "Plaques hydrofugées", detail: "Salles d'eau et cuisines (22 logements)", qty: "264 m²", amount: 15_840 },
      { label: "Habillage gaines techniques CF 1 h", detail: "Selon plan fluides EXE-FLU-118", qty: "96 u", amount: 22_080 },
      { label: "Aléas et sujétions", detail: "5 % — cohérent avec la ligne « aléas » du budget projet", amount: 6_554 },
    ],
    status: "aValider",
    savedHours: 4,
  },
  {
    id: "gen-03",
    projectId: "p-sunset",
    kind: "contrat",
    title: "Contrat de sous-traitance — Lot 09 Cloisons",
    sourceDocIds: ["d-05", "d-03"],
    lines: [
      { label: "Clauses reprises du marché type", detail: "Délai d'exécution, pénalités 1/1000 par jour, retenue de garantie 5 %, assurance décennale exigée." },
      { label: "Pièces contractuelles", detail: "CCTP Lot 09 généré, estimatif, planning TCE rev. 8, plans visés PLN-B-104 ind. B." },
      { label: "Points à compléter", detail: "Montant du marché, coordonnées de l'entreprise retenue, date d'ordre de service." },
    ],
    status: "aValider",
    savedHours: 3,
  },
  {
    id: "gen-04",
    projectId: "p-sunset",
    kind: "ordreService",
    title: "Ordre de service n°12 — reprise hall Bât. A",
    sourceDocIds: ["d-01"],
    lines: [
      { label: "Objet", detail: "Mise en œuvre de l'esquisse modificative du hall d'entrée (EXE-ARC-007, esquisse 2)." },
      { label: "Incidence financière", detail: "+ 18 400 € HT estimés — validation du maître d'ouvrage requise avant notification.", amount: 18_400 },
      { label: "Incidence délai", detail: "Sans incidence sur le chemin critique (hall hors chemin critique jusqu'à J+45)." },
    ],
    status: "aValider",
    savedHours: 1,
  },
];

/* ---------------- Reprise d'un chantier déjà démarré (onboarding) ---------- */

export const repriseFiles: RepriseFile[] = [
  { name: "Plans DCE + EXE (dossier zippé)", categoryKey: "plan", pages: 214, extractedKey: "plans" },
  { name: "Comptes rendus de chantier n°1 à n°22", categoryKey: "compteRendu", pages: 176, extractedKey: "comptesRendus" },
  { name: "Marchés de travaux et avenants (8 lots)", categoryKey: "contrat", pages: 340, extractedKey: "marches" },
  { name: "Situations mensuelles et factures", categoryKey: "administratif", pages: 128, extractedKey: "situations" },
  { name: "Planning TCE (MS Project export PDF)", categoryKey: "plan", pages: 6, extractedKey: "planning" },
];

export const repriseSteps: RepriseStep[] = [
  { key: "depot", status: "fait" },
  { key: "lecture", status: "fait" },
  { key: "structuration", status: "fait" },
  { key: "avancement", status: "enCours" },
  { key: "controle", status: "attente" },
];

export const repriseResult: RepriseResult = {
  progress: 54,
  invoicedPct: 49,
  monthsLeft: 9,
  lots: [
    { lotKey: "terrassement", progress: 100, invoiced: 100, marketAmount: 410_000 },
    { lotKey: "grosOeuvre", progress: 78, invoiced: 72, marketAmount: 2_240_000 },
    { lotKey: "charpente", progress: 45, invoiced: 40, marketAmount: 520_000 },
    { lotKey: "menuiseries", progress: 20, invoiced: 15, marketAmount: 610_000 },
    { lotKey: "electricite", progress: 32, invoiced: 28, marketAmount: 480_000 },
    { lotKey: "plomberie", progress: 30, invoiced: 25, marketAmount: 445_000 },
  ],
  remaining: [
    "Second œuvre des bâtiments C et D (cloisons, doublages, faux plafonds)",
    "Lots techniques : électricité CFO/CFA et plomberie à partir du R+1",
    "Menuiseries extérieures (2 tranches restantes) et étanchéité toiture",
    "VRD, espaces extérieurs et levée des réserves OPR",
  ],
  gaps: [
    "3 avenants cités dans les comptes rendus mais absents du dossier fourni",
    "Aucun PV de réception de supports pour l'étanchéité du bâtiment B",
    "Planning TCE non mis à jour depuis 2 mois : replanification proposée",
  ],
};
