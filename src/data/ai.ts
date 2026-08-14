import type { AiAlert, AiReminder, CopilotAction, CopilotAnswer } from "@/types";
import { daysAgo, inDays } from "./core";

export const aiAlerts: AiAlert[] = [
  {
    id: "al-01",
    projectId: "p-sunset",
    kind: "planning",
    severity: "critique",
    title: "Grue n°2 indisponible",
    detail: "En panne depuis 2 jours. Le coulage de la dalle R+2 (t-01) consomme la capacité de la grue n°1 : risque sur les approvisionnements Bât. B.",
    suggestedActionKey: "planning",
    date: inDays(0),
    handled: false,
  },
  {
    id: "al-02",
    projectId: "p-sunset",
    kind: "effectif",
    severity: "elevee",
    title: "3 plaquistes présents sur 6 prévus",
    detail: "Au rythme actuel, les cloisons du Bât. B pourraient prendre 3 jours de retard. PLOMB'ÉO est par ailleurs totalement absent aujourd'hui.",
    suggestedActionKey: "effectif",
    date: inDays(0),
    handled: false,
  },
  {
    id: "al-03",
    projectId: "p-sunset",
    kind: "livraison",
    severity: "elevee",
    title: "Menuiseries R+1 : livraison en retard",
    detail: "CMD-2026-114 attendue il y a 6 jours. La tâche « Pose menuiseries R+1 » (t-06) démarre dans 4 jours : chemin critique menacé.",
    suggestedActionKey: "livraison",
    date: daysAgo(1),
    handled: false,
  },
  {
    id: "al-04",
    projectId: "p-sunset",
    kind: "document",
    severity: "elevee",
    title: "Attestation URSSAF ElecRun OI expirée",
    detail: "Document obligatoire expiré depuis 10 jours. Risque de solidarité financière en cas de contrôle.",
    suggestedActionKey: "document",
    date: daysAgo(2),
    handled: false,
  },
  {
    id: "al-05",
    projectId: "p-sunset",
    kind: "budget",
    severity: "info",
    title: "Validation situation n°8 en attente",
    detail: "Situation gros œuvre de 214 500 € HT en attente de validation MOE depuis 5 jours.",
    suggestedActionKey: "budget",
    date: daysAgo(1),
    handled: false,
  },
  {
    id: "al-06",
    projectId: "p-sunset",
    kind: "incoherence",
    severity: "elevee",
    title: "Facture supérieure à la commande",
    detail: "Lot plomberie : engagé 511 000 € pour un budget de 480 000 €. Facture PLOMB'ÉO n°F-2218 dépasse la commande de 6,4 %.",
    suggestedActionKey: "incoherence",
    date: inDays(0),
    handled: false,
  },
  {
    id: "al-07",
    projectId: "p-sunset",
    kind: "visa",
    severity: "critique",
    title: "Visa en attente : plans EXE courants forts",
    detail:
      "EXE-ELE-204 (Ohm Ingénierie) déposé il y a 2 jours, échéance de visa demain. Sans avis favorable, la fermeture des cloisons R+2 ne peut pas démarrer : +4 jours estimés sur le chemin critique.",
    suggestedActionKey: "visa",
    date: inDays(0),
    handled: false,
  },
  {
    id: "al-08",
    projectId: "p-sunset",
    kind: "visa",
    severity: "elevee",
    title: "Avis défavorable non levé — charpente Bât. B",
    detail:
      "EXE-CHA-042 refusé il y a 3 jours (surcharge cyclonique absente de la descente de charges). Redépôt attendu sous 5 jours ; la commande de charpente reste bloquée.",
    suggestedActionKey: "visa",
    date: daysAgo(1),
    handled: false,
  },
  {
    id: "al-09",
    projectId: "p-sunset",
    kind: "securite",
    severity: "critique",
    title: "Avis suspensif du contrôleur technique",
    detail:
      "Trémie ascenseur R+2 : protection collective déposée sans remplacement. Reprise des travaux de la zone conditionnée à la pose de la protection définitive (RAP-VT-2026-118).",
    suggestedActionKey: "securite",
    date: daysAgo(1),
    handled: false,
  },
];

export const aiReminders: AiReminder[] = [
  {
    id: "rem-01",
    projectId: "p-sunset",
    kind: "entreprise",
    target: "PLOMB'ÉO — Bruno Dijoux",
    subject: "Absence non prévue ce jour — Résidence SUNSET",
    body: "Bonjour, aucune présence de vos équipes n'a été enregistrée aujourd'hui sur la Résidence SUNSET alors que les raccordements EU/EV du R+1 (échéance demain) sont sur le chemin critique. Merci de confirmer votre présence demain 7h ou de proposer un plan de rattrapage.",
    status: "aValider",
  },
  {
    id: "rem-02",
    projectId: "p-sunset",
    kind: "document",
    target: "ElecRun OI — David Fontaine",
    subject: "Attestation URSSAF expirée — régularisation sous 48 h",
    body: "Bonjour, votre attestation de vigilance URSSAF est expirée depuis 10 jours. Sans document à jour sous 48 h, nous serons contraints de suspendre l'accès chantier conformément au contrat de sous-traitance.",
    status: "aValider",
  },
  {
    id: "rem-03",
    projectId: "p-sunset",
    kind: "fournisseur",
    target: "Charpentes Payet — Éric Payet",
    subject: "Relance livraison CMD-2026-114 — menuiseries R+1",
    body: "Bonjour, la commande CMD-2026-114 (26 châssis alu) est attendue depuis 6 jours. La pose démarre dans 4 jours. Merci de communiquer une date ferme de livraison sous 24 h.",
    status: "aValider",
  },
  {
    id: "rem-04",
    projectId: "p-sunset",
    kind: "livraison",
    target: "Somabat OI — Frédéric Lebon",
    subject: "Confirmation livraison rails cloisons (CMD-2026-118)",
    body: "Bonjour, merci de confirmer la livraison des rails et montants prévue dans 3 jours ; l'équipe plaquistes du Bât. B est à l'arrêt sur cette fourniture.",
    status: "envoyee",
  },
  {
    id: "rem-06",
    projectId: "p-sunset",
    kind: "visa",
    target: "Cap Sud MOE — Cédric Hoareau",
    subject: "Visa attendu — EXE-ELE-204 (courants forts R+2/R+3)",
    body: "Bonjour, les plans d'exécution courants forts sont déposés depuis 2 jours et l'échéance de visa est fixée à demain. La fermeture des cloisons R+2 est conditionnée à votre avis : merci de viser ou de nous transmettre vos observations.",
    status: "aValider",
  },
  {
    id: "rem-07",
    projectId: "p-sunset",
    kind: "visa",
    target: "Trame Bois Ingénierie — Olivier Bénard",
    subject: "Redépôt attendu — EXE-CHA-042 indice B",
    body: "Bonjour, l'avis défavorable du 3 dernier jour porte sur l'absence de surcharge cyclonique dans la descente de charges et sur les fixations non cotées des files 4 à 7. Merci de redéposer l'indice B sous 5 jours : la commande de charpente est bloquée.",
    status: "aValider",
  },
  {
    id: "rem-08",
    projectId: "p-sunset",
    kind: "document",
    target: "Bâtir Océan Indien — Marc Dorseuil",
    subject: "Pièces demandées par Veritas — essais béton dalle R+2",
    body: "Bonjour, le contrôleur technique demande les PV d'essais à 7 jours des éprouvettes de la dalle haute R+2 (BL-88412) et le PV de réception des supports d'étanchéité. Les documents peuvent être déposés directement dans l'espace partagé du chantier.",
    status: "aValider",
  },
  {
    id: "rem-05",
    projectId: "p-horizon",
    kind: "tache",
    target: "Kolor Péi — Laurent Robert",
    subject: "Réserve peinture chambre 2 — Villa Horizon",
    body: "Bonjour, la réserve « auréole plafond chambre 2 » doit être levée avant la livraison dans 12 jours. Merci de planifier l'intervention cette semaine.",
    status: "aValider",
  },
];

/** Dictée simulée du chef de chantier (CDC §6.1) et sa décomposition en actions. */
export const dictationText =
  "Le plombier n'est pas venu. Les cloisons du deuxième étage sont terminées. Il manque les rails pour commencer le bâtiment B.";

export const dictationActions: CopilotAction[] = [
  { kind: "anomalie", label: "Absence PLOMB'ÉO enregistrée", detail: "Pointage : entreprise absente ce jour · anomalie créée sur la Résidence SUNSET" },
  { kind: "risque", label: "Risque planning : raccordements R+1", detail: "Tâche t-09 (échéance demain) bloquée par l'absence · retard estimé +2 j" },
  { kind: "avancement", label: "Cloisons R+2 Bât. A → à valider", detail: "Tâche t-02 passée « À valider » · avancement zone R+2 mis à jour (71 %)" },
  { kind: "achat", label: "Demande d'achat : rails cloisons", detail: "Rapprochée de CMD-2026-118 (confirmée, livraison dans 3 j) · pas de double commande" },
  { kind: "journal", label: "3 entrées ajoutées au journal", detail: "Absence, avancement cloisons, rupture de stock rails — horodatées et signées" },
];

/** Q&A documentaire scriptée — chaque réponse cite ses sources (CDC §6.3). */
export const copilotAnswers: CopilotAnswer[] = [
  {
    matchers: ["façade", "facade", "matériau", "material"],
    answer:
      "Pour la façade du bâtiment A, le CCTP Lot 03 prescrit une ITE en panneaux de laine de roche 120 mm avec enduit mince taloché, teinte « Blanc Corail » (réf. NCS S 0502-Y). Le calepinage a été validé en réunion n°34 : joints creux horizontaux tous les 2 niveaux, selon plan PLN-A-201 ind. C.",
    sources: [
      { docId: "d-04", page: 18 },
      { docId: "d-01" },
      { docId: "d-08", page: 2 },
    ],
  },
  {
    matchers: ["plombier", "délai", "delai", "plumber", "lead time"],
    answer:
      "Le contrat de sous-traitance PLOMB'ÉO prévoit un délai d'exécution de 12 semaines à compter de l'ordre de service, avec pénalités de 1/1000 du marché par jour calendaire de retard. Attention : l'entreprise est absente aujourd'hui et la tâche « Raccordements EU/EV R+1 » arrive à échéance demain.",
    sources: [
      { docId: "d-05", page: 4 },
      { docId: "d-10" },
    ],
  },
  {
    matchers: ["plan", "applicable", "r+2", "drawing", "revision"],
    answer:
      "Le plan applicable pour l'étage courant du bâtiment A (dont le R+2) est le PLN-A-201 indice C, diffusé il y a 3 jours. L'indice B est obsolète : la réservation de la gaine technique du logement 23 y était mal positionnée (photo ph-04 liée). 2 personnes ont consulté l'indice B cette semaine — une notification de mise à jour leur a été envoyée.",
    sources: [{ docId: "d-01" }],
  },
  {
    matchers: ["manquent", "manquants", "elecrun", "missing", "documents"],
    answer:
      "Il manque 2 documents à ElecRun OI : l'attestation de vigilance URSSAF (expirée depuis 10 jours — relance préparée, à valider) et l'attestation d'assurance RC pro 2026. Le contrat prévoit la suspension d'accès chantier en cas de non-régularisation sous 48 h.",
    sources: [
      { docId: "d-06" },
      { docId: "d-05", page: 7 },
    ],
  },
  {
    matchers: ["visa", "viser", "plan d'exécution", "exe", "approval", "defavorable", "défavorable"],
    answer:
      "Deux dépôts appellent une action : EXE-ELE-204 (courants forts R+2/R+3, Ohm Ingénierie, ind. B) est en attente de visa avec échéance demain — il conditionne la fermeture des cloisons R+2 ; EXE-CHA-042 (charpente Bât. B) a reçu un avis défavorable il y a 3 jours pour absence de surcharge cyclonique dans la descente de charges, redépôt attendu en indice B. Les visas favorables les plus récents (EXE-STR-090, EXE-FLU-118) ont tous reçu leur contre-visa du contrôleur technique.",
    sources: [{ docId: "d-13" }, { docId: "d-14" }, { docId: "d-15" }],
  },
  {
    matchers: ["avis", "contrôleur", "controleur", "veritas", "sécurité", "securite", "sps"],
    answer:
      "Trois avis réglementaires sont ouverts sur la Résidence SUNSET : avis suspensif de Veritas sur la trémie ascenseur R+2 (protection collective déposée, rapport RAP-VT-2026-118), mise à jour du PPSPS demandée par le coordonnateur SPS avant lundi du fait de la co-activité sur la grue n°1, et avis défavorable de la maîtrise d'œuvre sur la charpente Bât. B. Ces avis sont repris automatiquement dans le compte rendu n°35 et ne peuvent pas en être retirés.",
    sources: [{ docId: "d-17" }, { docId: "d-18" }, { docId: "d-08", page: 3 }],
  },
];

export const copilotFallback: CopilotAnswer = {
  matchers: [],
  answer:
    "Je n'ai pas trouvé de réponse fiable dans les documents du chantier accessibles à votre rôle. En production, je m'appuie sur l'ensemble des plans, CCTP, contrats et comptes rendus indexés (RAG) — essayez l'une des questions suggérées pour voir une réponse sourcée.",
  sources: [],
};

/** Rapport journalier « généré » (démo). */
export const dailyReport = {
  effectifs:
    "42 personnes présentes sur 48 prévues (12 entreprises). Absence totale PLOMB'ÉO (plomberie). 3 plaquistes sur 6 prévus côté Bât. B.",
  avancement:
    "Coulage dalle haute R+2 Bât. A en cours (3 toupies réceptionnées 7h35). Cloisons R+2 Bât. A terminées, en attente de contrôle. Étanchéité toiture Bât. A : relevés posés, essai à l'eau jeudi.",
  incidents:
    "Grue n°2 indisponible (variateur) — levage réorganisé sur grue n°1. Garde-corps provisoire manquant trémie ascenseur : mis en sécurité à 9h10. 4 anomalies de pointage détectées (1 corrigée).",
  livraisons:
    "Béton C25/30 conforme (BL-88412). Rails cloisons Bât. B confirmés à J+3 (CMD-2026-118). Menuiseries R+1 toujours en retard de 6 jours (CMD-2026-114).",
  actions:
    "Valider les cloisons R+2 (contrôle Sofia Bègue). Relancer PLOMB'ÉO (relance préparée). Obtenir date ferme Charpentes Payet sous 24 h. Régulariser URSSAF ElecRun OI sous 48 h.",
};

export const weeklyReport = {
  retards:
    "Retard prévisionnel global : 12 jours vs planning initial (stable). Chemin critique : menuiseries R+1 (livraison) puis cloisons Bât. B (effectif plaquistes).",
  absences:
    "Taux de présence semaine : 91 % (moyenne 43,6/48). 1 absence entreprise non prévenue (PLOMB'ÉO, vendredi). 14 anomalies de pointage, 12 corrigées.",
  documentsManquants:
    "ElecRun OI : URSSAF expirée + RC pro 2026 manquante. Kolor Péi : décennale expire dans 21 jours (relance programmée).",
  avancement:
    "Avancement réalisé 68 % vs 75 % planifié. Semaine productive : +5 points (dalle R+2 coulée, cloisons R+2 terminées, étanchéité engagée). Situation n°8 (214 500 € HT) en attente MOE depuis 5 jours.",
};
