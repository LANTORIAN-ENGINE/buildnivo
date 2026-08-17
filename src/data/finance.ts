/**
 * BuildNivo Finance — accès « Contrôle financier ».
 *
 * Source : brief produit du 16/08/2026. Un accès unique, en lecture seule,
 * destiné aux intervenants qui financent, garantissent, assurent ou contrôlent
 * une opération immobilière : garant d'achèvement, banque, assureur, courtier,
 * investisseur, escrow team, gestionnaire de compte séquestre, institutionnel.
 *
 * Règle structurante du brief (§9) : aucune donnée ne circule seule. Chaque
 * chiffre porte sa date de mise à jour, son origine, son mode de calcul, son
 * statut de validation et ses pièces justificatives. Une valeur `null` est une
 * donnée non renseignée — jamais un zéro.
 */

import type {
  AccessLogEntry,
  FinanceMilestone,
  FinanceReminder,
  FinanceReport,
  FinancialAccess,
  MaterialRisk,
  OperationSnapshot,
  TracedFigure,
} from "@/types";
import { daysAgo, inDays } from "./core";

/* -------------------------------------------------------------------------- */
/* Fabrique de données tracées                                                 */
/* -------------------------------------------------------------------------- */

const fig = (
  key: string,
  value: number | null,
  unit: TracedFigure["unit"],
  days: number,
  originKey: string,
  methodKey: string,
  status: TracedFigure["status"] = "valide",
  docIds?: string[]
): TracedFigure => ({
  key,
  value,
  unit,
  updatedAt: daysAgo(days),
  originKey,
  methodKey,
  status,
  docIds,
});

/* -------------------------------------------------------------------------- */
/* Résidence SUNSET — opération suivie par le garant et la banque              */
/* -------------------------------------------------------------------------- */

const sunset: OperationSnapshot = {
  projectId: "p-sunset",
  identity: {
    projectId: "p-sunset",
    promoter: "Foncière Bourbon Promotion",
    spv: "SCCV Sunset Bourbon",
    address: "112 rue Juliette Dodu, 97400 Saint-Denis — La Réunion",
    programKey: "logementCollectif",
    operationAmount: 11_850_000,
    worksAmount: 7_400_000,
    startDate: daysAgo(150),
    contractualDelivery: inDays(58),
    forecastDelivery: inDays(70),
    updatedAt: daysAgo(1),
  },

  progress: [
    fig("plannedPct", 75, "pct", 1, "planning", "planningTce"),
    fig("actualPct", 68, "pct", 0, "terrain", "tachesValidees", "valide", ["d-08"]),
    fig("driftPts", -7, "pct", 0, "calcul", "ecartAvancement"),
    fig("delayDays", 12, "days", 1, "planning", "cheminCritique", "valide", ["d-09"]),
  ],

  /* Les onze lignes « Situation financière » du brief, dans l'ordre. */
  financial: [
    fig("budgetInitial", 7_400_000, "euro", 150, "bilanPromoteur", "budgetVote", "valide", ["d-09"]),
    fig("budgetRevise", 7_612_000, "euro", 12, "bilanPromoteur", "budgetPlusAvenants", "valide"),
    fig("marchesSignes", 7_268_000, "euro", 18, "marches", "sommeMarches", "valide", ["d-05", "d-10"]),
    fig("engage", 5_550_000, "euro", 0, "commandes", "sommeEngagements", "valide"),
    fig("facture", 5_118_000, "euro", 2, "situations", "sommeSituations", "valide"),
    fig("valide", 4_902_000, "euro", 5, "moe", "situationsVisees", "aValider", ["d-08"]),
    fig("paye", 4_640_000, "euro", 3, "comptabilite", "reglementsEmis", "valide"),
    fig("resteAEngager", 2_062_000, "euro", 0, "calcul", "reviseMoinsEngage"),
    fig("cpt", 7_694_000, "euro", 1, "calcul", "cptFormule"),
    fig("avenants", 212_000, "euro", 12, "marches", "avenantsSignes", "valide", ["d-08"]),
    fig("provisionAleas", 118_000, "euro", 1, "bilanPromoteur", "aleasRestants"),
    fig("depassement", 82_000, "euro", 1, "calcul", "cptMoinsRevise"),
  ],

  /* Financement et commercialisation — visibles seulement si le promoteur
     a autorisé le partage de ces blocs pour l'organisme concerné (§8). */
  funding: [
    fig("financementObtenu", 8_900_000, "euro", 96, "banque", "offrePret", "valide"),
    fig("financementConsomme", 5_240_000, "euro", 7, "banque", "tirages", "valide"),
    fig("apportPromoteur", 1_780_000, "euro", 96, "bilanPromoteur", "fondsPropres", "valide"),
    fig("encaissementsAcquereurs", 4_356_000, "euro", 34, "notaire", "appelsFonds", "declaratif"),
    fig("sequestreDisponible", 1_214_000, "euro", 6, "sequestre", "soldeCompte", "valide"),
    fig("sequestreDecaisse", 3_142_000, "euro", 6, "sequestre", "deblocages", "valide"),
    fig("tauxCommercialisation", 79, "pct", 9, "commercialisation", "ventesSurLots", "valide"),
    fig("ventesActees", 31, "count", 9, "notaire", "actesSignes", "valide"),
    fig("reservations", 7, "count", 9, "commercialisation", "contratsReservation", "valide"),
    fig("besoinTresorerie", 1_480_000, "euro", 4, "calcul", "pointeDecaissement"),
  ],

  cashCurve: [
    { month: "2026-08", need: 820_000, available: 1_214_000 },
    { month: "2026-09", need: 1_105_000, available: 1_190_000 },
    { month: "2026-10", need: 1_480_000, available: 1_214_000 },
    { month: "2026-11", need: 960_000, available: 1_320_000 },
    { month: "2026-12", need: 640_000, available: 1_410_000 },
  ],

  progressCurve: [
    { month: "2026-03", planned: 8, actual: 7 },
    { month: "2026-04", planned: 22, actual: 19 },
    { month: "2026-05", planned: 38, actual: 33 },
    { month: "2026-06", planned: 55, actual: 49 },
    { month: "2026-07", planned: 75, actual: 68 },
  ],
};

/* -------------------------------------------------------------------------- */
/* ZAC Cœur de Ville — opération suivie par l'escrow team et l'investisseur    */
/* Volontairement moins complète : le système signale les données manquantes.  */
/* -------------------------------------------------------------------------- */

const coeur: OperationSnapshot = {
  projectId: "p-coeur",
  identity: {
    projectId: "p-coeur",
    promoter: "Foncière Bourbon Promotion",
    spv: "SCCV Cœur de Ville Îlot 3",
    address: "Îlot 3, ZAC Cœur de Ville, 97410 Saint-Pierre — La Réunion",
    programKey: "mixte",
    operationAmount: 7_640_000,
    worksAmount: 4_800_000,
    startDate: daysAgo(90),
    contractualDelivery: inDays(210),
    forecastDelivery: inDays(210),
    updatedAt: daysAgo(8),
  },

  progress: [
    fig("plannedPct", 40, "pct", 8, "planning", "planningTce"),
    fig("actualPct", 41, "pct", 8, "terrain", "tachesValidees"),
    fig("driftPts", 1, "pct", 8, "calcul", "ecartAvancement"),
    fig("delayDays", 0, "days", 8, "planning", "cheminCritique"),
  ],

  financial: [
    fig("budgetInitial", 4_800_000, "euro", 90, "bilanPromoteur", "budgetVote"),
    fig("budgetRevise", 4_800_000, "euro", 90, "bilanPromoteur", "budgetPlusAvenants"),
    fig("marchesSignes", 4_512_000, "euro", 40, "marches", "sommeMarches"),
    fig("engage", 1_990_000, "euro", 8, "commandes", "sommeEngagements"),
    fig("facture", 1_742_000, "euro", 8, "situations", "sommeSituations"),
    fig("valide", 1_610_000, "euro", 8, "moe", "situationsVisees"),
    fig("paye", 1_508_000, "euro", 8, "comptabilite", "reglementsEmis"),
    fig("resteAEngager", 2_810_000, "euro", 8, "calcul", "reviseMoinsEngage"),
    fig("cpt", 4_836_000, "euro", 8, "calcul", "cptFormule"),
    fig("avenants", 0, "euro", 90, "marches", "avenantsSignes"),
    /* Non renseignée : le bilan promoteur n'a pas encore été rattaché. */
    fig("provisionAleas", null, "euro", 90, "bilanPromoteur", "aleasRestants", "declaratif"),
    fig("depassement", 36_000, "euro", 8, "calcul", "cptMoinsRevise"),
  ],

  funding: [
    fig("financementObtenu", 5_600_000, "euro", 70, "banque", "offrePret"),
    fig("financementConsomme", 1_820_000, "euro", 12, "banque", "tirages"),
    fig("apportPromoteur", 1_120_000, "euro", 70, "bilanPromoteur", "fondsPropres"),
    fig("encaissementsAcquereurs", 1_395_000, "euro", 21, "notaire", "appelsFonds", "declaratif"),
    fig("sequestreDisponible", 742_000, "euro", 5, "sequestre", "soldeCompte"),
    fig("sequestreDecaisse", 653_000, "euro", 5, "sequestre", "deblocages"),
    fig("tauxCommercialisation", 55, "pct", 21, "commercialisation", "ventesSurLots"),
    fig("ventesActees", 9, "count", 21, "notaire", "actesSignes"),
    fig("reservations", 3, "count", 21, "commercialisation", "contratsReservation"),
    fig("besoinTresorerie", 610_000, "euro", 12, "calcul", "pointeDecaissement"),
  ],

  cashCurve: [
    { month: "2026-08", need: 380_000, available: 742_000 },
    { month: "2026-09", need: 455_000, available: 700_000 },
    { month: "2026-10", need: 610_000, available: 688_000 },
    { month: "2026-11", need: 520_000, available: 715_000 },
    { month: "2026-12", need: 470_000, available: 760_000 },
  ],

  progressCurve: [
    { month: "2026-05", planned: 18, actual: 17 },
    { month: "2026-06", planned: 29, actual: 30 },
    { month: "2026-07", planned: 40, actual: 41 },
  ],
};

export const operationSnapshots: OperationSnapshot[] = [sunset, coeur];

export const snapshotFor = (projectId: string) =>
  operationSnapshots.find((s) => s.projectId === projectId);

/* -------------------------------------------------------------------------- */
/* Jalons — atteints, à venir, en retard                                       */
/* -------------------------------------------------------------------------- */

export const financeMilestones: FinanceMilestone[] = [
  { id: "ms-01", projectId: "p-sunset", label: "Terrassement et fondations Bât. A", planned: daysAgo(126), actual: daysAgo(124), state: "atteint", driftDays: 2 },
  { id: "ms-02", projectId: "p-sunset", label: "Gros œuvre Bât. A hors d'eau", planned: daysAgo(54), actual: daysAgo(46), state: "atteint", driftDays: 8 },
  { id: "ms-03", projectId: "p-sunset", label: "Dalle haute R+2 Bât. A coulée", planned: daysAgo(2), actual: daysAgo(0), state: "atteint", driftDays: 2 },
  { id: "ms-04", projectId: "p-sunset", label: "Bât. A hors d'air — pose des menuiseries", planned: daysAgo(6), state: "retard", driftDays: 12 },
  { id: "ms-05", projectId: "p-sunset", label: "Cloisons et second œuvre R+2", planned: inDays(9), state: "aVenir", driftDays: 4 },
  { id: "ms-06", projectId: "p-sunset", label: "Gros œuvre Bât. B hors d'eau", planned: inDays(34), state: "aVenir", driftDays: 0 },
  { id: "ms-07", projectId: "p-sunset", label: "Réception et livraison des 48 logements", planned: inDays(58), state: "aVenir", driftDays: 12 },

  { id: "ms-11", projectId: "p-coeur", label: "Parking sous-sol hors d'eau", planned: daysAgo(20), actual: daysAgo(22), state: "atteint", driftDays: -2 },
  { id: "ms-12", projectId: "p-coeur", label: "Plot A — élévation R+2", planned: inDays(26), state: "aVenir", driftDays: 0 },
  { id: "ms-13", projectId: "p-coeur", label: "Livraison logements et commerces", planned: inDays(210), state: "aVenir", driftDays: 0 },
];

/* -------------------------------------------------------------------------- */
/* Risques significatifs — uniquement à incidence matérielle (§3)              */
/* Les incidents mineurs et les échanges internes n'apparaissent jamais.       */
/* -------------------------------------------------------------------------- */

export const materialRisks: MaterialRisk[] = [
  {
    id: "mr-01",
    projectId: "p-sunset",
    category: "delai",
    level: "rouge",
    title: "Mise hors d'air du Bât. A décalée de 12 jours",
    summary:
      "La commande de menuiseries extérieures CMD-2026-114 (26 châssis alu) accuse 6 jours de retard fournisseur, et l'indisponibilité de la grue n°2 a reporté les levages du R+3.",
    detectedAt: daysAgo(6),
    impact: "Livraison prévisionnelle repoussée de 12 jours par rapport à la date contractuelle.",
    measures: [
      "Mise en demeure du fournisseur envoyée, date ferme exigée sous 24 h",
      "Pose organisée par cage d'escalier pour libérer le second œuvre du R+1",
      "Location d'une grue mobile chiffrée en solution de repli (18 400 €)",
    ],
    status: "enCours",
    updatedAt: daysAgo(1),
  },
  {
    id: "mr-02",
    projectId: "p-sunset",
    category: "budget",
    level: "orange",
    title: "Dépassement du lot plomberie / CVC",
    summary:
      "Engagé à 511 000 € pour un budget de 480 000 €, soit 6,4 % au-dessus du marché signé, à la suite de reprises de réseaux non prévues au CCTP.",
    detectedAt: daysAgo(4),
    impact: "Coût prévisionnel à terminaison porté à 7 694 000 €, soit 82 000 € au-dessus du budget révisé.",
    measures: [
      "Avenant en cours de négociation avec PLOMB'ÉO",
      "Économies recherchées sur le lot peinture (marché non encore notifié)",
    ],
    status: "enCours",
    updatedAt: daysAgo(1),
  },
  {
    id: "mr-03",
    projectId: "p-sunset",
    category: "achevement",
    level: "orange",
    title: "Provision pour aléas consommée à 80 %",
    summary:
      "Il reste 118 000 € de provision sur les 592 000 € initiaux, alors que 32 % des travaux restent à réaliser.",
    detectedAt: daysAgo(12),
    impact: "Marge de manœuvre réduite en cas de nouvel aléa sur le Bât. B.",
    measures: ["Abondement de 150 000 € soumis au comité d'engagement du promoteur"],
    status: "ouvert",
    updatedAt: daysAgo(2),
  },
  {
    id: "mr-04",
    projectId: "p-sunset",
    category: "financement",
    level: "vert",
    title: "Déblocage de la tranche 4 conditionné au constat d'avancement",
    summary:
      "La tranche de 1 200 000 € est conditionnée à un avancement constaté de 70 %. L'avancement mesuré est de 68 %.",
    detectedAt: daysAgo(3),
    impact: "Décalage possible du tirage de 2 à 3 semaines si le constat est prononcé en l'état.",
    measures: [
      "Constat d'huissier programmé après la pose des menuiseries",
      "Attestation d'avancement du maître d'œuvre transmise à la banque",
    ],
    status: "enCours",
    updatedAt: daysAgo(1),
  },
  {
    id: "mr-05",
    projectId: "p-sunset",
    category: "tresorerie",
    level: "orange",
    title: "Pointe de décaissement en octobre",
    summary:
      "Le besoin mensuel atteint 1 480 000 € en octobre, pour 1 214 000 € disponibles sur le compte séquestre à date.",
    detectedAt: daysAgo(4),
    impact: "Tension de trésorerie estimée à 266 000 € sur trois semaines.",
    measures: [
      "Appel de fonds acquéreurs « mise hors d'air » anticipé",
      "Échelonnement négocié avec le lot gros œuvre",
    ],
    status: "enCours",
    updatedAt: daysAgo(1),
  },
  {
    id: "mr-06",
    projectId: "p-sunset",
    category: "assurances",
    level: "orange",
    title: "Assurance décennale du lot peinture arrivant à échéance",
    summary:
      "L'attestation décennale de Kolor Péi expire dans 21 jours. Les travaux de finition démarrent dans 5 semaines.",
    detectedAt: daysAgo(8),
    impact: "Défaut de couverture possible sur le lot peinture, à hauteur de 430 000 €.",
    measures: ["Relance automatique envoyée à l'entreprise", "Accès chantier suspendu à défaut de renouvellement"],
    status: "ouvert",
    updatedAt: daysAgo(1),
  },
  {
    id: "mr-07",
    projectId: "p-sunset",
    category: "autorisations",
    level: "rouge",
    title: "Avis suspensif du contrôleur technique — trémie ascenseur R+2",
    summary:
      "Rapport RAP-VT-2026-118 : protection collective déposée sans remplacement. La reprise des travaux de la zone est conditionnée à la pose de la protection définitive.",
    detectedAt: daysAgo(1),
    impact: "Zone R+2 immobilisée ; 4 jours de retard supplémentaires si la levée dépasse 48 h.",
    measures: [
      "Protection définitive commandée, pose prévue sous 48 h",
      "Contre-visite du contrôleur technique sollicitée",
    ],
    status: "enCours",
    updatedAt: daysAgo(0),
  },
  {
    id: "mr-08",
    projectId: "p-sunset",
    category: "continuite",
    level: "orange",
    title: "Attestation de vigilance URSSAF expirée — lot électricité",
    summary:
      "L'attestation d'ElecRun OI est expirée depuis 10 jours. Le contrat prévoit la suspension de l'accès chantier à défaut de régularisation.",
    detectedAt: daysAgo(10),
    impact: "Risque de solidarité financière du maître d'ouvrage en cas de contrôle, et arrêt du lot électricité.",
    measures: ["Régularisation demandée sous 48 h", "Entreprise de remplacement pré-identifiée"],
    status: "ouvert",
    updatedAt: daysAgo(2),
  },

  {
    id: "mr-11",
    projectId: "p-coeur",
    category: "financement",
    level: "vert",
    title: "Commercialisation conforme au plan de financement",
    summary: "12 lots vendus ou réservés sur 22, au-dessus du seuil de 45 % exigé par la banque.",
    detectedAt: daysAgo(21),
    impact: "Aucune incidence sur le calendrier de tirage.",
    measures: [],
    status: "maitrise",
    updatedAt: daysAgo(8),
  },
  {
    id: "mr-12",
    projectId: "p-coeur",
    category: "budget",
    level: "orange",
    title: "Écart de 36 000 € sur le coût à terminaison",
    summary: "Révision des prix du lot VRD après consultation, sans avenant signé à ce jour.",
    detectedAt: daysAgo(14),
    impact: "0,8 % du budget travaux, absorbable par la provision pour aléas.",
    measures: ["Avenant en cours de rédaction"],
    status: "ouvert",
    updatedAt: daysAgo(8),
  },
];

/* -------------------------------------------------------------------------- */
/* Rapports périodiques — préparés par l'IA, validés puis figés par le          */
/* promoteur. Une correction crée une nouvelle version, jamais un écrasement.  */
/* -------------------------------------------------------------------------- */

/** Les treize rubriques standardisées, dans l'ordre imposé par le brief (§4). */
export const reportSectionKeys = [
  "resume",
  "avancement",
  "planning",
  "financiere",
  "coherence",
  "cpt",
  "financement",
  "commercialisation",
  "risques",
  "actions",
  "photos",
  "documents",
  "prochaine",
] as const;

export const financeReports: FinanceReport[] = [
  {
    id: "RPT-2026-08",
    projectId: "p-sunset",
    periodKey: "aout",
    periodEnd: daysAgo(0),
    status: "aValider",
    version: 1,
    generatedAt: daysAgo(0),
    nextUpdate: inDays(19),
    photoIds: ["ph-01", "ph-05", "ph-06"],
    docIds: ["d-08", "d-09", "d-11", "d-17"],
    gaps: [
      "Encaissements acquéreurs non actualisés depuis 34 jours — donnée déclarative.",
      "Situation n°8 (214 500 € HT) en attente de validation du maître d'œuvre depuis 5 jours.",
    ],
    history: [{ version: 1, at: daysAgo(0), author: "Copilote BuildNivo", note: "Préparation automatique à partir des données de l'opération." }],
    sections: [
      { key: "resume", text: "L'opération est avancée à 68 % pour 75 % planifiés. Le retard prévisionnel de livraison reste stable à 12 jours, entièrement porté par la mise hors d'air du Bât. A. La situation financière est maîtrisée, avec un coût à terminaison supérieur de 82 000 € au budget révisé (+1,1 %). Deux risques rouges sont ouverts : le décalage de la mise hors d'air et l'avis suspensif du contrôleur technique sur la trémie ascenseur R+2." },
      { key: "avancement", text: "Avancement physique constaté : 68 % (mesuré sur tâches validées et zones réceptionnées). Progression du mois : +7 points. Dalle haute R+2 Bât. A coulée et réceptionnée, cloisons R+2 terminées, relevés d'étanchéité de la toiture terrasse posés. Bât. B : élévation du RDC à 35 %." },
      { key: "planning", text: "Trois jalons atteints depuis le dernier rapport, avec un écart moyen de 4 jours. Le jalon « Bât. A hors d'air » est en retard de 12 jours. Les jalons suivants (second œuvre R+2, gros œuvre Bât. B) restent tenables sous réserve de la livraison des menuiseries." },
      { key: "financiere", text: "Budget révisé 7 612 000 € (dont 212 000 € d'avenants signés). Marchés signés 7 268 000 €, engagé 5 550 000 €, facturé 5 118 000 €, validé 4 902 000 €, payé 4 640 000 €. Reste à engager 2 062 000 €. Provision pour aléas restante 118 000 €." },
      { key: "coherence", text: "Dépenses engagées à 72,9 % pour un avancement physique de 68 % : écart de 4,9 points, expliqué par les approvisionnements de menuiseries déjà commandés mais non posés. Aucune facturation en avance de phase n'a été détectée." },
      { key: "cpt", text: "Coût prévisionnel à terminaison estimé à 7 694 000 €, soit 82 000 € au-dessus du budget révisé. L'écart provient du lot plomberie / CVC (+31 000 €) et des mesures de rattrapage planning (+51 000 € provisionnés)." },
      { key: "financement", text: "Financement obtenu 8 900 000 €, consommé 5 240 000 € (58,9 %). Apport promoteur 1 780 000 €, intégralement libéré. Le tirage de la tranche 4 (1 200 000 €) est conditionné à un avancement constaté de 70 % : le constat sera sollicité après la pose des menuiseries." },
      { key: "commercialisation", text: "38 lots vendus ou réservés sur 48, soit 79 % de commercialisation : 31 actes signés et 7 contrats de réservation. Encaissements acquéreurs cumulés 4 356 000 € (donnée notariale du mois précédent). Compte séquestre : 1 214 000 € disponibles, 3 142 000 € décaissés." },
      { key: "risques", text: "Huit risques suivis. Deux rouges : mise hors d'air décalée de 12 jours, avis suspensif du contrôleur technique sur la trémie R+2. Quatre orange : dépassement du lot plomberie, provision pour aléas consommée à 80 %, pointe de trésorerie d'octobre, décennale du lot peinture. Deux verts : conditions de tirage bancaire, régularisation URSSAF en cours." },
      { key: "actions", text: "Mise en demeure du fournisseur de menuiseries envoyée. Protection définitive de la trémie commandée, pose sous 48 h. Avenant plomberie en négociation. Abondement de la provision pour aléas soumis au comité d'engagement. Appel de fonds « mise hors d'air » anticipé pour couvrir la pointe d'octobre." },
      { key: "photos", text: "Trois photographies d'avancement sélectionnées et horodatées : cloisons R+2 terminées, réception du béton de la dalle haute, relevés d'étanchéité posés." },
      { key: "documents", text: "Pièces jointes au rapport : compte rendu de chantier n°34, planning TCE rev. 8, PV de réception des supports d'étanchéité, rapport de visite du contrôleur technique RAP-VT-2026-118." },
      { key: "prochaine", text: "Prochaine publication le 5 du mois prochain. Un rappel automatique sera adressé au promoteur 5 jours avant l'échéance." },
    ],
  },
  {
    id: "RPT-2026-07",
    projectId: "p-sunset",
    periodKey: "juillet",
    periodEnd: daysAgo(31),
    status: "publie",
    version: 1,
    generatedAt: daysAgo(29),
    publishedAt: daysAgo(28),
    validatedBy: "Hélène Vitry — Foncière Bourbon Promotion",
    nextUpdate: daysAgo(0),
    photoIds: ["ph-06", "ph-01"],
    docIds: ["d-09", "d-11"],
    gaps: [],
    history: [{ version: 1, at: daysAgo(28), author: "Hélène Vitry", note: "Publication initiale." }],
    sections: [
      { key: "resume", text: "Avancement de 61 % pour 66 % planifiés. Retard prévisionnel porté de 8 à 12 jours après la panne de la grue n°2. Situation financière stable." },
      { key: "avancement", text: "Avancement constaté 61 %. Élévation du R+3 Bât. A engagée, étanchéité de la toiture terrasse démarrée." },
      { key: "planning", text: "Jalon « Gros œuvre Bât. A hors d'eau » atteint avec 8 jours d'avance sur le replanning." },
      { key: "financiere", text: "Budget révisé 7 612 000 €. Engagé 5 108 000 €, facturé 4 690 000 €, payé 4 302 000 €." },
      { key: "coherence", text: "Dépenses engagées à 67,1 % pour un avancement de 61 % : écart de 6,1 points lié aux approvisionnements." },
      { key: "cpt", text: "Coût prévisionnel à terminaison 7 663 000 €, soit 51 000 € au-dessus du budget révisé." },
      { key: "financement", text: "Financement consommé 4 780 000 €. Tranche 3 débloquée le mois dernier après constat d'avancement." },
      { key: "commercialisation", text: "36 lots vendus ou réservés sur 48, soit 75 % de commercialisation." },
      { key: "risques", text: "Sept risques suivis, un rouge (indisponibilité de la grue n°2), trois orange, trois verts." },
      { key: "actions", text: "Réparation de la grue n°2 engagée, réorganisation des levages sur la grue n°1." },
      { key: "photos", text: "Une photographie d'avancement sélectionnée : relevés d'étanchéité de la toiture terrasse." },
      { key: "documents", text: "Planning TCE rev. 8 et PV de réception des supports d'étanchéité." },
      { key: "prochaine", text: "Prochaine publication le 5 du mois suivant." },
    ],
  },
  {
    id: "RPT-2026-06",
    projectId: "p-sunset",
    periodKey: "juin",
    periodEnd: daysAgo(61),
    status: "publie",
    version: 2,
    generatedAt: daysAgo(60),
    publishedAt: daysAgo(52),
    validatedBy: "Hélène Vitry — Foncière Bourbon Promotion",
    nextUpdate: daysAgo(28),
    photoIds: [],
    docIds: ["d-09"],
    gaps: [],
    history: [
      { version: 1, at: daysAgo(59), author: "Hélène Vitry", note: "Publication initiale." },
      { version: 2, at: daysAgo(52), author: "Hélène Vitry", note: "Correction du montant facturé du lot 04 (566 000 € au lieu de 656 000 €, erreur de saisie de situation). La version 1 reste consultable et horodatée." },
    ],
    sections: [
      { key: "resume", text: "Avancement de 49 % pour 55 % planifiés. Retard prévisionnel de 8 jours." },
      { key: "avancement", text: "Avancement constaté 49 %. Élévation du R+2 Bât. A achevée." },
      { key: "planning", text: "Deux jalons atteints, un jalon décalé de 6 jours." },
      { key: "financiere", text: "Budget révisé 7 612 000 €. Engagé 4 420 000 €, facturé 3 980 000 € (montant corrigé en version 2), payé 3 610 000 €." },
      { key: "coherence", text: "Dépenses engagées à 58,1 % pour un avancement de 49 %." },
      { key: "cpt", text: "Coût prévisionnel à terminaison 7 640 000 €." },
      { key: "financement", text: "Financement consommé 4 120 000 €. Tranche 3 sollicitée." },
      { key: "commercialisation", text: "33 lots vendus ou réservés sur 48, soit 69 % de commercialisation." },
      { key: "risques", text: "Six risques suivis, aucun rouge, trois orange." },
      { key: "actions", text: "Relance des bureaux d'études sur les plans d'exécution des lots techniques." },
      { key: "photos", text: "Aucune photographie sélectionnée ce mois." },
      { key: "documents", text: "Planning TCE rev. 7." },
      { key: "prochaine", text: "Prochaine publication le 5 du mois suivant." },
    ],
  },
  {
    id: "RPT-2026-05",
    projectId: "p-sunset",
    periodKey: "mai",
    periodEnd: daysAgo(92),
    status: "publie",
    version: 1,
    generatedAt: daysAgo(91),
    publishedAt: daysAgo(89),
    validatedBy: "Hélène Vitry — Foncière Bourbon Promotion",
    nextUpdate: daysAgo(59),
    photoIds: [],
    docIds: [],
    gaps: [],
    history: [{ version: 1, at: daysAgo(89), author: "Hélène Vitry", note: "Publication initiale." }],
    sections: [
      { key: "resume", text: "Avancement de 33 % pour 38 % planifiés. Opération conforme au plan de financement." },
      { key: "avancement", text: "Avancement constaté 33 %. Élévation du R+1 Bât. A achevée." },
      { key: "planning", text: "Tous les jalons du mois atteints." },
      { key: "financiere", text: "Budget initial 7 400 000 €. Engagé 3 180 000 €, facturé 2 740 000 €, payé 2 490 000 €." },
      { key: "coherence", text: "Dépenses engagées à 43 % pour un avancement de 33 %, écart lié aux acomptes de commande." },
      { key: "cpt", text: "Coût prévisionnel à terminaison 7 428 000 €." },
      { key: "financement", text: "Financement consommé 3 240 000 €." },
      { key: "commercialisation", text: "29 lots vendus ou réservés sur 48, soit 60 % de commercialisation." },
      { key: "risques", text: "Quatre risques suivis, aucun rouge." },
      { key: "actions", text: "Notification des marchés de second œuvre." },
      { key: "photos", text: "Aucune photographie sélectionnée ce mois." },
      { key: "documents", text: "Aucune pièce partagée ce mois." },
      { key: "prochaine", text: "Prochaine publication le 5 du mois suivant." },
    ],
  },

  {
    id: "RPT-CV-2026-08",
    projectId: "p-coeur",
    periodKey: "aout",
    periodEnd: daysAgo(0),
    status: "brouillon",
    version: 1,
    generatedAt: daysAgo(0),
    nextUpdate: inDays(19),
    photoIds: [],
    docIds: [],
    gaps: [
      "Provision pour aléas non renseignée : le bilan promoteur n'est pas rattaché à l'opération.",
      "Avancement non actualisé depuis 8 jours.",
    ],
    history: [{ version: 1, at: daysAgo(0), author: "Copilote BuildNivo", note: "Préparation automatique — données incomplètes signalées." }],
    sections: [
      { key: "resume", text: "Opération conforme au planning : 41 % constatés pour 40 % planifiés, aucun retard prévisionnel." },
      { key: "avancement", text: "Parking sous-sol à 71 %, Plot A logements à 46 %, Plot B commerces à 33 %." },
      { key: "planning", text: "Le jalon « Parking sous-sol hors d'eau » a été atteint avec 2 jours d'avance." },
      { key: "financiere", text: "Budget 4 800 000 €. Engagé 1 990 000 €, facturé 1 742 000 €, payé 1 508 000 €." },
      { key: "coherence", text: "Dépenses engagées à 41,5 % pour un avancement de 41 % : cohérence satisfaisante." },
      { key: "cpt", text: "Coût prévisionnel à terminaison 4 836 000 €, soit 36 000 € au-dessus du budget." },
      { key: "financement", text: "Financement obtenu 5 600 000 €, consommé 1 820 000 €." },
      { key: "commercialisation", text: "12 lots vendus ou réservés sur 22, soit 55 % de commercialisation." },
      { key: "risques", text: "Deux risques suivis : écart de coût à terminaison (orange), commercialisation conforme (vert)." },
      { key: "actions", text: "Rédaction de l'avenant VRD, rattachement du bilan promoteur à l'opération." },
      { key: "photos", text: "Aucune photographie sélectionnée ce mois." },
      { key: "documents", text: "Aucune pièce partagée ce mois." },
      { key: "prochaine", text: "Prochaine publication le 5 du mois prochain." },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Accès ouverts par le promoteur (§8)                                         */
/* -------------------------------------------------------------------------- */

export const financialAccesses: FinancialAccess[] = [
  {
    id: "fa-gfa",
    projectId: "p-sunset",
    orgId: "c-gfa",
    kind: "garant",
    reference: "Garantie financière d'achèvement n° GFA-2026-0148",
    users: [
      { name: "Nadia Ferrand", jobKey: "directriceEngagements", email: "n.ferrand@garantie-oi.re", lastSeen: daysAgo(0) },
      { name: "Olivier Cadet", jobKey: "analysteRisques", email: "o.cadet@garantie-oi.re", lastSeen: daysAgo(3) },
    ],
    startDate: daysAgo(140),
    endDate: inDays(240),
    status: "actif",
    invitedAt: daysAgo(141),
    sharedDocIds: ["d-08", "d-09", "d-11", "d-17"],
    share: { commercialisation: true, tresorerie: true, sequestre: true, photos: true },
    frequency: "mensuelle",
    notify: { publication: true, rappel: true, risque: true },
  },
  {
    id: "fa-banque",
    projectId: "p-sunset",
    orgId: "c-mascareignes",
    kind: "banque",
    reference: "Crédit promoteur n° CP-2026-3312",
    users: [{ name: "Pascal Ellama", jobKey: "chargeAffairesPromotion", email: "p.ellama@bqmascareignes.re", lastSeen: daysAgo(1) }],
    startDate: daysAgo(138),
    endDate: inDays(300),
    status: "actif",
    invitedAt: daysAgo(139),
    sharedDocIds: ["d-08", "d-09", "d-17"],
    share: { commercialisation: true, tresorerie: true, sequestre: true, photos: true },
    frequency: "mensuelle",
    notify: { publication: true, rappel: false, risque: true },
  },
  {
    id: "fa-decatria",
    projectId: "p-sunset",
    orgId: "c-decatria",
    kind: "courtier",
    reference: "Mandat de courtage n° DEC-2026-77",
    users: [{ name: "Yann Vergès", jobKey: "courtierAssocie", email: "y.verges@decatria.re", lastSeen: daysAgo(5) }],
    startDate: daysAgo(60),
    endDate: inDays(120),
    status: "actif",
    invitedAt: daysAgo(61),
    sharedDocIds: ["d-09"],
    /* Le promoteur n'a pas ouvert la trésorerie ni le séquestre au courtier :
       les blocs correspondants sont explicitement marqués « non partagé ». */
    share: { commercialisation: true, tresorerie: false, sequestre: false, photos: true },
    frequency: "trimestrielle",
    notify: { publication: true, rappel: false, risque: false },
  },
  {
    id: "fa-assurance",
    projectId: "p-sunset",
    orgId: "c-assurconstruction",
    kind: "assureur",
    reference: "Police dommages-ouvrage n° DO-2026-5521",
    users: [{ name: "Léonie Grondin", jobKey: "souscripteurConstruction", email: "l.grondin@rac.re", lastSeen: daysAgo(22) }],
    startDate: daysAgo(145),
    endDate: daysAgo(18),
    status: "revoque",
    invitedAt: daysAgo(146),
    revokedAt: daysAgo(18),
    sharedDocIds: [],
    share: { commercialisation: false, tresorerie: false, sequestre: false, photos: false },
    frequency: "mensuelle",
    notify: { publication: false, rappel: false, risque: false },
  },
  {
    id: "fa-escrow",
    projectId: "p-coeur",
    orgId: "c-escrowdmcc",
    kind: "escrow",
    reference: "Escrow agreement n° ESC-2026-DXB-014",
    users: [{ name: "Rania Al Nuaimi", jobKey: "escrowManager", email: "r.alnuaimi@escrowpartners.ae", lastSeen: daysAgo(9) }],
    startDate: daysAgo(80),
    endDate: inDays(365),
    status: "actif",
    invitedAt: daysAgo(81),
    sharedDocIds: [],
    share: { commercialisation: true, tresorerie: true, sequestre: true, photos: false },
    frequency: "mensuelle",
    notify: { publication: true, rappel: true, risque: true },
  },
  {
    id: "fa-sofidom",
    projectId: "p-coeur",
    orgId: "c-sofidom",
    kind: "investisseur",
    reference: "Pacte d'associés n° SOF-2026-09",
    users: [{ name: "Bertrand Sautron", jobKey: "directeurParticipations", email: "b.sautron@sofidom.re" }],
    startDate: inDays(3),
    endDate: inDays(400),
    status: "invite",
    invitedAt: daysAgo(1),
    sharedDocIds: [],
    share: { commercialisation: true, tresorerie: false, sequestre: false, photos: true },
    frequency: "trimestrielle",
    notify: { publication: true, rappel: false, risque: true },
  },
];

export const accessById = (id: string) => financialAccesses.find((a) => a.id === id);

/* -------------------------------------------------------------------------- */
/* Journal des accès — toute consultation est tracée (§9)                      */
/* -------------------------------------------------------------------------- */

export const accessLogs: AccessLogEntry[] = [
  { id: "log-01", accessId: "fa-gfa", at: `${daysAgo(0)} 09:12`, user: "Nadia Ferrand", action: "connexion", ip: "88.174.22.41" },
  { id: "log-02", accessId: "fa-gfa", at: `${daysAgo(0)} 09:13`, user: "Nadia Ferrand", action: "synthese", target: "Résidence SUNSET", ip: "88.174.22.41" },
  { id: "log-03", accessId: "fa-gfa", at: `${daysAgo(0)} 09:21`, user: "Nadia Ferrand", action: "rapport", target: "RPT-2026-07", ip: "88.174.22.41" },
  { id: "log-04", accessId: "fa-gfa", at: `${daysAgo(0)} 09:24`, user: "Nadia Ferrand", action: "document", target: "RAP-VT-2026-118 — Rapport de visite contrôleur technique", ip: "88.174.22.41" },
  { id: "log-05", accessId: "fa-banque", at: `${daysAgo(1)} 16:40`, user: "Pascal Ellama", action: "connexion", ip: "62.34.118.9" },
  { id: "log-06", accessId: "fa-banque", at: `${daysAgo(1)} 16:41`, user: "Pascal Ellama", action: "synthese", target: "Résidence SUNSET", ip: "62.34.118.9" },
  { id: "log-07", accessId: "fa-banque", at: `${daysAgo(1)} 16:52`, user: "Pascal Ellama", action: "export", target: "Synthèse de l'opération (PDF)", ip: "62.34.118.9" },
  { id: "log-08", accessId: "fa-gfa", at: `${daysAgo(3)} 11:05`, user: "Olivier Cadet", action: "connexion", ip: "88.174.22.44" },
  { id: "log-09", accessId: "fa-gfa", at: `${daysAgo(3)} 11:09`, user: "Olivier Cadet", action: "rapport", target: "RPT-2026-06 v2", ip: "88.174.22.44" },
  { id: "log-10", accessId: "fa-decatria", at: `${daysAgo(5)} 14:22`, user: "Yann Vergès", action: "connexion", ip: "91.160.7.203" },
  { id: "log-11", accessId: "fa-decatria", at: `${daysAgo(5)} 14:25`, user: "Yann Vergès", action: "synthese", target: "Résidence SUNSET", ip: "91.160.7.203" },
  { id: "log-12", accessId: "fa-escrow", at: `${daysAgo(9)} 07:48`, user: "Rania Al Nuaimi", action: "rapport", target: "RPT-CV-2026-07", ip: "94.200.11.86" },
  { id: "log-13", accessId: "fa-assurance", at: `${daysAgo(18)} 10:30`, user: "Hélène Vitry", action: "revocation", target: "Réunion Assurances Construction — fin de mission", ip: "88.174.22.10" },
  { id: "log-14", accessId: "fa-assurance", at: `${daysAgo(22)} 08:15`, user: "Léonie Grondin", action: "document", target: "Planning TCE — Résidence SUNSET", ip: "77.202.44.19" },
];

/* -------------------------------------------------------------------------- */
/* Rappels automatiques du cycle de publication (§5)                           */
/* -------------------------------------------------------------------------- */

export const financeReminders: FinanceReminder[] = [
  {
    id: "fr-01",
    projectId: "p-sunset",
    kind: "echeance",
    target: "Hélène Vitry — Foncière Bourbon Promotion",
    subject: "Rapport d'août à publier dans 5 jours",
    body: "Le rapport RPT-2026-08 est préparé et attend votre vérification. La date de publication convenue avec Garantie Océan Indien et la Banque des Mascareignes est le 5 du mois. Sans publication à cette date, les deux organismes recevront une notification de retard.",
    dueAt: inDays(5),
    status: "aValider",
  },
  {
    id: "fr-02",
    projectId: "p-sunset",
    kind: "donneesAnciennes",
    target: "Hélène Vitry — Foncière Bourbon Promotion",
    subject: "Encaissements acquéreurs non actualisés depuis 34 jours",
    body: "La donnée « encaissements acquéreurs » date du mois dernier et reste marquée comme déclarative. Elle sera publiée avec une mention d'ancienneté tant que le relevé notarial n'aura pas été rattaché à l'opération.",
    dueAt: inDays(2),
    status: "aValider",
  },
  {
    id: "fr-03",
    projectId: "p-sunset",
    kind: "validation",
    target: "Cédric Hoareau — Cap Sud Maîtrise d'Œuvre",
    subject: "Situation n°8 en attente de visa depuis 5 jours",
    body: "La situation gros œuvre de 214 500 € HT bloque la ligne « montant validé » du rapport de contrôle financier. Merci de viser ou de retourner vos observations avant la publication.",
    dueAt: inDays(3),
    status: "aValider",
  },
  {
    id: "fr-04",
    projectId: "p-coeur",
    kind: "donneesAnciennes",
    target: "Hélène Vitry — Foncière Bourbon Promotion",
    subject: "Bilan promoteur non rattaché — ZAC Cœur de Ville",
    body: "La provision pour aléas de l'îlot 3 n'est pas renseignée. Elle apparaîtra comme « non communiquée » dans le rapport transmis à Escrow Partners DMCC.",
    dueAt: inDays(6),
    status: "aValider",
  },
  {
    id: "fr-05",
    projectId: "p-sunset",
    kind: "publication",
    target: "Garantie Océan Indien · Banque des Mascareignes",
    subject: "Notification de publication — RPT-2026-07",
    body: "Le rapport de juillet a été publié et figé. Les organismes destinataires ont été notifiés et la version reste consultable dans l'historique.",
    dueAt: daysAgo(28),
    status: "envoyee",
  },
];

/* -------------------------------------------------------------------------- */
/* Grille « accessible / non accessible » (§6 et §7) — vitrine et démo         */
/* -------------------------------------------------------------------------- */

export const financeVisible = [
  "synthese",
  "avancement",
  "planning",
  "indicateurs",
  "cpt",
  "risques",
  "rapports",
  "photos",
  "documents",
  "historique",
] as const;

export const financeHidden = [
  "messagerie",
  "echanges",
  "rh",
  "salaires",
  "pointages",
  "negociations",
  "marges",
  "incidents",
  "docsPrives",
  "photosBrutes",
  "notes",
  "autresProjets",
] as const;

/** Critères d'acceptation du module (§11) — repris tels quels sur la vitrine. */
export const financeCriteria = [
  "invitation",
  "perimetre",
  "cloisonnement",
  "standard",
  "dateMaj",
  "signalement",
  "generation",
  "validation",
  "notification",
  "historique",
  "immuable",
  "revocation",
  "tracabilite",
] as const;

/** Cycle de publication d'un rapport (§4 et §5). */
export const reportCycleSteps = ["collecte", "preparation", "verification", "publication", "archivage"] as const;
