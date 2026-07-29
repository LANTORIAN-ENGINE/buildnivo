# PRODUCT.md — Buildnivo

> Source : « Développement d'une plateforme SaaS intelligente pour la construction » (CDC 18 pages, dans ce dépôt).

## Product Purpose

Buildnivo est une plateforme SaaS de pilotage intelligente pour le BTP, reliant le chantier,
l'entreprise, les partenaires et les clients. Ce dépôt contient la **démo commerciale
frontend-only** : toutes les données sont factices (mock), aucune base de données, aucun backend.
Elle matérialise le noyau opérationnel recommandé par le CDC :
**pointage + présence + tâches + photos + journal de chantier + rapports et relances IA**,
plus documents, chantiers et équipes.

## Users

Priorité 1 (CDC §4) :
- **Chef de chantier** : saisie ultra-rapide sur le terrain (mobile/tablette), journal, photos, présences.
- **Conducteur de travaux** : tâches, avancement, sous-traitants, risques planning.
- **Direction / responsable d'exploitation** : synthèses, coûts engagés, alertes, rapports.
- **Salariés / ouvriers** : pointage simple (badge NFC, QR dynamique, géoloc — mockés en démo).
- **Sous-traitants** : portail simplifié.

Secondaires : fournisseurs, maîtres d'œuvre, bureaux d'études, promoteurs, acquéreurs, RH/finance.

## Register

register: product

## Brand & Tone

- Nom : **Buildnivo**. Marché pilote : PME du BTP, entreprises générales 20–300 salariés,
  terrain pilote La Réunion / marchés francophones (CDC §10) → données mock ancrées à La Réunion.
- Ton : terrain, direct, sans jargon logiciel. Le chef de chantier doit comprendre chaque écran
  en une seconde. FR par défaut, EN disponible (i18n complète).
- L'IA n'est pas un chatbot décoratif : elle **crée des actions** (tâches, alertes, relances,
  rapports) intégrées aux processus (CDC §6). Chaque suggestion IA est validée par un humain.

## Anti-references

- Ne pas ressembler à un ERP dense et intimidant (Oracle Aconex, ERP bâtiment legacy).
- Ne pas être « encore une pointeuse » ni « encore une GED » : la valeur est la liaison
  présence ↔ tâches ↔ journal ↔ rapports.
- Pas d'esthétique « SaaS générique » (dégradés violets, hero-metric, cartes identiques).
- Pas de cliché « BTP = orange fluo + noir » plaqué sur toute l'interface.

## Strategic principles

1. **Zéro saisie lourde** : tout écran terrain doit être actionnable en 1–2 gestes.
2. **L'information remonte seule** : le journal et les rapports se composent automatiquement.
3. **Différenciation** (CDC §11) : simplicité, mobile + vocal, IA qui agit, accès gratuit
   sous-traitants, connexion RH/présence/planning/productivité.
4. **Démo commerciale** : chaque module porte des tooltips de présentation (« mode découverte »)
   expliquant la valeur métier ; les fonctions complexes (NFC, biométrie, géoloc, transcription
   vocale, RAG) sont simulées de manière crédible.
5. **Traçabilité IA** : toute réponse documentaire cite ses sources ; toute action sensible
   demande validation humaine.
