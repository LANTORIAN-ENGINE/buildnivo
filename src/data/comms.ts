import type { Conversation, FaqItem, SupportTicket } from "@/types";
import { daysAgo, inDays } from "./core";

const today = inDays(0);
const yesterday = daysAgo(1);

/**
 * Messagerie — conversations cohérentes avec les histoires de la démo :
 * l'absence PLOMB'ÉO, les cloisons R+2, les rails manquants, la livraison
 * menuiseries en retard, l'indice C du plan PLN-A-201.
 */
export const conversations: Conversation[] = [
  {
    id: "cv-sofia",
    kind: "direct",
    memberId: "BN-0003", // Sofia Bègue, chef de chantier
    pinned: true,
    online: true,
    unread: 2,
    replies: [
      "Parfait. Je fais le contrôle des logements 21 à 26 à 14h et je valide la tâche dans la foulée.",
      "C'est noté 👍 Je préviens l'équipe placo au bungalow.",
      "Bien reçu, je te redis après le tour de chantier.",
    ],
    messages: [
      { id: "m-s1", from: "BN-0003", kind: "text", text: "Salut Marc, les cloisons du R+2 Bât. A sont terminées côté équipe. Tu passes contrôler ou je valide ?", date: yesterday, time: "16:12" },
      { id: "m-s2", from: "me", kind: "text", text: "Je passe demain matin après le coulage. Tu peux m'envoyer une photo du logement 23 ? C'est celui qui avait la réservation décalée.", date: yesterday, time: "16:40", read: true },
      { id: "m-s3", from: "BN-0003", kind: "photo", text: "Logement 23 — la gaine est bien reprise selon l'ind. C.", photoHue: 215, date: yesterday, time: "17:05" },
      { id: "m-s4", from: "me", kind: "text", text: "Nickel, merci. On garde la tâche « à valider » jusqu'à mon passage.", date: yesterday, time: "17:22", read: true },
      { id: "m-s5", from: "system", kind: "system", text: "Le Copilote IA a lié cette conversation à la tâche « Cloisons placo R+2 — Bât. A »", date: yesterday, time: "17:23" },
      { id: "m-s6", from: "BN-0003", kind: "text", text: "Au fait, toujours pas de nouvelles de PLOMB'ÉO ce matin. J'ai relancé Bruno par téléphone, sans réponse.", date: today, time: "08:47" },
      { id: "m-s7", from: "BN-0003", kind: "voice", voiceSec: 23, text: "Message vocal — point rapide avancement R+2", date: today, time: "08:52" },
    ],
  },
  {
    id: "cv-sunset",
    kind: "channel",
    title: "Résidence SUNSET · Général",
    projectId: "p-sunset",
    members: 14,
    pinned: true,
    unread: 3,
    replies: [
      "Farid Aziz : Reçu, je libère la grue n°1 à partir de 13h30 pour les approvisionnements Bât. B.",
      "Sofia Bègue : Je mets à jour le planning de levage et je préviens les équipes.",
    ],
    messages: [
      { id: "m-g1", from: "BN-0003", kind: "text", text: "Bonjour à tous. Coulage dalle R+2 confirmé ce matin, 3 toupies réceptionnées à 7h35. Merci de laisser l'accès grue n°1 libre jusqu'à midi.", date: today, time: "07:41" },
      { id: "m-g2", from: "BN-0110", kind: "text", text: "OK pour moi. Le variateur de la grue n°2 est toujours HS, le SAV passe à 10h.", date: today, time: "07:50" },
      { id: "m-g3", from: "system", kind: "system", text: "Alerte IA partagée dans le canal : « Grue n°2 indisponible — levage réorganisé sur grue n°1 »", date: today, time: "07:51" },
      { id: "m-g4", from: "BN-0118", kind: "text", text: "Info Bât. B : toujours pas de rails pour les cloisons, le stock est à zéro. On bascule sur le R+3 en attendant ?", date: today, time: "09:14" },
      { id: "m-g5", from: "BN-0002", kind: "text", text: "Oui, basculez sur le R+3. La commande CMD-2026-118 est confirmée, livraison dans 3 jours.", date: today, time: "09:20" },
      { id: "m-g6", from: "BN-0003", kind: "photo", text: "Dalle R+2 coulée, finition en cours ✅", photoHue: 145, date: today, time: "11:32" },
    ],
  },
  {
    id: "cv-bruno",
    kind: "direct",
    memberId: "ST-2001", // Bruno Dijoux, PLOMB'ÉO
    online: false,
    unread: 1,
    replies: [
      "Compris. Je serai là demain 7h avec deux gars pour rattraper les raccordements du R+1.",
      "Oui, je vous envoie le planning de rattrapage ce soir sans faute.",
    ],
    messages: [
      { id: "m-b1", from: "me", kind: "text", text: "Bonjour Bruno, aucune présence de vos équipes aujourd'hui sur SUNSET. Les raccordements EU/EV du R+1 sont à échéance demain, c'est le chemin critique.", date: today, time: "09:02", read: true },
      { id: "m-b2", from: "system", kind: "system", text: "Relance officielle préparée par le Copilote IA — en attente de validation dans Rapports", date: today, time: "09:03" },
      { id: "m-b3", from: "ST-2001", kind: "text", text: "Bonjour Marc, désolé — panne de camion ce matin et mon second est malade. Je peux être là demain à la première heure.", date: today, time: "11:47" },
    ],
  },
  {
    id: "cv-payet",
    kind: "channel",
    title: "Lot Menuiseries · Charpentes Payet",
    projectId: "p-sunset",
    members: 4,
    unread: 0,
    replies: [
      "Éric Payet : Le transporteur me confirme un départ usine lundi. Je vous envoie le bon de transport dès réception.",
    ],
    messages: [
      { id: "m-p1", from: "me", kind: "text", text: "Éric, la commande CMD-2026-114 (26 châssis) a 6 jours de retard. La pose démarre dans 4 jours, il me faut une date ferme.", date: yesterday, time: "10:15", read: true },
      { id: "m-p2", from: "BN-0142", kind: "text", text: "Je suis sur le fournisseur depuis ce matin. Blocage au port, conteneur en cours de dédouanement.", date: yesterday, time: "10:41" },
      { id: "m-p3", from: "BN-0142", kind: "doc", docName: "Avis d'arrivée conteneur MSC-8841", docMeta: "PDF · 240 Ko", date: yesterday, time: "10:42" },
      { id: "m-p4", from: "me", kind: "text", text: "Merci. Sans confirmation avant jeudi, on décale la pose au lot suivant et on repositionne vos équipes.", date: yesterday, time: "11:03", read: true },
    ],
  },
  {
    id: "cv-marc",
    kind: "direct",
    memberId: "BN-0002", // Marc Dorseuil — utile quand la persona n'est pas le conducteur
    online: true,
    unread: 0,
    replies: [
      "Je regarde ça et je te fais un retour avant la réunion de 15h.",
    ],
    messages: [
      { id: "m-m1", from: "BN-0002", kind: "text", text: "Le MOE a diffusé l'indice C du plan étage courant. Deux personnes ont encore consulté l'indice B cette semaine, vérifie ton équipe.", date: yesterday, time: "14:20" },
      { id: "m-m2", from: "BN-0002", kind: "doc", docName: "PLN-A-201 — Plan étage courant Bât. A", docMeta: "ind. C · 4,7 Mo", date: yesterday, time: "14:21" },
      { id: "m-m3", from: "me", kind: "text", text: "Bien reçu, je fais passer le message au briefing de 13h. L'ind. B est retiré du bungalow.", date: yesterday, time: "14:48", read: true },
    ],
  },
  {
    id: "cv-albany",
    kind: "channel",
    title: "Collège Albany · Général",
    projectId: "p-albany",
    members: 8,
    unread: 0,
    replies: [
      "José Grondin : Reçu, on protège les fouilles avant de partir ce soir.",
    ],
    messages: [
      { id: "m-a1", from: "BN-0141", kind: "text", text: "Ferraillage des semelles filantes zone Nord terminé. Les aciers d'Acier Austral sont conformes au bon BL-2214.", date: today, time: "10:20" },
      { id: "m-a2", from: "BN-0141", kind: "photo", text: "Semelles zone Nord prêtes pour le coulage", photoHue: 90, date: today, time: "10:22" },
      { id: "m-a3", from: "me", kind: "text", text: "Parfait. Météo annonce des averses demain matin : protégez les fouilles ce soir.", date: today, time: "10:45", read: false },
    ],
  },
];

/* ------------------------------- Support ------------------------------- */

export const supportTickets: SupportTicket[] = [
  {
    id: "tk-01",
    ref: "SAV-2026-041",
    subject: "Badge NFC non reconnu sur la tablette du bungalow",
    categoryKey: "pointage",
    status: "enCours",
    updatedAt: today,
    excerpt: "Le lecteur ne détecte plus les badges depuis la mise à jour Android. Un technicien vous rappelle aujourd'hui avec une procédure de réappairage.",
  },
  {
    id: "tk-02",
    ref: "SAV-2026-038",
    subject: "Ajouter un accès lecture seule pour le maître d'œuvre",
    categoryKey: "compte",
    status: "ouvert",
    updatedAt: today,
    excerpt: "Demande d'un profil « invité MOE » limité aux documents et comptes rendus de la Résidence SUNSET.",
  },
  {
    id: "tk-03",
    ref: "SAV-2026-032",
    subject: "Export paie : format attendu par Silae",
    categoryKey: "facturation",
    status: "resolu",
    updatedAt: daysAgo(3),
    excerpt: "Résolu : le gabarit CSV « Silae — heures ventilées » est disponible dans Pointage → Export paie.",
  },
  {
    id: "tk-04",
    ref: "SAV-2026-027",
    subject: "Le rapport journalier n'inclut pas les photos de 17h",
    categoryKey: "ia",
    status: "resolu",
    updatedAt: daysAgo(8),
    excerpt: "Résolu : le rapport se génère à 18h ; les photos ajoutées après sont reprises dans le rapport du lendemain.",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "faq-01",
    categoryKey: "pointage",
    q: "Que se passe-t-il si un ouvrier oublie de pointer son départ ?",
    a: "L'IA détecte l'anomalie le soir même et la présente au chef de chantier dans Pointage → Anomalies. Il corrige l'heure en un clic ; seule l'heure validée part vers la paie. Aucune anomalie ne peut être exportée sans validation humaine.",
  },
  {
    id: "faq-02",
    categoryKey: "pointage",
    q: "Le pointage fonctionne-t-il sans réseau sur le chantier ?",
    a: "Oui. Badge NFC, scan QR et pointage GPS sont enregistrés localement sur le téléphone puis synchronisés dès que le réseau revient. La liste d'évacuation reste disponible hors ligne.",
  },
  {
    id: "faq-03",
    categoryKey: "pointage",
    q: "Peut-on imprimer la liste des présents en cas d'évacuation ?",
    a: "Oui, en un geste depuis Pointage → Liste d'évacuation : la liste horodatée des personnes présentes (salariés et sous-traitants) s'imprime ou s'exporte en PDF.",
  },
  {
    id: "faq-04",
    categoryKey: "ia",
    q: "L'IA peut-elle envoyer une relance à un sous-traitant sans mon accord ?",
    a: "Non, jamais. L'IA prépare le texte (absence, document expirant, retard de livraison) et le place dans Rapports → Relances avec le statut « à valider ». Rien ne part sans votre validation explicite.",
  },
  {
    id: "faq-05",
    categoryKey: "ia",
    q: "D'où viennent les réponses du Copilote ?",
    a: "Uniquement des documents de vos chantiers (plans, CCTP, contrats, comptes rendus) et des données auxquelles votre rôle donne accès. Chaque réponse cite ses sources avec la version du document et la page.",
  },
  {
    id: "faq-06",
    categoryKey: "compte",
    q: "Les sous-traitants doivent-ils payer une licence ?",
    a: "Non. L'accès sous-traitant est gratuit et limité à leurs lots : leurs tâches, leurs documents, leurs réserves et la messagerie du chantier. Vous gardez la main sur leurs permissions dans Équipes → Rôles.",
  },
  {
    id: "faq-07",
    categoryKey: "compte",
    q: "Comment retirer l'accès d'une personne qui quitte le chantier ?",
    a: "Équipes → fiche de la personne → « Détacher du chantier ». Son accès est coupé immédiatement, ses pointages et messages restent dans l'historique du chantier.",
  },
  {
    id: "faq-08",
    categoryKey: "mobile",
    q: "Les photos prises sur le terrain consomment-elles mon forfait ?",
    a: "Les photos sont compressées avant envoi (environ 300 Ko) et peuvent attendre le Wi-Fi du bungalow si vous activez « synchronisation en Wi-Fi seulement » dans l'application mobile.",
  },
  {
    id: "faq-09",
    categoryKey: "facturation",
    q: "Vers quels logiciels de paie puis-je exporter les heures ?",
    a: "Silae, Sage Paie et Quadratus via CSV normalisé (heures ventilées par chantier et par salarié). D'autres formats peuvent être ajoutés sur demande au support.",
  },
  {
    id: "faq-10",
    categoryKey: "mobile",
    q: "La dictée vocale comprend-elle le créole réunionnais ?",
    a: "La transcription est optimisée pour le français et gère les tournures locales courantes du chantier. Le texte transcrit reste éditable avant que l'IA ne propose des actions.",
  },
];
