# Compte rendu — Vitrine commerciale et page d'accueil

> Implémentation du **16 août 2026**.
> Portée : création d'un site public complet devant la démo — une page d'accueil
> animée et huit pages de rubriques — construit à partir du **document de référence
> produit BuildNivo v2.0**. La démo applicative devient accessible depuis `/connexion`.
> Tout reste en données de démonstration, sans backend.

**Sommaire**

1. [Demande et parti pris](#1-demande-et-parti-pris)
2. [Ce qui change dans la navigation](#2-ce-qui-change-dans-la-navigation)
3. [Direction visuelle de la vitrine](#3-direction-visuelle-de-la-vitrine)
4. [La page d'accueil, section par section](#4-la-page-daccueil-section-par-section)
5. [Les huit pages de rubriques](#5-les-huit-pages-de-rubriques)
6. [Les figures animées](#6-les-figures-animées)
7. [Le système de mouvement](#7-le-système-de-mouvement)
8. [En-tête, pied de page et enveloppe](#8-en-tête-pied-de-page-et-enveloppe)
9. [Données de démonstration ajoutées](#9-données-de-démonstration-ajoutées)
10. [Internationalisation](#10-internationalisation)
11. [Traçabilité : du document de référence au site](#11-traçabilité--du-document-de-référence-au-site)
12. [Accessibilité, responsive, performance](#12-accessibilité-responsive-performance)
13. [Implémentation technique](#13-implémentation-technique)
14. [Retrait de la mention de l'éditeur](#14-retrait-de-la-mention-de-léditeur)
15. [Vérifications effectuées](#15-vérifications-effectuées)
16. [Ce qui n'est pas implémenté](#16-ce-qui-nest-pas-implémenté)

---

## 1. Demande et parti pris

### La demande

Créer une **landing page avant la page de connexion**, puisque BuildNivo est un SaaS,
en s'appuyant sur le document marketing de référence, avec le maximum d'animations,
en anticipant les pages nécessaires aux rubriques de la page de présentation, et en
conservant intégralement l'existant.

### Les cinq décisions de cadrage

| # | Décision | Raison |
|---|---|---|
| 1 | **La vitrine occupe `/`**, la démo démarre sur `/connexion` | Un visiteur qui arrive sur un SaaS doit comprendre le produit avant qu'on lui demande de choisir un profil |
| 2 | **Tout le contenu du document de référence est publié**, y compris la mécanique commerciale et le cloisonnement | Le document est un argumentaire de vente ; ce sont précisément ces pages qui déclenchent les questions en rendez-vous |
| 3 | **Une rubrique = une page**, huit au total | Une page d'accueil unique aurait fait douze écrans de défilement sans point d'entrée pour un rendez-vous ciblé (« montre-moi juste les tarifs ») |
| 4 | **Le mouvement explique le produit**, il ne décore pas | Chaque animation porte une idée du document : les outils qui se rassemblent, les entreprises qui rejoignent le réseau, la barrière qui se ferme |
| 5 | **Aucun écran existant n'est modifié** | Seul le lien de déconnexion de la barre du haut change de cible (`/` → `/connexion`) |

### Le fil narratif retenu

Le chantier est éclaté entre quinze outils → voilà ce que ça coûte → voilà la
plateforme → voilà comment elle se vend → voilà ce qui la rend crédible → voilà le prix.

---

## 2. Ce qui change dans la navigation

### Routes créées

| Route | Contenu | Fichier |
|---|---|---|
| `/` | Page d'accueil, 14 sections | `src/app/(site)/page.tsx` |
| `/produit` | Les deux produits, frontière, mécanique, MVP | `src/app/(site)/produit/page.tsx` |
| `/studios` | Les quatre Studios métier | `src/app/(site)/studios/page.tsx` |
| `/tarifs` | Grille tarifaire et socle gratuit | `src/app/(site)/tarifs/page.tsx` |
| `/ia` | Intelligence artificielle transversale | `src/app/(site)/ia/page.tsx` |
| `/securite` | Cloisonnement des données par rôle | `src/app/(site)/securite/page.tsx` |
| `/supply` | BuildNivo Supply | `src/app/(site)/supply/page.tsx` |
| `/comparatif` | Positionnement concurrentiel | `src/app/(site)/comparatif/page.tsx` |
| `/contact` | Demande de démonstration | `src/app/(site)/contact/page.tsx` |

### Routes déplacées

| Avant | Après | Conséquence |
|---|---|---|
| `src/app/page.tsx` (connexion par persona) | `src/app/connexion/page.tsx` | Déplacement par `git mv` : l'historique du fichier est conservé |

### Modifications de l'existant

- **`src/components/shell/Topbar.tsx`** — le lien « Se déconnecter » du sélecteur de
  profil pointe désormais sur `/connexion` au lieu de `/`.
- **`src/app/connexion/page.tsx`** — l'en-tête gagne un bouton « Retour au site »
  (flèche gauche) et le logo mobile devient cliquable vers `/`. Le reste de la page
  (11 personas, vitrine d'authentification animée, fond blueprint) est intact.
- **`src/app/layout.tsx`** — le titre par défaut devient la tagline, la description
  est réécrite pour un usage public, et un `template: "%s"` permet aux pages de
  rubrique de porter leur propre titre.

### Titres de page

Chaque rubrique reçoit un `layout.tsx` serveur minimal qui n'exporte que ses
métadonnées (`title`, `description`) et retourne ses enfants. C'est le seul moyen de
donner un titre d'onglet à une page cliente. Huit fichiers de dix lignes.

| Route | Titre d'onglet |
|---|---|
| `/produit` | Les deux produits — BuildNivo |
| `/studios` | Studios métier — BuildNivo |
| `/tarifs` | Tarifs — BuildNivo |
| `/ia` | Intelligence artificielle — BuildNivo |
| `/securite` | Cloisonnement des données — BuildNivo |
| `/supply` | BuildNivo Supply — BuildNivo |
| `/comparatif` | Comparatif — BuildNivo |
| `/contact` | Contact — BuildNivo |

---

## 3. Direction visuelle de la vitrine

Le site public ne doit pas ressembler à un autre produit que l'application : mêmes
jetons de couleur OKLCH, même Archivo, même JetBrains Mono pour les données, même kit
de composants. Trois partis pris propres à la vitrine ont été ajoutés.

### 3.1 L'alternance bleu / papier

Chaque page ouvre sur un aplat `site-drench` : la trame blanche du panneau de connexion
posée sur le bleu de marque, plus deux halos radiaux qui donnent la profondeur. Le corps
de page alterne ensuite `paper` et `card`, et les moments forts reviennent au bleu.

| Section de l'accueil | Fond |
|---|---|
| Hero | bleu drenché |
| Problème | papier |
| Vision & marché | carte (bande blanche bordée) |
| Modules | papier |
| Empilement | carte |
| Mécanique de marché | papier |
| **Intelligence artificielle** | **bleu drenché** |
| Cloisonnement | papier |
| Supply | carte |
| Comparatif | papier |
| Tarifs | carte |
| Preuves | papier |
| FAQ | carte |
| **Appel à l'action final** | **bleu drenché** |
| Pied de page | bleu drenché |

L'en-tête est transparent au sommet (texte blanc, logo blanc) et devient une carte
blanche translucide avec filet dès 24 px de défilement. C'est ce qui permet au hero
bleu de démarrer sous l'en-tête : le contenu principal porte une marge négative de
64 px, exactement la hauteur de la barre.

### 3.2 Le repère de niveau

Les sections ne sont pas numérotées « 01 / 02 / 03 » comme partout ailleurs : elles
portent une **cote d'altitude de plan d'architecte** — un filet horizontal, un triangle
plein, et la cote `N+00` à `N+11`.

Le choix n'est pas décoratif : le produit s'appelle BuildNivo, la marque est faite de
trois barres montantes, et l'offre commerciale s'empile littéralement en trois niveaux
(Project → Company → Studios). Le vocabulaire est donc cohérent du logo à l'offre en
passant par le repérage des sections. Composants : `LevelMark` et `Eyebrow`.

Un **filet de cote** (`DimensionRule`) sépare la section problème de la section vision,
avec l'étiquette centrée entre deux traits — la ligne de cotation d'un plan.

### 3.3 La signature

Le mur d'outils du hero qui se rassemble en une seule plateforme. C'est le seul endroit
où l'on dépense de l'effet ; tout le reste du site est discipliné. La règle appliquée :
une seule séquence orchestrée par page, le reste se déclenche à l'entrée dans l'écran.

---

## 4. La page d'accueil, section par section

Quatorze sections, dont douze cotées `N+00` à `N+11`.

### 4.1 Hero — l'accroche

- **Titre en deux temps** : « Le BTP a des millions d'outils. » en blanc à 55 %
  d'opacité, puis « Il ne vous en faut qu'un. » en pleine opacité, révélés à 90 ms
  d'intervalle. La hiérarchie typographique porte le renversement de sens.
- **Chapô** : la plateforme relie tous les acteurs autour d'une source unique de vérité,
  de la conception jusqu'au SAV.
- **Deux appels à l'action** : « Ouvrir la démo interactive » (vers `/connexion`) et
  « Comment ça marche » (vers `/produit`).
- **Mention de confiance** : « Démo sans inscription · 11 profils métier · données factices ».
- **Trois compteurs** : 14 outils non connectés · 11 profils métier · ∞ intervenants
  invités gratuitement.
- **Figure** : `ToolConvergence` (section 6.1).
- **Indicateur de défilement** : un trait vertical qui descend en boucle.

### 4.2 `N+00` Le problème

Le bandeau défilant des seize outils remplacés, puis **huit cartes de coût**, chacune
avec une icône ambre — les pertes d'informations, les erreurs de version, les doubles
saisies, les oublis de relance, les décisions qui circulent mal, les retards détectés
trop tard, les dépassements budgétaires, les acquéreurs mal informés.

La section se referme sur un encart bleu « La réponse de BuildNivo » : une seule
plateforme où la donnée est saisie une fois, sur le terrain, puis réutilisée par tous
les métiers avec les droits de chacun.

### 4.3 `N+01` Vision et marché

- Ce que BuildNivo **n'est pas** : ni une pointeuse, ni un ERP de plus, ni une GED isolée.
- Ce qu'il est **à la fois** : six puces — plateforme collaborative, ERP métier, cloud
  documentaire, moteur d'automatisation, plateforme IA, réseau professionnel.
- **Quatre compteurs de marché** : 8–12 Mds $ de marché mondial, ~10 % de croissance
  annuelle, 78 % du revenu récurrent d'un leader provenant de clients multi-produits,
  52 % de clients utilisant au moins six produits. Une note rappelle que les études du
  secteur n'incluent pas les mêmes catégories de logiciels.
- **Zone de lancement** : France et Outre-mer en puces validées, puis Maurice, Émirats,
  Afrique francophone et Portugal en ambitions à moyen terme.

### 4.4 `N+02` Couverture

Les 18 modules de la démo, filtrables par pôle (Terrain, Gestion, Intelligence,
Collaboration). Chaque carte ouvre l'écran correspondant dans la démo : la vitrine et
le produit ne sont pas deux mondes séparés.

### 4.5 `N+03` L'empilement

La figure `LevelStack` (section 6.3), puis **la règle de conception** en deux encarts
opposés — vert pour le gratuit, bleu pour le payant :

> La donnée appartient au fonctionnement collectif d'un Project auquel l'entreprise est
> invitée ? Accès Project gratuit.
> La fonctionnalité permet à l'entreprise de gérer sa propre activité indépendamment de
> ce Project ? Fonctionnalité Company.

Puis le **tableau de la frontière**, cinq cas concrets sur l'opération ARTEMIS :

| Sur le chantier (gratuit) | Au niveau de l'entreprise (payant) |
|---|---|
| Pointage sur l'opération ARTEMIS | Pointage consolidé ARTEMIS + autres chantiers |
| Documents demandés pour ARTEMIS | GED générale de l'entreprise |
| Tâches reçues sur ARTEMIS | Organisation interne des équipes |
| Avancement du lot sur ARTEMIS | Analyse de productivité globale |
| Fournitures nécessaires au suivi collectif | Achats, fournisseurs et stocks |

### 4.6 `N+04` La mécanique de marché

Le schéma du réseau (`NetworkEffect`, section 6.4) face aux **quatre étapes** : le
porteur crée l'opération, il invite tous les intervenants, chaque entreprise reçoit
30 jours de Company, et à J+30 rien ne casse sur le chantier.

Puis le **curseur temporel de l'essai** (`TrialTimeline`, section 6.5) et les **trois
états** d'une entreprise : Project Member, Company Trial, Company Subscriber / Free
Project Member.

### 4.7 `N+05` Intelligence artificielle *(fond bleu)*

La démonstration de dictée (`DictationDemo`, section 6.6), les **six capacités** en
cartes translucides, et la **bande de gouvernance** : périmètre limité aux droits de
l'utilisateur, validation humaine, sources citées, accès exceptionnels journalisés.

### 4.8 `N+06` Cloisonnement

L'explorateur des trois barrières (`BarrierMatrix`, section 6.7) et un lien vers la
page dédiée.

### 4.9 `N+07` Supply

Le trajet d'une fourniture en cinq étapes et les trois scénarios comparés
(`SupplyFlow`, section 6.8).

### 4.10 `N+08` Comparatif

La matrice 6 acteurs × 6 critères (`CompareGrid`, section 6.9), suivie de l'encart
« L'angle mort » : aucun acteur ne combine hub de projet gratuit, ERP et CRM internes,
et logique de réseau.

### 4.11 `N+09` Tarifs

Les quatre offres en cartes (`PricingCards`, section 6.10) et un lien vers le socle
gratuit détaillé.

### 4.12 `N+10` Preuves

Trois mises en situation signées **explicitement** « Mise en situation » (badge en haut
à droite de chaque carte), portées par des sociétés déjà présentes dans la démo :
Foncière Bourbon Promotion, Bâtir Océan Indien, Cap Sud Maîtrise d'Œuvre. Puis trois
repères : 20–300 salariés, 790 € HT/mois, 30 jours d'essai.

### 4.13 `N+11` Questions fréquentes

Huit questions en accordéon (section 6.12).

### 4.14 Appel à l'action final *(fond bleu)*

« Voyez la plateforme avant d'en parler » — démo ou démonstration commentée, avec le
rappel que les données sont factices et traitées uniquement dans le navigateur.

---

## 5. Les huit pages de rubriques

Chaque page ouvre sur un `PageHero` bleu (repère, titre, chapô, encart latéral chiffré)
et se termine par le même bandeau `FinalCta`.

### 5.1 `/produit` — Les deux produits

| Section | Contenu |
|---|---|
| Hero | Deux chiffres : 790 € par opération active, 30 jours d'essai. Encart sur le pointage comme fonction Project à part entière |
| Empilement | `LevelStack`, règle de conception, tableau de la frontière |
| Mécanique | `NetworkEffect`, quatre étapes, **exemple chiffré** (25 salariés sur ARTEMIS gratuits, 120 salariés multi-chantiers payants), `TrialTimeline`, trois états, encart « utilisation contractualisable » |
| Continuité | `GraceTimeline` : J0 échec de paiement, J0–J15 lecture seule et export, J15 verrouillage, données conservées. Note sur la norme Afnor NF P 03-001 |
| Feuille de route | Neuf éléments du noyau MVP, sept principes techniques en puces, **deux jauges de difficulté** (produit complet 9/10, MVP 7/10) et le rappel que la vraie difficulté est l'adoption terrain |

### 5.2 `/studios` — Studios métier

Les quatre Studios en cartes (28 fonctions au total), l'encart de dépendance à Company
Essential ou Business, l'absence assumée de hiérarchie entre les Studios, puis un rappel
de l'empilement complet.

### 5.3 `/tarifs` — Tarifs

Les quatre offres, l'opération active supplémentaire à 299 €, le **tableau du socle
gratuit permanent** (11 lignes, statut et condition), la note sur le compte rendu
hebdomadaire gratuit, et l'accordéon des questions fréquentes.

### 5.4 `/ia` — Intelligence artificielle

Gouvernance mise en avant dès le hero, démonstration de dictée, les six capacités
numérotées, et la section architecture : pas de modèle propriétaire entraîné dès le
départ, mais API de modèles de langage, RAG, transcription, OCR, règles métier et
moteur d'automatisation.

### 5.5 `/securite` — Cloisonnement des données

La page la plus dense, parce que c'est la section du document qui décide de l'adoption.

| Section | Contenu |
|---|---|
| Hero | Les trois barrières résumées en trois encarts |
| Explorateur | `BarrierMatrix` : 9 rôles × 3 barrières, avec simulation d'alerte incident |
| Trois tableaux complets | Un par barrière, 9 rôles × 3 colonnes, avec le principe rédigé en dessous |
| Classification | Standard / Confidentiel coché à Standard par défaut, reclassification réservée au promoteur et à la maîtrise d'œuvre |
| Alerte incident | Trois cartes : niveaux de gravité, destinataires proposés, contenu envoyé — et le rappel qu'aucune alerte anonyme n'est possible |

### 5.6 `/supply` — BuildNivo Supply

Le trajet en cinq étapes, les trois scénarios chiffrés, le rôle du partenaire sourcing,
et l'encart de neutralité : le moteur pourra intégrer d'autres fournisseurs, fabricants
et pays. Un lien ouvre l'écran Achats de la démo.

### 5.7 `/comparatif` — Positionnement

La matrice de couverture, l'angle mort, et les **neuf leviers de différenciation** en
cartes à puce verte.

### 5.8 `/contact` — Demande de démonstration

- **Formulaire** : nom, entreprise, rôle, taille (menu à trois choix), e-mail,
  téléphone, contexte libre. Validation HTML native sur les champs obligatoires.
- **Envoi simulé** : état « Envoi… » pendant 700 ms, puis panneau de confirmation qui
  dit explicitement que la demande n'est envoyée nulle part et que rien ne quitte le
  navigateur. Un bouton permet de revenir au formulaire.
- **Trois canaux** : démonstration commentée de 45 minutes, téléphone (8h–17h heure de
  La Réunion), e-mail sous un jour ouvré.
- **Quatre étapes** de la suite : premier échange, cadrage, chantier pilote, déploiement.

---

## 6. Les figures animées

Toutes vivent dans `src/components/site/figures/`.

### 6.1 `ToolConvergence` — la signature du hero

- **14 puces d'outils** positionnées en pourcentage, chacune avec son inclinaison, sa
  durée de flottement (6,8 à 9,3 s) et son retard propre : le mur ne respire jamais en
  cadence, ce qui évite l'effet mécanique.
- **Convergence automatique à 2,8 s** : les puces glissent vers le centre, se floutent
  et disparaissent, avec 45 ms de décalage entre chacune.
- **14 traits SVG** se tracent simultanément depuis chaque position vers le centre
  (`draw-stroke`, épaisseur non mise à l'échelle).
- **La carte plateforme** apparaît à 620 ms : marque, compteur « 1 », quatre lignes de
  modules qui se posent une à une, et la légende « Les outils d'une opération, rassemblés ».
- **Halo** en fondu lent derrière la carte.
- **Contrôle manuel** : un bouton « Rassembler / Disperser » rejoue la scène à volonté,
  et la légende affiche `14 → 1`.
- En mouvement réduit, la scène s'ouvre directement rassemblée.

### 6.2 `ToolMarquee` — ce que ça remplace

Seize outils sur deux rangs qui défilent en sens inverse (52 s et 62 s), masque de
dégradé sur les bords, pause au survol. Chaque puce porte une croix rouge discrète.

### 6.3 `LevelStack` — l'empilement

Trois niveaux empilés de bas en haut (`flex-col-reverse`), cotés `N+00`, `N+01`, `N+02`.
La barre verticale de chaque niveau reprend le rythme de la marque — court, haut, moyen.
Le survol, le focus clavier et le clic sélectionnent un niveau ; les niveaux inactifs
reculent de 12 px sur grand écran. Le panneau de droite se recompose (`pop-in`) avec le
badge, le prix, le texte et les fonctions listées en cascade de 35 ms.

### 6.4 `NetworkEffect` — l'effet réseau

24 entreprises réparties sur deux anneaux (9 puis 15) autour du porteur d'opération, qui
porte la marque BuildNivo dessinée en SVG. Les nœuds apparaissent un à un toutes les
110 ms quand la figure entre à l'écran, chacun relié au centre. **Cinq nœuds sont
cerclés de vert** : les entreprises qui ont souscrit Company. Deux cercles en pointillés
tournent lentement autour du centre pour figurer la donnée qui remonte. Le compteur
affiche `1 → n` en direct.

### 6.5 `TrialTimeline` — l'essai de 30 jours, manipulable

- Un rail de 0 à 45 jours avec la borne J+30 marquée d'un trait et d'une étiquette.
- **Lecture automatique** de J0 à J+38 en 4,2 s à l'entrée dans l'écran, puis la main
  passe à l'utilisateur : dès qu'il touche le curseur, l'animation ne reprend plus.
- Le curseur natif est transparent et posé au-dessus du rail dessiné : il porte le
  clavier et le glissement, le rail porte le style. Le focus clavier allume un anneau.
- **Deux colonnes** : six fonctions Project qui restent ouvertes (cadenas ouvert, vert),
  six fonctions Company qui se barrent et se cadenassent dès que le curseur dépasse
  J+30. Le libellé de la colonne bascule de « Company Trial » à « Company Subscriber /
  Free Project Member ».

### 6.6 `GraceTimeline` — la continuité de service

Trois étapes reliées par un filet vertical qui se remplit en 1,8 s, pastilles ambre puis
rouge, et la note sur le délai de 15 jours du BTP.

### 6.7 `DictationDemo` — la démonstration clé de l'IA

- **Panneau gauche, le terrain** : minuterie d'enregistrement, onde vocale de 22 barres
  animées avec des durées et retards désynchronisés, transcription frappée caractère par
  caractère (24 ms) avec un curseur clignotant, puis un chronomètre figé à 00:07 et
  l'onde qui retombe.
- **Panneau droit, la plateforme** : les cinq actions structurées se déposent une à une
  toutes les 340 ms — anomalie, risque planning, avancement, demande d'achat, entrées de
  journal — chacune avec son icône, son ton et son détail.
- **La validation reste humaine** : le bouton « Valider les actions » n'est actif
  qu'une fois les cinq actions proposées ; il passe alors au vert, coche chaque ligne et
  affiche « Actions validées et diffusées ».
- **Rejouer la dictée** remet la scène à zéro.
- La phrase et les cinq actions viennent de `src/data/ai.ts`, **le même jeu de données
  que l'écran Copilote de la démo** : la vitrine et le produit racontent exactement la
  même histoire (absence PLOMB'ÉO, cloisons R+2, rails de la commande CMD-2026-118).

### 6.8 `BarrierMatrix` — les trois barrières, rôle par rôle

- **9 rôles** sélectionnables : promoteur, maîtrise d'œuvre, entreprise, chef de
  chantier, architecte/BET, fournisseur, banque/investisseur, acquéreur, gestionnaire SAV.
- **3 barrières × 3 colonnes**, soit 81 combinaisons couvertes.
- Chaque ligne est un **volet coulissant** : le panneau teinté se retire quand l'accès
  s'ouvre (500 ms). Cinq niveaux : Complet (bleu, œil), Agrégé (violet, sigma), Urgence
  (ambre, bouclier), Aucun (gris, cadenas), Sans objet.
- **Le bris de glace** : un bouton « Simuler une alerte incident » ouvre les accès
  d'urgence — ils passent à « Complet · Urgence » — et fait apparaître **la ligne
  d'audit horodatée** avec le rôle et la gravité. Les deux vont toujours ensemble :
  c'est le principe du document.

### 6.9 `BarrierTable` — le tableau complet

Le même contenu en tableau exhaustif, une page par barrière sur `/securite`.

### 6.10 `SupplyFlow` — le trajet d'une fourniture

Cinq étapes numérotées qui s'allument toutes les 780 ms, avec les connecteurs qui se
tracent entre elles ; le texte de l'étape courante se recompose en dessous ; un clic
fige l'étape choisie. En bas, les trois scénarios avec leurs barres d'indice de coût
qui se déploient en 1,2 s (base 100 = achat local) : local 6 j / 100, mixte 21 j / 79,
import 38 j / 62. Une mention rappelle que ce sont des ordres de grandeur de démonstration.

### 6.11 `CompareGrid` — la matrice concurrentielle

Six acteurs en lignes, six critères en colonnes, 36 marques qui apparaissent en diagonale
(90 ms par ligne, 45 ms par colonne). La ligne BuildNivo est teintée en bleu. Trois
marques : couvert (rond bleu plein), partiel (pastille), absent (tiret). Légende sous le
tableau, défilement horizontal sur petit écran.

### 6.12 `PricingCards` et `FreeTierTable`

Quatre offres ; les prix se composent au chargement (compteur de 1,1 s) ; l'offre Project
est surélevée et ombrée ; un encart chiffre l'opération supplémentaire. Le tableau du
socle gratuit distingue 7 fonctions gratuites (pastille verte) de 4 fonctions Company
(cadenas gris).

### 6.13 `FaqAccordion`, `StudioCards`, `ModuleGrid`

- **FAQ** : ouverture par transition de grille (`0fr → 1fr`), donc hauteur fluide sans
  mesure JavaScript ; le « + » pivote de 45° et se remplit de bleu.
- **Studios** : quatre cartes qui se soulèvent au survol, l'icône s'inverse et les
  puces de fonctions se teintent en violet en cascade.
- **Modules** : filtre par pôle avec les onglets du kit applicatif, cartes qui se
  soulèvent, flèche qui apparaît, cascade d'entrée plafonnée à huit pas pour éviter
  qu'un module en bas de grille attende trop longtemps.

---

## 7. Le système de mouvement

### 7.1 Les trois règles

1. **Une animation = une idée.** Rien ne bouge pour décorer.
2. **Les révélations passent par des transitions, jamais par des animations.** Quand
   `prefers-reduced-motion` écrase les durées, une transition atteint quand même son
   état final ; une animation `both` cachée resterait invisible sur certains moteurs.
3. **Une seule séquence orchestrée par page** — le hero. Le reste se déclenche à
   l'entrée dans l'écran.

### 7.2 La boîte à outils (`src/components/site/motion.tsx`)

| Export | Rôle |
|---|---|
| `useReducedMotion()` | Écoute la préférence système et réagit à ses changements |
| `useInView()` | Entrée dans le viewport, une seule fois par défaut ; **si `IntersectionObserver` est absent, le contenu s'affiche** plutôt que de rester caché |
| `useScrollProgress()` | Progression 0→1 de la traversée d'un élément (disponible, pas encore utilisé) |
| `Reveal` | Révélation avec retard, quatre directions (haut, gauche, droite, échelle) |
| `Stagger` | Cascade automatique sur les enfants directs, avec classe d'enveloppe pour les grilles étirées |
| `CountUp` | Compteur en ease-out exponentiel, démarre à l'entrée dans l'écran, saute à la valeur finale en mouvement réduit |
| `Marquee` | Bandeau défilant, contenu dupliqué pour une boucle sans couture, pause au survol |
| `useTypewriter` | Frappe caractère par caractère, avec remise à zéro |

### 7.3 Les animations CSS ajoutées (`globals.css`, +223 lignes)

| Nom | Usage |
|---|---|
| `tool-drift` | Flottement des puces d'outils, amplitude et inclinaison par puce |
| `marquee` | Bandeau défilant |
| `draw-stroke` | Tracé d'un trait technique |
| `dash-flow` | Pointillé qui circule (la donnée qui remonte) |
| `node-ring` | Onde d'un nœud du réseau |
| `pop-in` | Apparition d'une carte produite par l'IA |
| `wave-bar` | Onde vocale de la dictée |
| `sheen` | Reflet qui balaie le bouton principal au survol |
| `soft-glow` | Halo lent derrière la plateforme |
| `scroll-hint` | Indicateur de défilement du hero |

Plus les classes utilitaires `.site-drench` (l'aplat bleu à trame et halos), `.reveal`
avec ses trois variantes, `.marquee-mask` et `.paper-grid`.

Le bloc `@media (prefers-reduced-motion: reduce)` existant continue de tout neutraliser.

---

## 8. En-tête, pied de page et enveloppe

### 8.1 `SiteHeader`

- **Lien d'évitement** « Aller au contenu » en première position, visible au focus.
- **Menu « Plateforme »** : quatre entrées avec icône et phrase d'explication (produit,
  IA, cloisonnement, Supply). S'ouvre au survol **et** au clic, se ferme au clic
  extérieur ou à Échap, `aria-expanded` tenu à jour.
- **Quatre liens directs** : Studios, Tarifs, Comparatif, Contact — avec un souligné qui
  se déploie depuis la gauche sur la page courante.
- **Sélecteur de langue** du kit applicatif, réutilisé tel quel.
- **Bouton « Ouvrir la démo »**, blanc sur le hero bleu, bleu une fois l'en-tête solidifié.
- **Menu mobile** en panneau plein écran sous la barre, entrées en cascade de 40 ms,
  défilement du corps bloqué à l'ouverture, fermeture automatique au changement de page.

### 8.2 `SiteFooter`

Quatre colonnes : marque et tagline, « Produit », « Ressources », et un appel à la démo.
En bas, une barre de mentions : copyright, rappel que toutes les données sont factices,
et la mention légale de l'éditeur (voir section 14).

### 8.3 `src/app/(site)/layout.tsx`

Enveloppe commune : en-tête collant, `<main id="contenu">` avec la marge négative de
64 px, pied de page. Six lignes de code utile.

---

## 9. Données de démonstration ajoutées

Tout est dans `src/data/marketing.ts` (467 lignes), exporté par `src/data/index.ts`.
Le fichier ne contient **que de la structure** — identifiants, positions, prix, matrices.
Les libellés vivent dans les dictionnaires.

| Jeu de données | Volume | Détail |
|---|---|---|
| `scatterTools` | 14 | Outils du hero avec position, inclinaison, durée, retard |
| `replacedTools` | 16 | Outils du bandeau défilant |
| `keyFigures` | 17 valeurs | Marché, prix, durées, cibles, difficulté |
| `siteModules` | 18 | Modules avec pôle et lien vers l'écran de démo |
| `modulePoles` | 4 | Terrain, Gestion, Intelligence, Collaboration |
| `productLevels` | 3 | Project (10 fonctions), Company (11), Studios (4) |
| `companyStates` | 3 | Member, Trial, Subscriber |
| `frontierRows` | 5 | Cas de la frontière Project / Company |
| `graceSteps` | 3 | J0, J0–J15, J15 |
| `freeTierRows` | 11 | 7 gratuites, 4 payantes |
| `plans` | 4 | Project 790 €, Essential 99 €, Business 299 €, Studio 99 € |
| `rbacRoles` | 9 | Rôles du cloisonnement |
| `rbacBarriers` | 3 × 3 × 9 | 81 niveaux d'accès explicités |
| `alertSeverities` / `alertRecipients` | 3 + 3 | Gravités et destinataires d'une alerte incident |
| `studios` | 4 | 28 fonctions cumulées |
| `aiCapabilities` / `aiGovernance` | 6 + 4 | Capacités et principes de gouvernance |
| `supplySteps` / `supplyScenarios` | 5 + 3 | Trajet et scénarios chiffrés |
| `compareCriteria` / `competitors` | 6 + 6 | 36 cellules de couverture |
| `differentiators` | 9 | Leviers de différenciation |
| `mvpCore` / `techPrinciples` | 9 + 7 | Noyau MVP et principes techniques |
| `faqItemsSite` | 8 | Questions fréquentes |
| `testimonials` | 3 | Mises en situation, sociétés existantes de la démo |
| `contactChannels` / `demoSteps` | 3 + 4 | Canaux et suite de la relation |
| `launchZones` / `nextZones` | 2 + 4 | Zone de lancement et ambitions |

### Les valeurs de la matrice de cloisonnement

Extraites du document et transposées en cinq niveaux : `full`, `aggregate`, `urgent`,
`none`, `na`. Trois lectures notables, reprises telles quelles du document :

- **Personne d'autre que l'employeur** ne voit le nom d'un ouvrier — sauf alerte
  sécurité, et l'accès est alors journalisé.
- **Banque et investisseur** n'ont accès qu'à une vision financière agrégée : ils
  débloquent des fonds par palier, ils n'ont pas besoin du détail marché par marché.
- **Les documents généraux sont ouverts largement** : c'est le document qui est évalué,
  pas le rôle qui est bloqué.

### Cohérence avec l'existant

Les mises en situation utilisent des sociétés déjà présentes dans la démo, et la
démonstration de dictée réutilise le jeu de données du Copilote. Aucune nouvelle
histoire n'a été inventée là où une histoire existait déjà.

---

## 10. Internationalisation

Une section `site` a été ajoutée aux deux dictionnaires : **744 lignes et environ
648 chaînes par langue**, soit près de 1 300 libellés traduits. Le typage
`Dict = typeof fr` impose la parité : une clé manquante en anglais casse le build.

| Bloc | Contenu |
|---|---|
| `site.nav` | Navigation, menu, libellés d'accessibilité |
| `site.common` | Vocabulaire partagé, niveaux d'accès et leurs explications, mentions de démo |
| `site.hero` | Accroche, appels à l'action, compteurs |
| `site.tools` | Les seize outils remplacés |
| `site.problem` | Huit coûts de la dispersion et la réponse |
| `site.vision` | Vision, marché, zones |
| `site.modules` | 18 modules × (nom + description) et les quatre pôles |
| `site.stack` | Trois niveaux, 25 fonctions, règle de conception, frontière |
| `site.growth` | Mécanique, essai, trois états, exemple, continuité de service |
| `site.ai` | Démonstration, six capacités, gouvernance, architecture |
| `site.rbac` | Trois barrières, neuf colonnes, neuf rôles, principes, alertes |
| `site.supply` | Cinq étapes, trois scénarios, partenaire, neutralité |
| `site.studiosSection` | Quatre Studios et leurs 28 fonctions |
| `site.compare` | Six critères, six acteurs, angle mort, neuf différenciateurs |
| `site.pricing` | Quatre offres, 33 fonctions, socle gratuit (11 lignes × 2 champs) |
| `site.mvp` | Noyau, principes techniques, difficulté |
| `site.proof`, `site.faq`, `site.cta`, `site.contact`, `site.footer` | Preuves, 8 questions, appels à l'action, formulaire, pied de page |

Les données métier (noms de sociétés, références de commande, citations) restent en
français, conformément à la convention du projet.

---

## 11. Traçabilité : du document de référence au site

| Section du document v2.0 | Où elle apparaît |
|---|---|
| 1. Vision produit | Accueil `N+01` |
| 2. Marché et opportunité | Accueil `N+01` (quatre compteurs et note de prudence) |
| 3. Architecture commerciale (Project / Company / Studios) | Accueil `N+03` et toute la page `/produit` |
| 3.x Frontière fonctionnelle | Tableau des cinq cas, accueil et `/produit` |
| 3.x Essai 30 jours et trois états | `TrialTimeline` + cartes d'état |
| 3.x Continuité de service en cas d'impayé | `GraceTimeline` sur `/produit` |
| 4. Cloisonnement des données par rôle | Accueil `N+06` et page `/securite` entière |
| 4.x Classification des documents | `/securite`, section dédiée |
| 4.x Alertes incident manuelles | `/securite`, trois cartes |
| 5. Grille tarifaire et socle gratuit | Accueil `N+09` et page `/tarifs` |
| 6. Studios métier | Accueil `N+03` et page `/studios` |
| 7. Supply et partenaire sourcing | Accueil `N+07` et page `/supply` |
| 8. Intelligence artificielle transversale | Accueil `N+05` et page `/ia` |
| 9. Différenciation concurrentielle | Accueil `N+08` et page `/comparatif` |
| 10. Architecture technique — priorités MVP | `/produit`, section feuille de route |
| 11. Décisions produit et questions ouvertes | Repris en arguments dans les notes et la FAQ ; les questions encore ouvertes ne sont pas publiées |

Les seuls éléments du document volontairement **non publiés** : les questions ouvertes
adressées à l'équipe technique et à la direction (prix de lancement à définir, ordre de
priorité des Studios, durée exacte de rétention, garde-fou anti-réinscription). Ils
relèvent de l'interne.

---

## 12. Accessibilité, responsive, performance

### Accessibilité

- Lien d'évitement en tête de page.
- `aria-expanded` sur le menu Plateforme, le menu mobile et l'accordéon ; `aria-pressed`
  sur les sélecteurs de rôle, de niveau et d'étape ; `aria-label` sur le curseur temporel.
- Le curseur de l'essai est un `input[type=range]` natif : accessible au clavier, avec un
  anneau de focus reporté sur la pastille dessinée.
- Toutes les figures décoratives sont `aria-hidden`; le schéma du réseau porte un
  `role="img"` et son libellé.
- Contrastes : texte blanc sur bleu de marque, encre sur papier — mêmes valeurs que
  l'application, déjà calibrées pour une lecture en plein jour.
- `prefers-reduced-motion` respecté : les scènes s'ouvrent dans leur état final.

### Responsive

- Grilles en 1 / 2 / 3 / 4 colonnes selon la largeur, cartes étirées à hauteur égale.
- Les cinq tableaux (frontière, socle gratuit, comparatif, trois matrices RBAC) défilent
  horizontalement dans leur propre conteneur : le corps de page ne défile jamais latéralement.
- Le hero passe en une colonne, la figure des outils sous le texte, et le bloc de
  compteurs reste sur trois colonnes serrées.
- Menu mobile plein écran en dessous de 1024 px.

### Performance

- Aucune dépendance ajoutée : tout est fait avec React, Tailwind v4 et `lucide-react`,
  déjà présents.
- Aucune image : les figures sont du SVG et du CSS, la démo reste utilisable hors ligne.
- Les animations portent sur `transform` et `opacity` ; les observateurs se déconnectent
  après le premier déclenchement.

---

## 13. Implémentation technique

### Fichiers créés

| Fichier | Lignes | Rôle |
|---|---|---|
| `src/data/marketing.ts` | 467 | Structure de toutes les rubriques |
| `src/components/site/motion.tsx` | 268 | Boîte à outils de mouvement |
| `src/components/site/kit.tsx` | 290 | `LevelMark`, `Eyebrow`, `SiteSection`, `SectionHeading`, `CtaLink`, `Chip`, `StatBlock`, `DimensionRule`, `FinalCta`, `PageHero` |
| `src/components/site/SiteHeader.tsx` | 227 | En-tête collant, menu, drawer mobile |
| `src/components/site/SiteFooter.tsx` | 91 | Pied de page |
| `src/components/site/figures/*.tsx` | 13 fichiers, 1 657 | Les figures animées |
| `src/app/(site)/layout.tsx` | 18 | Enveloppe de la vitrine |
| `src/app/(site)/page.tsx` | 537 | Page d'accueil |
| `src/app/(site)/<rubrique>/page.tsx` | 8 fichiers, 888 | Les rubriques |
| `src/app/(site)/<rubrique>/layout.tsx` | 8 fichiers, 80 | Métadonnées |

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/app/globals.css` | +223 lignes : 10 animations et les utilitaires de la vitrine |
| `src/lib/i18n/fr.ts` | +746 lignes : section `site` |
| `src/lib/i18n/en.ts` | +745 lignes : miroir anglais |
| `src/app/layout.tsx` | Titre, description, gabarit de titre |
| `src/data/index.ts` | Export de `marketing.ts` |
| `src/components/shell/Topbar.tsx` | Déconnexion vers `/connexion` |
| `src/app/connexion/page.tsx` | Retour au site, logo cliquable |
| `README.md`, `DESIGN.md`, `CLAUDE.md` | Documentation de la vitrine, du système de mouvement et de la nouvelle arborescence |

### Volume total

**56 fichiers touchés, environ 9 990 lignes ajoutées** sur le commit
`caa4928 — La vitrine commerciale s'ouvre avant la connexion` (dont une part de
documents HTML déjà présents dans le dossier `documentation/`, versionnés au passage
mais étrangers à cette implémentation).

### Conventions respectées

- Aucun libellé en dur : tout passe par `d.site.*` ou `t("site.…")`.
- Aucun composant du kit applicatif recréé : `Tabs`, `Avatar`, `Button`,
  `LanguageSelect`, `Logo` et `LogoMark` sont réutilisés tels quels.
- Les jetons de couleur d'état (ambre, vert, rouge, violet) ne servent qu'à porter un
  état, jamais à décorer.
- La police monospace reste réservée aux données : prix, délais, indices, compteurs,
  cotes de niveau.
- Aucune image externe, aucune police distante.

---

## 14. Retrait de la mention de l'éditeur

Commit `18cabc0 — L'éditeur se retire du discours commercial`.

| Emplacement | Avant | Après |
|---|---|---|
| Badge du hero | « Blue Valoris FZCO — version 2.0 » | « Plateforme de pilotage d'opération — version 2.0 » |
| Chapô des tarifs | « Facturation portée par Blue Valoris FZCO (Émirats arabes unis) » | « Prix hors taxes, par mois. Sans engagement de durée ni frais de mise en service. » |
| Page Supply | « BlueFulfill, partenaire sourcing **du groupe Blue Valoris** » | « BlueFulfill, partenaire sourcing spécialisé dans l'import depuis la Chine » |
| Note de source | « … v2.0 — Blue Valoris FZCO » | « … v2.0 » |
| Ligne mono du pied de page | « BLUE VALORIS FZCO » | « VERSION 2.0 » |
| Copyright | « © 2026 Blue Valoris FZCO » | « © 2026 BuildNivo » |
| Mention « usage interne » | présente en pied de page | supprimée du site public |

**Ce qui reste** : une seule ligne, en bas du pied de page, en 10,5 px à 35 % d'opacité —
« Édité et facturé par Blue Valoris FZCO — Émirats arabes unis » (et son miroir anglais).

---

## 15. Vérifications effectuées

- **`npm run build`** : compilation réussie, toutes les pages de la vitrine en rendu
  statique, TypeScript strict sans erreur. Ce build a été lancé avant la réécriture des
  libellés de la section 14 ; depuis, seul **`npx tsc --noEmit`** a été rejoué, sans erreur.
- **Parité des dictionnaires** : garantie par le typage, vérifiée à chaque compilation.
- **Test de fumée HTTP** sur le serveur de production : les onze routes vérifiées
  (`/`, les huit rubriques, `/connexion`, `/dashboard`) répondent toutes en 200.
- **Contrôle du rendu serveur** de la page d'accueil : le texte attendu est présent dans
  le HTML — accroche, chapô, outils, sections, compteurs.

Le contrôle s'arrête là. **La navigation réelle dans un navigateur n'a pas été rejouée** :
ni le parcours au clavier, ni le rendu sur un vrai téléphone, ni le comportement des
animations sur une machine lente.

---

## 16. Ce qui n'est pas implémenté

- **Le formulaire de contact n'envoie rien.** L'état vit dans le composant, la
  confirmation le dit explicitement. Il n'y a ni service d'e-mail, ni stockage.
- **Les mises en situation ne sont pas des témoignages.** Les personnes citées sont
  fictives, chaque carte porte un badge « Mise en situation ». Il faudra de vrais clients
  pilotes avant de retirer ce badge.
- **Les chiffres de marché sont des ordres de grandeur** repris du document, non
  sourcés étude par étude sur le site. Une page « sources » serait à prévoir si le site
  devient public.
- **Les délais et indices de coût de Supply** sont des valeurs de démonstration, signalées
  comme telles sous la figure.
- **Pas de page légale réelle** : les liens « Confidentialité » et « Conditions » sont
  prévus dans le dictionnaire mais ne sont pas affichés, faute de contenu juridique.
- **Pas de référencement travaillé** : titres et descriptions sont posés, mais il n'y a
  ni `sitemap.xml`, ni `robots.txt`, ni balises Open Graph, ni image de partage.
- **Pas de traduction des URL** : les adresses restent en français même en anglais.
- **`useScrollProgress` est écrit mais inutilisé** : il a été prévu pour une section
  épinglée qui n'a finalement pas été retenue, la lecture au défilement suffisant.
- **Les compteurs affichent 0 sans JavaScript** : ils s'animent à l'entrée dans l'écran.
  Sans exécution du script, la valeur reste à zéro dans le HTML rendu.
- **Aucun suivi d'audience** n'est installé, volontairement.
