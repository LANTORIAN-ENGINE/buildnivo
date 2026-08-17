# Compte rendu — Accès contrôle financier (BuildNivo Finance)

> Implémentation du **17 août 2026**.
> Portée : création d'un module complet **« Contrôle financier »** à partir du brief
> produit reçu le 16 août 2026 — un rôle unique en lecture seule destiné aux organismes
> qui financent, garantissent, assurent ou contrôlent une opération immobilière.
> Quatre écrans applicatifs, une rubrique de vitrine, une nouvelle famille de profils à
> la connexion, et une règle de présentation de la donnée qui s'applique à tout le module.
> Tout reste en données de démonstration, sans backend.
>
> Source : `documentation/Gmail — BRIEF PRODUIT — ACCÈS CONTRÔLE FINANCIER.pdf`.

**Sommaire**

1. [Demande et parti pris](#1-demande-et-parti-pris)
2. [Ce qui change dans la navigation](#2-ce-qui-change-dans-la-navigation)
3. [Le rôle et son périmètre](#3-le-rôle-et-son-périmètre)
4. [La règle du module : aucun chiffre ne circule seul](#4-la-règle-du-module--aucun-chiffre-ne-circule-seul)
5. [Écran 1 — Synthèse de l'opération](#5-écran-1--synthèse-de-lopération)
6. [Écran 2 — Rapports périodiques](#6-écran-2--rapports-périodiques)
7. [Écran 3 — Justificatifs et historique](#7-écran-3--justificatifs-et-historique)
8. [Écran 4 — Paramétrage des accès](#8-écran-4--paramétrage-des-accès)
9. [La vitrine : `/finance` et la section d'accueil](#9-la-vitrine--finance-et-la-section-daccueil)
10. [La page de connexion](#10-la-page-de-connexion)
11. [Données de démonstration ajoutées](#11-données-de-démonstration-ajoutées)
12. [État, actions et journalisation](#12-état-actions-et-journalisation)
13. [Internationalisation](#13-internationalisation)
14. [Traçabilité : du brief à l'écran](#14-traçabilité--du-brief-à-lécran)
15. [Ce que le module ajoute au système de design](#15-ce-que-le-module-ajoute-au-système-de-design)
16. [Corrections apportées à l'existant](#16-corrections-apportées-à-lexistant)
17. [Accessibilité, responsive, performance](#17-accessibilité-responsive-performance)
18. [Implémentation technique](#18-implémentation-technique)
19. [Scénario de démonstration conseillé](#19-scénario-de-démonstration-conseillé)
20. [Vérifications effectuées](#20-vérifications-effectuées)
21. [Ce qui n'est pas implémenté](#21-ce-qui-nest-pas-implémenté)

---

## 1. Demande et parti pris

### La demande

Le brief demande un **accès unique destiné aux intervenants financiers** d'une opération
immobilière : garant financier d'achèvement, banque, assureur, courtier (type Decatria),
investisseur, escrow team aux Émirats, gestionnaire de compte séquestre, organisme
financier ou institutionnel.

L'objectif énoncé est net : *« permettre à ces intervenants de disposer d'un meilleur
suivi de l'opération que celui fourni aujourd'hui par des comptes rendus ponctuels,
hétérogènes ou parfois oubliés par le promoteur »*. Et la limite l'est tout autant :
*« Il ne s'agit pas de donner accès à toute la gestion du chantier. »*

Nom provisoire du module : **BuildNivo Finance**.
Promesse : *« Un accès de contrôle simple, standardisé et documenté pour les organismes
qui financent ou garantissent l'opération. »*

### Les six décisions de cadrage

| # | Décision | Raison |
|---|---|---|
| 1 | **Un seul rôle plateforme (`financier`) pour les huit métiers** | Le brief l'impose explicitement (§2). Ce qui distingue un garant d'un courtier n'est pas son rôle, c'est le périmètre que le promoteur lui ouvre. Un seul rôle = une seule matrice à auditer |
| 2 | **Le module ne réutilise aucun écran existant** | `/finances`, `/rapports` et `/documents` affichent des données interdites au financeur (marges, incidents mineurs, pièces non partagées). Filtrer ces écrans aurait été une passoire ; on a construit quatre écrans dédiés qui ne peuvent afficher que le périmètre autorisé |
| 3 | **La traçabilité de la donnée est la signature visuelle du module** | Le brief demande deux fois la même chose (§5 et §9). C'est donc l'idée centrale, pas une note de bas de page : elle devient le composant de rendu de toute valeur |
| 4 | **Une donnée absente n'est jamais un zéro** | Un garant qui lit « 0 € de provision pour aléas » ne prend pas la même décision que devant « non communiquée ». La distinction est structurelle, portée par le type (`value: number \| null`) |
| 5 | **Le promoteur reste l'auteur** | Aucune publication automatique. L'IA prépare, le promoteur vérifie et publie. Le cycle est mis en scène jusque sur la vitrine, où la barre de progression s'arrête net à l'étape humaine |
| 6 | **Aucun écran existant n'est modifié dans son contenu** | Les changements portent sur la coquille (navigation, barre du haut, connexion) et sur les référentiels partagés (rôles, sociétés, personas) |

### Le fil narratif retenu

Le garant ne devrait pas avoir à réclamer son compte rendu → voilà le tableau de bord
standardisé → voilà pourquoi on peut s'y fier (chaque chiffre est sourcé et daté) →
voilà le rapport mensuel et sa validation humaine → voilà ce qu'il ne verra jamais →
voilà ce que le promoteur règle → voilà ce qui est tracé.

---

## 2. Ce qui change dans la navigation

### Routes créées

| Route | Contenu | Fichier |
|---|---|---|
| `/controle` | Écran 1 — Synthèse de l'opération | `src/app/(app)/controle/page.tsx` |
| `/controle/rapports` | Écran 2 — Rapports périodiques | `src/app/(app)/controle/rapports/page.tsx` |
| `/controle/justificatifs` | Écran 3 — Justificatifs et historique | `src/app/(app)/controle/justificatifs/page.tsx` |
| `/controle/acces` | Écran 4 — Paramétrage (promoteur) | `src/app/(app)/controle/acces/page.tsx` |
| `/finance` | Rubrique publique BuildNivo Finance | `src/app/(site)/finance/page.tsx` |

### Nouveau groupe de navigation

Un septième groupe apparaît dans la barre latérale bleue, **« Contrôle financier »**,
placé après « Gestion » et avant « Intelligence » :

| Entrée | Icône | Visible par |
|---|---|---|
| Synthèse de l'opération | `Landmark` | direction, conducteur, promoteur, maîtrise d'œuvre, **contrôle financier** |
| Rapports périodiques | `ScrollText` | idem |
| Justificatifs & historique | `FileBarChart2` | idem |
| Accès financiers | `ShieldCheck` | direction et promoteur **uniquement** |

### Modifications de la coquille

- **`src/components/shell/Sidebar.tsx`** — nouveau groupe ; le logo pointe désormais sur
  `homeFor(persona.role)` et non plus en dur sur `/dashboard` ; **correction de l'état
  actif** : l'entrée allumée est la plus spécifique, sinon « Synthèse » (`/controle`)
  restait allumée en même temps que « Rapports » (`/controle/rapports`).
- **`src/components/shell/Topbar.tsx`** — le sélecteur de chantier ne liste que
  l'opération de l'accès pour un profil financier (et se désactive s'il n'y en a qu'une) ;
  la cloche de notifications disparaît pour les rôles sans vue d'ensemble ; le sélecteur
  de profil gagne une troisième famille ; changer de profil renvoie sur l'écran d'accueil
  de ce profil.
- **`src/app/(app)/layout.tsx`** — un garde de périmètre (`useScopeGuard`) : voir §16.
- **`src/app/connexion/page.tsx`** — troisième famille de profils : voir §10.
- **`src/components/site/SiteHeader.tsx`** — cinquième entrée au menu « Plateforme ».

---

## 3. Le rôle et son périmètre

### Le rôle

| | |
|---|---|
| Identifiant technique | `financier` |
| Libellé FR | Contrôle financier |
| Libellé EN | Financial monitoring *(le brief nomme l'accès « Financial Monitoring Access »)* |
| Nature | **Lecture seule, sans exception** |

Le brief énumère sept interdictions (§2). Elles sont tenues **par la matrice de
permissions**, pas par un masquage d'interface :

| L'utilisateur ne peut pas… | Comment c'est empêché |
|---|---|
| modifier une donnée | Aucun écran du module n'expose d'action d'écriture pour ce rôle |
| créer ou affecter des tâches opérationnelles | `taches: none` |
| intervenir dans les conversations internes | `messages: none` — le module Messages n'apparaît pas dans sa navigation |
| modifier le planning | `chantiers: none`, `taches: none` |
| valider une facture à la place du promoteur | `finances: none` ; le bouton « marquer comme maîtrisé » d'un risque est conditionné à `!financial` |
| accéder aux données non partagées | Les blocs optionnels non cochés rendent un panneau « non partagé » explicite |
| consulter les autres opérations du promoteur | Le sélecteur de chantier est réduit à l'opération de l'accès, et le garde de périmètre y ramène |

### La matrice, ligne par ligne

Sur les 23 modules de la plateforme, le rôle `financier` obtient :

| Niveau | Modules |
|---|---|
| `read` (3) | `controle`, `controleRapports`, `controleJustificatifs` |
| `write` (2) | `support` (poser une question à BuildNivo), `parametres` (langue, réinitialisation de la démo) |
| `none` (18) | Tous les autres, y compris `dashboard`, `messages`, `pointage`, `achats`, `finances`, `documents`, `equipes` et `controleAcces` |

L'ajout du rôle a nécessité une douzième colonne dans `moduleAccess` et une entrée dans
`roleKpis` / `roleSections` — laissées **vides volontairement** : le contrôle financier
n'a pas de vue d'ensemble chantier, il a son propre tableau de bord standardisé.

### Les huit métiers, un seul rôle

| Nature | Libellé FR | Organisme de démonstration |
|---|---|---|
| `garant` | Garant financier d'achèvement | Garantie Océan Indien |
| `banque` | Banque | Banque des Mascareignes |
| `assureur` | Assureur | Réunion Assurances Construction |
| `courtier` | Courtier | Decatria Courtage |
| `investisseur` | Investisseur | Sofidom Investissement |
| `escrow` | Escrow team | Escrow Partners DMCC (Dubaï) |
| `sequestre` | Gestionnaire de compte séquestre | Étude Vitry & Associés |
| `institutionnel` | Organisme institutionnel | *(nature disponible au formulaire d'invitation)* |

---

## 4. La règle du module : aucun chiffre ne circule seul

C'est la décision de conception qui structure tout le reste, et elle vient du brief
lui-même, qui la formule deux fois :

> §5 — *« Le système ne doit jamais présenter une donnée ancienne comme une information actuelle. »*
> §9 — *« Chaque donnée importante doit indiquer sa date de mise à jour, son origine, son
> mode de calcul, son statut de validation, les pièces justificatives associées. »*

### Le type

Toute valeur affichée à un financeur passe par `TracedFigure` (`src/types/index.ts`) :

```ts
interface TracedFigure {
  key: string;              // clé i18n du libellé
  value: number | null;     // null = non renseignée, jamais 0
  unit: "euro" | "pct" | "days" | "count";
  updatedAt: string;        // date de mise à jour
  originKey: string;        // d'où vient la donnée
  methodKey: string;        // comment elle est calculée
  status: "valide" | "aValider" | "declaratif";
  docIds?: string[];        // pièces justificatives partagées
}
```

### Les trois états visuels, et seulement trois

| État | Rendu | Classe |
|---|---|---|
| **À jour** | Valeur en mono, filet neutre, pastille de statut | — |
| **Ancienne** (plus de 30 jours) | **Hachure ambre sous la valeur**, mention « Donnée ancienne » | `.stale-hatch` |
| **Absente** (`value === null`) | Gabarit hachuré gris portant « Non communiquée » | `.figure-void` |

La hachure reprend le hachurage d'un plan de géomètre : elle appartient au vocabulaire
graphique déjà en place (`blueprint-grid`, `paper-grid`, filets de cote de la vitrine).

### La provenance à un clic

Chaque ligne et chaque tuile porte un bouton discret qui ouvre un panneau :
date de mise à jour en toutes lettres, **origine** (13 origines possibles),
**mode de calcul** rédigé en français (26 formules), **statut de validation** avec son
explication, et la **liste des pièces justificatives** partagées, résolues depuis le
référentiel `documents`.

Sur la Résidence SUNSET, la démonstration compte **29 boutons de provenance** et
**4 données signalées comme anciennes** : budget initial (150 jours), apport du promoteur
et financement obtenu (96 jours), encaissements acquéreurs (34 jours, statut
« déclarative » faute de relevé notarial rattaché).

### Les composants

| Composant | Usage |
|---|---|
| `FigureTile` | Les quatre indicateurs d'avancement, en tuiles |
| `FigureRow` / `FigureTable` | Les relevés financiers, en tableau comparable |
| `Freshness` | Âge de la donnée + marquage « ancienne » |
| `Provenance` *(interne)* | Le panneau origine / calcul / statut / pièces |
| `NotSharedBlock` | Bloc optionnel non ouvert par le promoteur |
| `ReadOnlyBanner` | Bandeau d'en-tête pour un profil invité |
| `ReportSeal` | Le tampon d'un rapport figé |

Tout est dans `src/components/finance.tsx` (378 lignes).

---

## 5. Écran 1 — Synthèse de l'opération

`/controle` — l'écran que le brief décrit au §3 et reprend au §12 comme premier écran de
démonstration. Les blocs sont **toujours dans le même ordre**, avec **les mêmes
libellés** : c'est ce qui permet à un garant de comparer deux mois ou deux opérations.

### 5.1 Bandeau d'en-tête

Pour un profil financier : bandeau bleu « Lecture seule », nom de l'organisme, référence
du contrat qui justifie l'accès, et la phrase qui dit ce que l'accès ne permet pas.
Pour le promoteur : nom de l'opération, liste des organismes actifs, et un lien vers le
paramétrage.

### 5.2 Identification — les dix champs du brief

Promoteur · société de projet · adresse et localisation · nature du programme · montant
global de l'opération · montant prévisionnel des travaux · date de démarrage · date
contractuelle de livraison · date prévisionnelle actualisée · date de dernière mise à jour.

La livraison prévisionnelle passe en ambre dès qu'elle dépasse la date contractuelle.

### 5.3 Avancement — les sept points du brief

- **Quatre tuiles tracées** : avancement prévu, avancement constaté, écart en points,
  retard global estimé.
- **Courbe d'évolution** des derniers mois (prévu / constaté), Recharts, couleurs OKLCH
  en dur comme partout dans l'application.
- **Liste de jalons** : atteints (vert), à venir (gris), en retard (rouge), chacun avec
  sa date prévue ou atteinte et son écart signé en jours — *« +12 j de retard »*,
  *« −2 j d'avance »*.

### 5.4 Situation financière — les douze lignes

Budget initial · budget révisé · marchés signés · engagé · facturé · validé · payé ·
reste à engager · **coût prévisionnel à terminaison** · avenants · provision pour aléas
restante · **dépassement prévisionnel**. Les deux lignes en gras sont mises en avant
(fond bleu pâle, valeur plus grande) : ce sont celles que regarde un garant en premier.

Au-dessus du tableau, **l'encart de cohérence** — la question que pose tout financeur :

> Dépenses engagées à 72,9 % pour un avancement physique de 68 %. Écart de 4,9 points.
> Écart cohérent avec les approvisionnements en cours.

L'encart passe en ambre au-delà de 8 points d'écart, avec la mention « la facturation
devance l'avancement constaté ».

### 5.5 Financement et commercialisation — les neuf indicateurs, en quatre blocs

| Bloc | Indicateurs | Conditionné par |
|---|---|---|
| Financement | obtenu, consommé, apport du promoteur | *(toujours visible)* |
| Commercialisation | taux, ventes actées, réservations, encaissements acquéreurs | `share.commercialisation` |
| Compte séquestre | disponible, décaissé | `share.sequestre` |
| Trésorerie | besoin prévisionnel + graphique mensuel besoin/disponible | `share.tresorerie` |

Un bloc non ouvert **n'est pas masqué en silence** : il rend un panneau explicite
« Non partagé » qui rappelle que les indicateurs d'avancement, de budget, de délai et de
risque, eux, restent toujours visibles. C'est la traduction fidèle du §8 du brief.

Le graphique de trésorerie colore en rouge les mois où le besoin dépasse le disponible et
affiche la tension maximale sous la courbe — sur SUNSET, **266 000 € en octobre**.

### 5.6 Risques significatifs — les huit familles

Le brief impose les huit catégories et les six champs par risque. Les dix risques de
démonstration (huit sur SUNSET, deux sur Cœur de Ville) les couvrent toutes :

| Catégorie | Risque de démonstration (SUNSET) | Niveau |
|---|---|---|
| Délai | Mise hors d'air du Bât. A décalée de 12 jours | Rouge |
| Budget | Dépassement du lot plomberie / CVC (+6,4 %) | Orange |
| Achèvement | Provision pour aléas consommée à 80 % | Orange |
| Financement | Tranche 4 conditionnée à 70 % d'avancement constaté | Vert |
| Trésorerie | Pointe de décaissement en octobre | Orange |
| Assurances | Décennale du lot peinture à échéance dans 21 jours | Orange |
| Autorisations | Avis suspensif du contrôleur technique — trémie R+2 | Rouge |
| Continuité | Attestation URSSAF expirée — lot électricité | Orange |

Chaque carte porte : un filet de couleur au niveau, la catégorie, le niveau, le statut,
une description synthétique, **l'incidence estimée mise en évidence**, les mesures
correctives engagées en liste cochée, et la double date détection / mise à jour.
Un compteur en en-tête résume : *2 rouge · 4 orange · 2 vert*.

Le promoteur peut marquer un risque « maîtrisé » ; le financier ne le peut pas.

**Les incidents mineurs et les échanges internes n'apparaissent jamais** — la mention est
écrite dans l'interface, au-dessus de la grille.

### 5.7 Ce que raconte la cohérence des données

Les risques ne sont pas inventés : ils reprennent la narration déjà présente dans la démo
(menuiseries CMD-2026-114 en retard, grue n°2 en panne, dépassement plomberie
511 k€ / 480 k€, URSSAF ElecRun OI, décennale Kolor Péi, rapport de visite
RAP-VT-2026-118). **Le garant voit la conséquence financière de ce que le chef de
chantier a saisi sur le terrain** — c'est l'argument commercial du module.

---

## 6. Écran 2 — Rapports périodiques

`/controle/rapports` — deuxième écran de démonstration du brief.

### 6.1 Mise en page

Une pile de rapports à gauche (période, référence, version, statut), le rapport
sélectionné à droite. La pile est l'objet : un rapport publié porte un cadenas vert, un
rapport en préparation un sablier ambre.

### 6.2 Le cartouche

Quatre métadonnées en en-tête de rapport : préparé le · publié le · validé par ·
prochaine mise à jour. C'est ce qui rend le document opposable.

### 6.3 Les treize rubriques standardisées

Numérotées `01` à `13`, dans l'ordre exact du brief :

résumé de la situation · avancement physique · comparaison avec le planning · situation
financière · cohérence entre avancement et dépenses · coût prévisionnel à terminaison ·
financement et trésorerie · commercialisation · risques significatifs · actions
correctives · photographies d'avancement · principaux documents et justificatifs · date
de la prochaine mise à jour.

Les rubriques 11 et 12 sont **rendues** et pas seulement décrites : les photographies
sélectionnées s'affichent en vignettes horodatées (`PhotoScene`), les pièces jointes en
puces résolues depuis le référentiel documentaire.

### 6.4 La préparation par l'IA et la validation humaine

- Badge « Généré par l'IA » + mention « Vérification humaine obligatoire avant publication ».
- Bouton « Préparer le rapport du mois » (promoteur) → `prepareReport`.
- Bouton « Vérifier et publier » → **fenêtre de confirmation** qui rappelle les
  conséquences et **réaffiche les points signalés** avant de laisser publier.
- À la publication : le rapport est daté, figé, archivé, et les organismes destinataires
  notifiés — la liste des destinataires est calculée à partir des accès actifs dont la
  notification « publication » est active.

### 6.5 Le gel et les versions

Un rapport publié affiche le **tampon** (`ReportSeal`) : « FIGÉ · RPT-2026-07 · v1 ·
12/07/26 », légèrement incliné, avec une animation de pression au moment de la
publication. C'est le seul élément penché de toute l'interface : il ne sert qu'à cet
état, qui est irréversible.

Le bouton « Publier une correction » ouvre une saisie de motif obligatoire, puis crée
**une version supplémentaire**. L'historique des versions est rendu en frise verticale.
Le rapport de juin de la démonstration porte déjà deux versions :

> **Version 2** — 26/06/2026 — Hélène Vitry
> Correction du montant facturé du lot 04 (566 000 € au lieu de 656 000 €, erreur de
> saisie de situation). La version 1 reste consultable et horodatée.

### 6.6 Les données signalées

Le rapport d'août en préparation porte deux points signalés :

- Encaissements acquéreurs non actualisés depuis 34 jours — donnée déclarative.
- Situation n°8 (214 500 € HT) en attente de validation du maître d'œuvre depuis 5 jours.

**Décision d'interprétation** : le brief présente ces mentions comme un signal
*avant* publication (§4, §11). Nous les avons rendues **persistantes après publication**,
sous le titre « Données incomplètes ou anciennes au moment de la publication ». Masquer
l'information au destinataire aurait contredit le §5 (*« ne jamais présenter une donnée
ancienne comme une information actuelle »*). Les rapports déjà publiés du jeu de données
n'ont aucun point signalé ; le mécanisme se voit en publiant le rapport d'août pendant la
démonstration.

### 6.7 Les rappels automatiques (§5)

Visibles par le promoteur uniquement, au-dessus de la pile :

| Type | Exemple de démonstration | Échéance |
|---|---|---|
| Échéance de publication | Rapport d'août à publier dans 5 jours | J+5 |
| Données non actualisées | Encaissements acquéreurs non actualisés depuis 34 jours | J+2 |
| Validation en attente | Situation n°8 en attente de visa depuis 5 jours (→ maîtrise d'œuvre) | J+3 |
| Données non actualisées | Bilan promoteur non rattaché — ZAC Cœur de Ville | J+6 |
| Notification de publication | RPT-2026-07 publié, organismes notifiés | *envoyée* |

### 6.8 Ce que voit un invité

Un profil financier ne voit **que les rapports publiés**. Ni brouillon, ni rapport en
attente de vérification, ni bouton de publication, ni bloc de rappels.

---

## 7. Écran 3 — Justificatifs et historique

`/controle/justificatifs` — troisième écran de démonstration du brief.

| Bloc | Contenu | Règle |
|---|---|---|
| **Documents partagés** | Nom, indice, date de mise à jour, fraîcheur, téléchargement | Uniquement les pièces **expressément partagées** avec cet organisme. Pour le promoteur : l'union de ce que chaque organisme peut atteindre |
| **Photographies d'avancement** | Vignettes SVG horodatées, légendes | **Sélection du promoteur uniquement**, prise dans les rapports publiés. Les photographies brutes du chantier (problèmes, sécurité, réserves) restent inaccessibles. Si le bloc n'est pas ouvert, un état explicite le dit |
| **Historique des rapports publiés** | Cartes portant le tampon, la période, la date, le validateur, le numéro de version | Les anciens rapports restent accessibles indéfiniment |
| **Journal miroir** | Connexions, synthèses consultées, rapports ouverts, documents téléchargés, exports | Pour l'invité : *ses* consultations. Pour le promoteur : toutes, avec l'organisme |

Le journal miroir est un choix délibéré : **la traçabilité vaut dans les deux sens**.
L'invité voit exactement ce que le promoteur voit de lui — c'est ce qui rend le
journal acceptable plutôt que policier.

Sur la Résidence SUNSET, le garant dispose de **4 documents partagés** (compte rendu
n°34, planning TCE rev. 8, PV de réception des supports d'étanchéité, rapport de visite
du contrôleur technique) ; le courtier n'en a **qu'un** — le planning.

---

## 8. Écran 4 — Paramétrage des accès

`/controle/acces` — écran du promoteur, absent de la navigation d'un invité.

### 8.1 Inviter un organisme

Le brief pose comme critère d'acceptation que *« le promoteur peut inviter un garant en
quelques minutes »*. Le formulaire tient dans une seule fenêtre : nom de l'organisme,
nature (menu des huit métiers), référence du contrat, utilisateur autorisé, adresse
e-mail, date de fin d'accès, fréquence des rapports, les quatre blocs optionnels en
interrupteurs, et la liste des documents du chantier à cocher.

L'organisme créé pendant la démonstration n'existe pas au référentiel des sociétés : son
nom est porté par l'accès lui-même (`orgName`).

### 8.2 Les neuf réglages du §8

| Réglage du brief | Où il se règle |
|---|---|
| L'identité de l'organisme invité | Formulaire d'invitation |
| Les utilisateurs autorisés | Formulaire, puis liste dépliée sur la carte d'accès |
| La date de début et de fin de l'accès | Formulaire ; affichée en mono sur la carte |
| Les documents partagés | Cases à cocher sur la carte, effet immédiat |
| L'accès aux données de **commercialisation** | Interrupteur |
| L'accès aux données de **trésorerie** | Interrupteur |
| L'accès aux données du **compte séquestre** | Interrupteur |
| La fréquence des rapports | Segmenté mensuelle / trimestrielle |
| Les notifications envoyées | Trois interrupteurs : publication, rappel avant échéance, apparition d'un risque rouge |

Un quatrième interrupteur, non demandé mais cohérent avec le §6, contrôle l'accès aux
**photographies sélectionnées**.

Au-dessus de la liste, la phrase du brief est rappelée textuellement : *« Les indicateurs
essentiels d'avancement, de budget, de délai et de risque conservent une présentation
standard »* — c'est-à-dire qu'ils ne sont **pas** paramétrables, et il n'y a donc aucun
interrupteur pour eux.

### 8.3 Suspension et révocation

Trois actions par accès : **Suspendre** (réversible), **Réactiver**, **Révoquer**
(bouton rouge). La révocation est immédiate : l'accès passe en `revoque`, la date est
enregistrée, **une ligne est écrite au journal**, et l'invité qui ouvrirait un écran du
module tombe sur un état « Accès clos » rappelant que les rapports déjà publiés restent
archivés côté promoteur.

### 8.4 Le journal des accès (§9)

Tableau complet : date et heure, utilisateur et son organisme, action (six types :
connexion, synthèse consultée, rapport consulté, document téléchargé, export, révocation),
élément concerné, adresse IP. Export du journal simulé.

Le journal **se remplit pendant la démonstration** : ouvrir la synthèse en garant,
télécharger un document, exporter la synthèse — chaque geste ajoute une ligne visible
ensuite depuis le profil promoteur.

---

## 9. La vitrine : `/finance` et la section d'accueil

### 9.1 La rubrique `/finance`

Neuf sections, construites sur le kit de vitrine existant (`PageHero`, `SiteSection`,
`SectionHeading`, `Reveal`, `Stagger`, `FinalCta`).

| Section | Contenu |
|---|---|
| Hero | Titre « Le garant ne devrait pas avoir à réclamer son compte rendu ». **Encart latéral : un relevé certifié** — le montant facturé de SUNSET avec ses cinq lignes de traçabilité. La promesse du module est montrée, pas énoncée |
| À qui | Les huit métiers en puces, puis la promesse du brief dans un encart bleu |
| Aujourd'hui | Quatre cartes du problème : un compte rendu quand on y pense · un format différent à chaque fois · des chiffres sans provenance · de l'ancien présenté comme de l'actuel |
| Écran 1 | Les quatre blocs du tableau de bord standardisé, numérotés |
| La règle *(fond bleu)* | La traçabilité en cinq encarts + l'encart ambre du signalement des données anciennes |
| Écran 2 | La figure `ReportCycle` + les cinq rappels automatiques |
| Périmètre | La figure `AccessWall` : 10 informations ouvertes / 12 fermées |
| Paramétrage | Les neuf réglages en liste |
| Traçabilité | Le journal, un extrait rendu dans la typographie de données de l'application, et l'encart rouge de la révocation immédiate |
| Critères | Les **treize critères d'acceptation** du §11, numérotés |
| Appel à l'action | Ouvrir la démo avec le profil du garant |

### 9.2 `ReportCycle` — la figure signature de la rubrique

Cinq étapes : collecte → préparation → **vérification** → publication → archivage.

La progression démarre seule à l'entrée dans l'écran… **et s'arrête net à l'étape de
vérification.** L'étape porte une pastille « Humain ». Rien ne va plus loin tant que le
visiteur n'a pas cliqué sur « Publier et notifier » — et à ce moment le tampon « FIGÉ »
tombe avec son animation de pression.

Une animation, une idée : *le rapport n'est pas publié par la machine*. En mouvement
réduit, la figure s'ouvre directement à l'étape de vérification.

### 9.3 `AccessWall` — le mur du périmètre

Deux colonnes. À gauche, dix plaques vertes : synthèse, avancement global, planning
synthétique, indicateurs financiers, coût à terminaison, risques matériels, rapports
périodiques, photographies sélectionnées, documents partagés, historique. À droite, douze
plaques hachurées et barrées : messagerie interne, échanges entre entreprises, données RH
nominatives, salaires, pointages individuels, négociations commerciales, marges
détaillées, incidents mineurs, documents non partagés, photographies brutes, notes
internes du promoteur, autres opérations.

Les deux colonnes se remplissent en cascade depuis la ligne de partage centrale, comme un
mur qui se monte des deux côtés.

### 9.4 La section d'accueil `N+07`

Une section a été insérée sur la page d'accueil, entre « Cloisonnement » (`N+06`) et
« Supply ». Elle reprend `AccessWall` et se referme sur l'encart « Publié veut dire figé »
avec un lien vers `/finance`.

**Conséquence** : les sections suivantes ont été renumérotées `N+08` à `N+12`, et
l'alternance de fonds papier / carte a été rétablie sur toute la fin de page.
L'accueil passe de 14 à 15 sections, dont 13 cotées.

### 9.5 Le reste de la vitrine

- **Menu « Plateforme »** : cinquième entrée, « BuildNivo Finance — l'accès de contrôle
  des garants, banques et investisseurs ».
- **Grille des modules** (`ModuleGrid`) : dix-neuvième module, pôle Gestion, lien vers
  `/controle`.
- **Offres** : « Accès contrôle financier » ajouté aux fonctions de l'offre Project et du
  Studio Promoteur.

---

## 10. La page de connexion

Une **troisième famille** apparaît sous les deux existantes, avec son chapeau explicatif :

> **Contrôle financier** — Garant, banque, assureur, courtier, investisseur, escrow ou
> compte séquestre : un accès unique, en lecture seule, limité à l'opération qu'ils
> financent. Le périmètre affiché dépend de ce que le promoteur a ouvert.

| Profil | Fonction | Organisme | Accès | Particularité |
|---|---|---|---|---|
| Nadia Ferrand | Directrice des engagements | Garantie Océan Indien | `fa-gfa` | Périmètre complet, 4 documents partagés |
| Pascal Ellama | Chargé d'affaires promotion | Banque des Mascareignes | `fa-banque` | Périmètre complet, 3 documents |
| Yann Vergès | Courtier associé | Decatria Courtage | `fa-decatria` | **Trésorerie et séquestre fermés**, 1 document, rapports trimestriels |

Yann Vergès est le profil à montrer en rendez-vous : il rend visible, en un écran, la
différence entre ce qui est standard et ce qui est paramétrable.

Le choix d'un profil renvoie sur `homeFor(role)` — `/controle` pour un financier,
`/dashboard` pour tous les autres.

Le décompte de profils de la démonstration passe de **11 à 14**, corrigé dans le hero de
l'accueil, la matrice de permissions de l'écran Équipes, le README et les compteurs.

---

## 11. Données de démonstration ajoutées

Tout est dans `src/data/finance.ts` (809 lignes), exporté par `src/data/index.ts`, plus
les sociétés et personas ajoutés à `src/data/core.ts`.

| Jeu de données | Volume | Détail |
|---|---|---|
| `operationSnapshots` | 2 | Résidence SUNSET (complète) et ZAC Cœur de Ville (**volontairement incomplète**) |
| — `identity` | 10 champs × 2 | Bloc identification |
| — `progress` | 4 × 2 | Indicateurs d'avancement tracés |
| — `financial` | 12 × 2 | Les douze lignes de situation financière |
| — `funding` | 10 × 2 | Financement, commercialisation, séquestre, trésorerie |
| — `cashCurve` | 5 mois × 2 | Besoin mensuel et disponible |
| — `progressCurve` | 5 et 3 points | Évolution de l'avancement |
| `financeMilestones` | 10 | 7 sur SUNSET (3 atteints, 1 en retard, 3 à venir), 3 sur Cœur de Ville |
| `materialRisks` | 10 | 8 sur SUNSET couvrant les 8 catégories, 2 sur Cœur de Ville |
| `financeReports` | 5 | 3 publiés (dont 1 en version 2 pour cause de correction), 1 à vérifier, 1 brouillon |
| — `sections` | 13 × 5 | Les 65 rubriques rédigées |
| `financialAccesses` | 6 | 3 actifs et 1 révoqué sur SUNSET, 1 actif et 1 en invitation sur Cœur de Ville |
| `accessLogs` | 14 | Connexions, consultations, téléchargements, un export, une révocation |
| `financeReminders` | 5 | 4 à valider, 1 envoyée |
| `financeVisible` / `financeHidden` | 10 + 12 | Les listes du §6 et du §7 |
| `financeCriteria` | 13 | Les critères d'acceptation du §11 |
| `reportCycleSteps` | 5 | Le cycle de publication |
| `reportSectionKeys` | 13 | L'ordre imposé des rubriques |
| Sociétés financières (`core.ts`) | 7 | Nouveau `CompanyKind: "financier"` |
| Personas (`core.ts`) | 3 | Rattachés à leur accès par `accessId` |

### Les chiffres de la Résidence SUNSET

Cohérents entre eux et avec les données déjà présentes dans la démonstration
(`projects`, `financeRows`, `purchaseOrders`, `aiAlerts`) :

| Ligne | Montant |
|---|---|
| Montant global de l'opération | 11 850 000 € |
| Budget travaux initial | 7 400 000 € |
| Budget révisé (avec 212 000 € d'avenants) | 7 612 000 € |
| Engagé / facturé / validé / payé | 5 550 000 / 5 118 000 / 4 902 000 / 4 640 000 € |
| **Coût prévisionnel à terminaison** | **7 694 000 €** |
| **Dépassement prévisionnel** | **82 000 €** (+1,1 %) |
| Provision pour aléas restante | 118 000 € sur 592 000 € initiaux |
| Financement obtenu / consommé | 8 900 000 / 5 240 000 € |
| Commercialisation | 38 lots sur 48, soit 79 % — 31 actes, 7 réservations |
| Séquestre disponible / décaissé | 1 214 000 / 3 142 000 € |
| Avancement constaté / prévu | 68 % / 75 % |
| Retard prévisionnel | 12 jours |

### Pourquoi une deuxième opération incomplète

La ZAC Cœur de Ville sert un seul but : montrer ce qui se passe **quand la donnée
manque**. Sa provision pour aléas est `null` — elle s'affiche « non communiquée » — son
rapport reste au stade brouillon avec deux points signalés, et son avancement date de
huit jours. Elle porte l'accès de l'escrow team de Dubaï et l'invitation en attente de
l'investisseur.

---

## 12. État, actions et journalisation

### 12.1 Nouvel état dans `src/lib/store.tsx`

`accesses` · `reports` · `risks` · `logs` · `financeReminders` — tous clonés depuis les
graines au montage, avec des fonctions de clonage profond dédiées (`cloneAccesses`,
`cloneReports`, `cloneRisks`) parce que ces objets portent des sous-objets mutables
(utilisateurs, blocs partagés, notifications, rubriques, historique de versions).

Les cinq états sont réinitialisés par `resetDemo`, conformément à la règle du projet.

### 12.2 Actions ajoutées

| Action | Effet |
|---|---|
| `inviteAccess` | Ouvre un accès à un organisme |
| `updateAccess` | Périmètre, documents, dates, fréquence, notifications |
| `setAccessStatus` | Actif / suspendu / révoqué ; **écrit au journal** en cas de révocation |
| `prepareReport` | L'IA prépare le rapport du mois ; s'il existe déjà un brouillon, il est réactualisé |
| `publishReport` | Date, fige, archive, enregistre le validateur |
| `correctReport` | **Incrémente la version** et ajoute une entrée d'historique — ne réécrit jamais |
| `setRiskStatus` | Le promoteur marque un risque comme maîtrisé |
| `sendFinanceReminder` | Envoie un rappel automatique |
| `logAccess` | Trace une consultation, un téléchargement ou un export |

### 12.3 Le contexte de périmètre

`src/lib/finance.ts` expose `useFinance()`, qui renvoie pour le profil connecté : son
accès, s'il est financier, l'opération à afficher, les blocs réellement ouverts, si
l'accès est clos, et le nom du signataire des actions. Les quatre écrans s'appuient
dessus — un seul endroit décide du périmètre.

---

## 13. Internationalisation

Deux blocs ont été ajoutés aux dictionnaires, avec la parité garantie par le typage
`Dict = typeof fr` : une clé manquante en anglais casse le build.

| Bloc | Contenu |
|---|---|
| `controle.*` | Le module applicatif : périmètre, fraîcheur, traçabilité (13 origines, 26 modes de calcul, 3 statuts et leurs explications), 26 libellés d'indicateurs, les 4 blocs de la synthèse, les 8 catégories et 3 niveaux de risque, les 13 rubriques de rapport, les 4 mois, les 8 natures d'organisme, les 4 statuts d'accès, les 6 actions du journal, les 10 + 12 lignes de visibilité |
| `site.finance.*` | La rubrique publique : hero, 4 problèmes, 4 blocs du tableau de bord, 5 items de traçabilité, 5 étapes du cycle, 5 rappels, 9 réglages, 13 critères d'acceptation |
| `tips.controle.*` | Sept argumentaires du mode découverte : le module, la traçabilité, les données anciennes, les risques, les rapports, le paramétrage, le journal |
| `roles`, `jobs`, `nav`, `login` | Le rôle, 7 nouvelles fonctions, le groupe et les 4 entrées de navigation, la troisième famille de la page de connexion |

**+570 lignes en français, +556 en anglais.**

Conformément à la convention du projet, les **données métier restent en français** :
noms d'organismes, références de contrat (`GFA-2026-0148`, `CP-2026-3312`), intitulés de
risque, texte des rubriques de rapport.

---

## 14. Traçabilité : du brief à l'écran

| Section du brief | Où elle est implémentée |
|---|---|
| §1 Objectif — les sept capacités attendues | Réparties sur les trois écrans invité |
| §1 « uniquement les informations nécessaires au contrôle » | Matrice de permissions (§3 du présent document) |
| §2 Nom du rôle et sept interdictions | `Role: "financier"` + `moduleAccess` + absence d'action d'écriture |
| §3 Identification — 10 champs | `/controle`, bloc Identification |
| §3 Avancement — 7 points | `/controle`, tuiles + courbe + jalons |
| §3 Situation financière — 12 lignes | `/controle`, tableau tracé |
| §3 Financement et commercialisation — 9 items | `/controle`, quatre blocs conditionnés |
| §3 Risques significatifs — 8 familles, 6 champs | `/controle`, grille de cartes |
| §3 « les incidents mineurs ne doivent pas apparaître » | Mention écrite + jeu de données limité aux risques matériels |
| §4 Rapport périodique — 13 rubriques | `/controle/rapports` |
| §4 IA prépare, humain valide | `prepareReport` / fenêtre de confirmation / `publishReport` |
| §4 Daté, figé, archivé, non modifiable en silence, correction = nouvelle version | `ReportSeal`, `correctReport`, frise d'historique |
| §5 Date mensuelle, rappel, relance, alerte, notification, date de MAJ, mention d'ancienneté | `financeReminders` (4 types) + `Freshness` + `.stale-hatch` + points signalés |
| §6 Informations accessibles — 10 | `financeVisible`, rendues par `AccessWall` et par les écrans |
| §7 Informations non accessibles — 12 | `financeHidden` + matrice de permissions |
| §8 Paramétrage — 9 réglages | `/controle/acces` |
| §8 « les indicateurs essentiels conservent une présentation standard » | Aucun interrupteur pour l'avancement, le budget, le délai et le risque |
| §9 Traçabilité de la donnée — 5 attributs | `TracedFigure` + panneau de provenance |
| §9 Journalisation des accès — 5 attributs | `AccessLogEntry` + journal des deux côtés |
| §10 Première version à développer — 16 priorités | Les 16 sont couvertes |
| §11 Critères d'acceptation — 13 | Fonctionnellement tenus ; publiés tels quels sur `/finance` |
| §12 Trois écrans de démonstration | `/controle`, `/controle/rapports`, `/controle/justificatifs` |
| §12 Nom du module et promesse | « BuildNivo Finance », promesse reprise mot pour mot |

### Les seize priorités du §10

| # | Priorité | État |
|---|---|---|
| 1 | Création du rôle unique « Contrôle financier » | ✔ |
| 2 | Invitation d'un garant ou financeur dans un Project | ✔ |
| 3 | Accès strictement en lecture seule | ✔ |
| 4 | Tableau de bord standardisé | ✔ |
| 5 | Avancement prévu et constaté | ✔ |
| 6 | Planning synthétique et retard estimé | ✔ (jalons + retard global) |
| 7 | Budget, engagé, facturé, validé, payé | ✔ |
| 8 | Coût prévisionnel à terminaison | ✔ (mis en avant) |
| 9 | Risques significatifs | ✔ (8 catégories) |
| 10 | Photographies sélectionnées | ✔ (rapports + écran 3) |
| 11 | Documents partagés | ✔ |
| 12 | Rapport mensuel généré avec l'IA | ✔ |
| 13 | Validation du rapport avant publication | ✔ |
| 14 | Archivage des versions | ✔ |
| 15 | Rappels automatiques | ✔ (4 types) |
| 16 | Journal des accès | ✔ (des deux côtés) |

---

## 15. Ce que le module ajoute au système de design

Le module n'invente pas une direction visuelle : il reste sur les jetons OKLCH, Archivo,
JetBrains Mono pour les données, et le kit existant. Trois éléments seulement ont été
ajoutés à `globals.css` (+55 lignes) :

| Classe | Rôle | Justification |
|---|---|---|
| `.stale-hatch` | Hachure ambre sous une valeur de plus de 30 jours | Une donnée périmée ne peut pas avoir la même apparence qu'une donnée du jour. Vocabulaire emprunté au hachurage des plans de géomètre |
| `.figure-void` | Gabarit hachuré gris d'une donnée absente | Un vide doit se voir comme un vide |
| `.report-seal` + `seal-press` | Tampon incliné d'un rapport publié | Le seul aplat penché de l'interface, réservé au seul état irréversible du produit |

Un composant a été ajouté au kit partagé : **`Switch`** (`src/components/ui.tsx`),
interrupteur accessible avec `role="switch"`, libellé, indice facultatif et état désactivé.

La règle de restriction habituelle est respectée : les jetons d'état (ambre, vert, rouge,
violet) ne portent que des états — niveau de risque, fraîcheur, statut de validation,
statut d'accès — jamais de décoration.

---

## 16. Corrections apportées à l'existant

Trois défauts préexistants ont été corrigés au passage.

### 16.1 Le périmètre n'était pas défendu contre l'URL

La navigation masquait les modules hors périmètre, mais rien n'empêchait un profil de
saisir une adresse à la main. Un maître d'ouvrage pouvait ouvrir `/achats`.

`src/app/(app)/layout.tsx` porte désormais un **garde de périmètre** : à chaque
changement de route, `moduleForPath(pathname)` résout le module concerné et, si
`canSee()` est faux, renvoie sur l'écran d'accueil du profil. Le garde protège **les 23
modules**, pas seulement les nouveaux.

Le même effet ramène un profil financier sur l'opération de son accès.

### 16.2 L'état actif de la navigation

`pathname.startsWith(href + "/")` allumait « Synthèse » en même temps que « Rapports ».
La barre latérale calcule maintenant l'entrée active la plus spécifique.

### 16.3 Compteurs désynchronisés

- `keyFigures.demoRoles` : 11 → **14** (hero de l'accueil, mention de confiance, README).
- `keyFigures.demoModules` : 18 → **19**, la valeur ne correspondait plus au contenu réel
  de `siteModules`.

---

## 17. Accessibilité, responsive, performance

### Accessibilité

- Le bouton de provenance porte `aria-label` et `aria-expanded` ; le panneau se ferme au
  clic extérieur et à Échap.
- `Switch` expose `role="switch"` et `aria-checked`, avec un `<label>` associé par `id`.
- Les étapes de `ReportCycle` portent `aria-current="step"`.
- Le sélecteur de chantier réduit à une opération est **désactivé** plutôt que masqué :
  l'information reste lisible.
- Les tampons, filets de couleur et hachures sont `aria-hidden` ; l'information qu'ils
  portent est toujours doublée par du texte (« Figé », « Donnée ancienne », le niveau de
  risque en toutes lettres). **Aucune information n'est portée par la seule couleur.**
- `prefers-reduced-motion` : `ReportCycle` s'ouvre directement à l'étape de vérification,
  `AccessWall` à son état final.

### Responsive

- Les tableaux de relevés masquent la colonne de fraîcheur en dessous de `sm` et la
  colonne de statut en dessous de `md` ; l'information reste atteignable par le panneau
  de provenance.
- Tous les tableaux défilent dans leur propre conteneur ; le corps de page ne défile
  jamais latéralement.
- La pile de rapports passe au-dessus du rapport en dessous de `xl`.
- Le mur du périmètre passe en une colonne, les cinq étapes du cycle s'empilent.

### Performance

- Aucune dépendance ajoutée. `ComposedChart` de Recharts, déjà présent, sert au graphique
  de trésorerie.
- Aucune image : les photographies restent des `PhotoScene` SVG, la démonstration reste
  utilisable hors ligne.
- Les quatre écrans sont pré-rendus statiquement au build.

---

## 18. Implémentation technique

### Fichiers créés

| Fichier | Lignes | Rôle |
|---|---|---|
| `src/data/finance.ts` | 809 | Snapshots, jalons, risques, rapports, accès, journal, rappels |
| `src/app/(app)/controle/acces/page.tsx` | 599 | Écran 4 — paramétrage et journal |
| `src/app/(app)/controle/page.tsx` | 559 | Écran 1 — synthèse |
| `src/app/(app)/controle/rapports/page.tsx` | 490 | Écran 2 — rapports périodiques |
| `src/components/finance.tsx` | 378 | Kit de la donnée certifiée |
| `src/app/(site)/finance/page.tsx` | 357 | Rubrique publique |
| `src/app/(app)/controle/justificatifs/page.tsx` | 274 | Écran 3 — justificatifs |
| `src/components/site/figures/ReportCycle.tsx` | 144 | Figure du cycle de publication |
| `src/components/site/figures/AccessWall.tsx` | 80 | Figure du périmètre |
| `src/lib/finance.ts` | 45 | `useFinance()` |
| `src/app/(site)/finance/layout.tsx` | 11 | Métadonnées de la rubrique |

**11 fichiers, 3 746 lignes.**

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/lib/i18n/fr.ts` | +570 lignes : blocs `controle`, `site.finance`, `tips.controle` |
| `src/lib/i18n/en.ts` | +556 lignes : miroir anglais |
| `src/types/index.ts` | +243 lignes : 18 types du domaine financier + rôle + `CompanyKind` |
| `src/lib/store.tsx` | +190 lignes : 5 états, 9 actions, clonage profond, réinitialisation |
| `src/lib/permissions.ts` | +111 lignes : 12ᵉ colonne, 4 modules, `isFinancial`, `homeFor`, `moduleForPath` |
| `src/data/core.ts` | +86 lignes : 7 sociétés financières, 3 personas |
| `src/app/globals.css` | +55 lignes : hachures et tampon |
| `src/components/ui.tsx` | +47 lignes : composant `Switch` |
| `src/app/(site)/page.tsx` | Section `N+07`, renumérotation, alternance des fonds |
| `src/components/shell/Topbar.tsx` | Périmètre du sélecteur, notifications, familles de profils |
| `src/app/(app)/layout.tsx` | Garde de périmètre |
| `src/components/shell/Sidebar.tsx` | Groupe « Contrôle financier », état actif, lien du logo |
| `src/app/connexion/page.tsx` | Troisième famille de profils |
| `src/data/marketing.ts`, `ModuleGrid.tsx`, `SiteHeader.tsx`, `src/data/index.ts` | Module, icône, entrée de menu, export |
| `README.md`, `CLAUDE.md` | Tableaux des modules, arborescence, règle du module |

**19 fichiers, ~2 000 lignes ajoutées.**

### Volume total

**30 fichiers touchés, environ 5 750 lignes ajoutées.**

### Conventions respectées

- Aucun libellé en dur : tout passe par `d.controle.*`, `d.site.finance.*` ou
  `t("controle.…")`.
- Aucun composant du kit recréé ; `Switch` a été ajouté **au kit** plutôt que redéfini
  localement.
- Toutes les dates de démonstration sont relatives (`daysAgo` / `inDays`).
- La police monospace reste réservée aux données : montants, pourcentages, dates,
  références, adresses IP, horodatages.
- Un `DemoTip` par écran, avec argumentaire commercial, en français et en anglais.
- Aucune image externe, aucune police distante.

---

## 19. Scénario de démonstration conseillé

1. **Vitrine** — `/finance`. Montrer l'encart du relevé certifié dans le hero, puis
   descendre jusqu'au cycle du rapport : **laisser la barre s'arrêter à « Vérification »**
   et commenter, avant de cliquer soi-même sur « Publier et notifier » pour faire tomber
   le tampon.
2. **Connexion** — choisir **Nadia Ferrand (Garantie Océan Indien)**.
3. **Écran 1** — parcourir les quatre blocs, puis **cliquer sur l'icône de provenance de
   la ligne « Montant validé »** : origine, mode de calcul, statut « en attente de
   validation », pièce jointe. Montrer ensuite la hachure ambre des encaissements
   acquéreurs et dire la phrase du brief.
4. **Écran 2** — ouvrir le rapport de juin : deux versions, avec le motif de correction.
5. **Écran 3** — les documents partagés, les photos sélectionnées, et **le journal de ses
   propres consultations**.
6. **Changer de profil** → **Yann Vergès (Decatria)** : mêmes écrans, mais trésorerie et
   séquestre affichent « Non partagé ». Un seul document partagé.
7. **Changer de profil** → **Hélène Vitry (Foncière Bourbon Promotion)**.
8. **`/controle/rapports`** — les rappels automatiques, puis **publier le rapport d'août** :
   la fenêtre rappelle les deux points signalés, le tampon tombe, le rapport est figé.
9. **`/controle/acces`** — fermer la commercialisation pour Decatria en un clic, puis
   **révoquer** un accès, et faire défiler le **journal** où apparaissent les
   consultations faites deux minutes plus tôt.
10. **Retour sur Yann Vergès** pour montrer l'écran « Accès clos ».

---

## 20. Vérifications effectuées

- **`npm run build`** : compilation réussie, **37 pages** en rendu statique, TypeScript
  strict sans erreur. Rejoué après chaque modification structurante.
- **`npx tsc --noEmit`** : sans erreur.
- **Parité des dictionnaires** : garantie par le typage `Dict = typeof fr`, vérifiée à
  chaque compilation.
- **Test de fumée HTTP** : `/controle`, `/controle/rapports`, `/controle/justificatifs`,
  `/controle/acces`, `/finance` et `/connexion` répondent toutes en 200.
- **Contrôle du rendu serveur** :
  - `/controle` — les 12 lignes financières, les 8 risques (8 blocs « Mesures
    correctives engagées »), **4 valeurs marquées « Donnée ancienne »** et 29 boutons de
    provenance sont présents dans le HTML ;
  - `/finance` — les 8 natures d'organisme, les 12 lignes fermées du périmètre et les
    13 critères sont présents ;
  - `/` — la section `N+07` est en place, la dernière cote est `N+12`, la mention passe
    bien à « 14 profils métier » ;
  - `/connexion` — les trois profils financiers et leurs organismes sont rendus.

Le contrôle s'arrête là. **La navigation réelle dans un navigateur n'a pas été rejouée** :
les parcours qui dépendent de l'état client — bascule de profil, ouverture d'un panneau
de provenance, publication d'un rapport, révocation d'un accès, remplissage du journal —
ont été vérifiés par lecture du code et par le rendu serveur, **pas manuellement à
l'écran**. Le rendu sur téléphone réel et le parcours au clavier n'ont pas été testés.

---

## 21. Ce qui n'est pas implémenté

- **Aucun envoi réel.** Les notifications de publication, les rappels et les invitations
  affichent un message de confirmation ; il n'y a ni service d'e-mail, ni destinataire.
- **Les exports PDF sont simulés.** « Exporter la synthèse », « Télécharger le rapport »
  et « Exporter le journal » émettent un message et écrivent au journal, mais ne
  produisent aucun fichier.
- **Les adresses IP du journal sont fictives** et l'IP des lignes créées pendant la
  démonstration est constante : sans backend, il n'y a pas d'adresse à relever.
- **L'organisme invité pendant la démonstration n'a pas de compte.** Il apparaît dans la
  liste des accès avec le statut « Invitation envoyée », mais aucun profil de connexion
  n'est créé pour lui : les trois personas financiers sont ceux du jeu de données.
- **Les utilisateurs autorisés ne se modifient pas après coup.** On en saisit un à
  l'invitation ; en ajouter ou en retirer ensuite n'est pas outillé, alors que le §8 le
  prévoit.
- **La date de début d'accès n'est pas modifiable** après l'invitation ; seule la date de
  fin l'est au formulaire.
- **L'expiration d'un accès n'est pas automatique.** La date de fin est affichée et
  stockée, mais rien ne ferme l'accès quand elle est dépassée — il faut révoquer à la main.
- **La fréquence trimestrielle est affichée, pas appliquée.** Elle ne change ni le rythme
  des rappels, ni la période des rapports générés.
- **`prepareReport` ne recompose pas les rubriques.** L'action réactualise le brouillon
  existant ou clone le dernier rapport ; les treize textes sont écrits dans le jeu de
  données, ils ne sont pas générés à partir de l'état courant de l'opération.
- **Les snapshots ne sont pas recalculés.** Les valeurs tracées sont figées dans
  `finance.ts` ; marquer un risque comme maîtrisé ou publier un rapport ne modifie aucun
  montant.
- **Deux opérations seulement disposent d'un tableau de bord.** Le Collège Albany et la
  Villa Horizon renvoient l'état « Aucune synthèse publiée pour cette opération » — c'est
  un choix, mais cela reste une limite du jeu de données.
- **Les photographies de démonstration sont toutes récentes.** Une photo rattachée au
  rapport de juillet affiche une date du jour : les dates du jeu de données sont
  relatives et la banque de photos ne remonte pas plus loin.
- **Pas de signature électronique ni d'horodatage qualifié.** Un rapport « figé » l'est
  dans l'état de l'application, pas au sens probatoire du terme — ce serait une exigence
  à trancher avec un juriste avant mise en production.
- **Pas de notion de devise ni de fuseau.** Tout est en euros et sur l'heure de La
  Réunion, y compris pour l'escrow team de Dubaï.
