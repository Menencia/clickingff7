# Spécifications fonctionnelles — Clickingff7

Ce document décrit le comportement **actuellement implémenté** du jeu. Il doit être mis à jour à chaque évolution du code qui change une règle, une formule, une donnée de jeu ou un écran. Les bugs et fonctionnalités inachevées sont listés dans `docs/bugs.md`.

Les valeurs entre parenthèses renvoient aux constantes ou fichiers du code.

## 1. Principe du jeu

Clickingff7 est un RPG « clicker » qui se joue dans le navigateur. Le joueur dirige une équipe de 1 à 3 personnages qui traverse 9 zones. Dans chaque zone, il enchaîne des combats contre des ennemis aléatoires, puis affronte le boss de la zone pour débloquer la suivante.

Pendant un combat, les ennemis attaquent automatiquement toutes les secondes. Le joueur attaque en cliquant sur un bouton, et peut aussi lancer des materias (magie) et utiliser des objets.

Les combats rapportent de l'expérience (XP) aux personnages, des points de compétence (AP) aux materias équipées, et des gils (monnaie). Les gils servent à acheter des armes, des materias et des objets à la boutique.

## 2. Statistiques et formules communes

Les données de base (`src/assets/data/*.json`) notent les statistiques sur une échelle de 1 à 5, où 3 est la moyenne. Elles sont converties par un **facteur de stat** :

> F(s) = 1 + 0,1 × (s − 3)  → 1 ⇒ 0,8 ; 3 ⇒ 1,0 ; 5 ⇒ 1,2

Les tirages aléatoires utilisent `random(min, max)`, qui renvoie un entier entre `min` et `max` inclus (`shared/utils/math.utils.ts`).

## 3. Personnages

### 3.1 Liste

| Personnage | Type d'arme | Arme de départ | HP | MP | XP | Indisponible en zone max |
|---|---|---|---|---|---|---|
| Cloud | broadsword | Buster Sword | 3 | 3 | 3 | — |
| Barret | gun-arm | Gatling Gun | 5 | 1 | 2 | 3 |
| Tifa | knuckle | Leather Glove | 2 | 2 | 3 | 3 |
| Aerith | stave | Guard Stick | 1 | 5 | 2 | 4, 5 |
| Red XIII | headdresse | Mythril Clip | 2 | 4 | 4 | — |
| Yuffie | shuriken | 4-pt Shuriken | 1 | 4 | 4 | — |

### 3.2 Formules (`models/character.ts`)

- HP max = ⌈F(hp) × 20 × niveau⌉
- MP max = ⌈F(mp) × 3 × niveau⌉
- XP requise pour le niveau suivant = ⌈(1 + 0,1 × (3 − xp)) × 100 × niveau⌉. La stat XP est inversée : plus elle est haute, plus le personnage progresse vite.
- Puissance d'attaque = niveau × dégâts de l'arme / 10
- Niveau maximum : 100. Un gain d'XP peut faire passer plusieurs niveaux d'un coup, sans dépasser 100. Au niveau 100, l'XP restante ou reçue est ignorée et remise à 0.

### 3.3 Statistiques d'équipe (`models/units/characters.ts`)

L'équipe partage **une seule réserve** de HP, de MP et de jauge de Limite :

- HP max équipe = somme des HP max des membres
- MP max équipe = somme des MP max des membres
- Puissance d'équipe (`hits`) = somme des puissances d'attaque des membres
- Limite max = 2/3 des HP max équipe
- `levelMax` = niveau du membre le plus haut ; `levelSum` = somme des niveaux des membres

Après chaque changement d'équipe ou d'équipement, ces valeurs sont recalculées (`refresh()`) et les valeurs courantes sont plafonnées aux nouveaux maximums.

### 3.4 Disponibilité

Un personnage est indisponible lorsque le **niveau de zone max atteint** est exactement l'une des valeurs de sa colonne « Indisponible ». Il est alors retiré de l'équipe et n'apparaît ni dans l'équipe ni en réserve. Ce contrôle a lieu au déblocage d'une zone et au chargement d'une sauvegarde.

## 4. Progression des zones

### 4.1 Zones (`assets/data/zones.json`)

Le jeu compte 9 zones (`MAX_ZONES = 9`). Chacune a 4 ennemis ordinaires et 1 boss :

| Zone | Lieu (image) | Ennemis | Boss |
|---|---|---|---|
| 1 | Sector 1 Reactor | 1st Ray, MP, Grunt, Sweeper | Guard Scorpion |
| 2 | Sector 5 Reactor | Blood Taste, Proto Machinegun, Smogger, Special Combatant | Air Buster |
| 3 | Sector 6 | Vice, Whole Eater, Hedgehog Pie, Hell House | Aps |
| 4 | Sector 7 | Aero Combatant, Deenglow, Eligor, Guard Hound | Reno |
| 5 | Shinra HQ | Mighty Grunt, Soldier 3rd, Sword Dance, Vargid Police | Sample H0512 |
| 6 | Shinra HQ | Heli Gunner*, Hundred Gunner*, Rufus*, Zenene | Motor Ball |
| 7 | Kalm | Kalm Fang, Mandragora, Elfadunk, Levrikon | Midgar Zolom |
| 8 | Mythril Mine | Crawler, Castanets, Madouge, Ark Dragon | Mystery Ninja |
| 9 | Junon | Capparwire, Formula, Zemzelett, Hell Rider | Bottomswell |

\* mi-boss (voir §5.2).

### 4.2 Règles

- Chaque zone suit son nombre de combats gagnés (`nbFights`). Le boss est disponible quand `nbFights ≥ 15` (`MAX_FIGHTS`) et que la zone n'est pas encore terminée. Le bouton de combat aléatoire affiche le nombre de combats restants avant le boss.
- Battre le boss termine la zone, à condition que ce soit la zone la plus avancée atteinte.
- Quand la zone courante est terminée et que `levelMax < 9`, l'écran Carte propose d'aller à la zone suivante. Le menu affiche alors un `*` à côté de « Carte » (une pastille sur l'icône Carte du dock, sur mobile).
- Aller à une zone jamais visitée augmente `levelMax` et applique les déblocages (§4.3). Le catalogue de la boutique en dépend (§10).
- Le joueur peut revenir à tout moment dans une zone déjà débloquée, depuis la Carte.

### 4.3 Déblocages par zone (`ZONE_UNLOCKS`, lu par `GameService.buildLevel`)

| Zone | Déblocage |
|---|---|
| 1 | Cloud et Barret dans l'équipe, avec Buster Sword et Gatling Gun équipées ; materias Restaurer et Foudre équipées ; 2 Potions |
| 2 | Tifa rejoint l'équipe, avec Leather Glove |
| 3 | Aerith rejoint l'équipe, avec Guard Stick |
| 4 | Barret et Tifa reviennent dans l'équipe |
| 5 | Red XIII arrive **en réserve**, avec Mythril Clip ; l'écran PHS devient accessible |
| 9 | Yuffie arrive **en réserve**, avec 4-pt Shuriken |

Un nouveau personnage arrive au niveau du membre le plus haut de l'équipe. À chaque déblocage de zone, les HP et MP de l'équipe sont restaurés au maximum et la Limite est remise à 0.

## 5. Combats

### 5.1 Déroulement (`models/battle.ts`, `core/services/battle.service.ts`, `shared/ui/ui-actions`)

Un seul combat peut avoir lieu à la fois. Pendant un combat, tous les écrans sauf Jeu sont inaccessibles (`battleGuard`), et le tutoriel ne peut pas être lancé.

Actions disponibles :

- **Combat aléatoire** : lance un combat contre un ennemi de la zone courante (hors combat uniquement).
- **Combat de boss** : lance un combat contre le boss, quand il est disponible.

Ces deux boutons sont désactivés tant que les HP de l'équipe sont à 0 : le joueur doit d'abord se soigner (materia de soin ou objet, utilisables hors combat).
- **Attaque** (ou **Limite** quand la jauge est pleine) : inflige des dégâts aux ennemis. Le joueur peut cliquer autant qu'il veut.
- **Fuite** : termine le combat sans récompense et sans pénalité. Le combat ne compte pas dans `nbFights`.
- **Materias** équipées et **objets** équipés (voir §6 et §7).

Ces actions du joueur sont appliquées par `BattleService` (`attack`, `useMateria`, `useItem`). Une materia ou un objet inutilisable (bouton désactivé) est ignoré, sans coût.

Les ennemis attaquent toutes les **1 seconde**. Si les HP de l'équipe tombent à 0, le combat est perdu : la Limite est remise à 0, et les HP **restent à 0** jusqu'à ce qu'ils soient soignés. Aucun combat ne peut être lancé tant qu'ils sont à 0. Il n'y a pas de régénération automatique. Si les HP ennemis tombent à 0 après une action du joueur, le combat est gagné.

### 5.2 Génération des ennemis

**Combat aléatoire** : l'ennemi est tiré parmi les premiers ennemis de la zone. Le nombre de candidats augmente avec la progression :

> indice max = min(⌊nbFights / 15 × 4⌋, 3) ; ennemi = enemies[random(0, indice max)]

Son niveau de base est la somme des niveaux de l'équipe (`levelSum`), multipliée par 1,2 pour un mi-boss.

**Combat de boss** : le niveau de base vaut zone × (taille de l'équipe + 1) × 3 × 1,4.

**Mise à niveau** (`Enemy.toLevel`) :

- Difficulté : niveau de base × (1 + 0,2 × (difficulté − 2)), arrondi au supérieur, soit Facile ×0,8, Normal ×1, Difficile ×1,2. On appelle le résultat `L`.
- Niveau affiché = ⌈L / 3⌉
- HP = ⌈F(hp) × 25 × L⌉
- Dégâts = ⌈F(hits) × L⌉
- XP = ⌈F(xp) × 5 × L⌉
- AP = ⌈F(ap) × 2 × L⌉
- Gils = ⌈F(gils) × (30 + L)⌉

Quand un combat compte plusieurs ennemis, leurs HP et leurs dégâts s'additionnent, et leurs faiblesses et résistances sont réunies.

### 5.3 Calcul des dégâts

**Attaque de l'équipe** (`models/actions/attack.ts`) :

- dégâts = puissance d'équipe × puissance / 100, avec une variation aléatoire de ±10 %
- puissance = 100 pour une attaque normale, 500 pour une Limite (la jauge retombe alors à 0)
- coup critique : environ 10 % de chances (`random(0, 100) ≤ 10`), dégâts ×2
- élément : ×3 si l'ennemi a une **faiblesse** à l'élément de l'attaque, ÷3 (arrondi inférieur) s'il y a une **résistance**. L'attaque physique n'a pas d'élément.

**Attaque ennemie** : dégâts = somme des dégâts ennemis ±10 %, sans élément. Côté équipe, une faiblesse multiplierait les dégâts par 3 et une résistance les diviserait par 10, mais les personnages n'ont actuellement ni faiblesse ni résistance.

**Jauge de Limite** : chaque dégât reçu remplit la jauge d'autant, jusqu'à la Limite max. La Limite est utilisable quand la jauge est exactement pleine.

### 5.4 Récompenses de victoire

Pour **chaque** ennemi vaincu :

- gils de l'ennemi ajoutés au joueur
- XP de l'ennemi donnée à **chaque** membre de l'équipe (la récompense n'est pas partagée)
- AP de l'ennemi donnés à **chaque** materia équipée
- si l'ennemi est un boss : la zone est terminée (voir §4.2)

Ensuite, `nbFights` de la zone courante augmente de 1 (une victoire contre un boss compte aussi), et les statistiques d'équipe sont recalculées.

## 6. Materias

### 6.1 Liste (`assets/data/materias.json`)

| Materia | Type | Élément | Puissance | AP | Prix | Dispo. zone |
|---|---|---|---|---|---|---|
| Restaurer (restore) | soin | — | 20 | 2 | 400 | 7 |
| Foudre (bolt) | attaque | bolt | 50 | 3 | 300 | 1 |
| Glace (ice) | attaque | ice | 50 | 3 | 300 | 1 |
| Feu (fire) | attaque | fire | 50 | 3 | 300 | 2 |
| Poison | attaque | poison | 50 | 3 | 300 | 5 |
| Terre (earth) | attaque | earth | 50 | 3 | 300 | 7 |
| Choco/Mog | attaque | wind | 400 | 4 | 600 | 7 |

### 6.2 Règles (`models/materia.ts`, `models/materias/`)

- Les materias forment un **stock commun** à l'équipe. Elles ne sont pas attachées à un personnage.
- Nombre d'emplacements = somme des `maxMaterias` des armes portées par l'équipe.
- Quand le nombre d'emplacements diminue (un personnage quitte l'équipe ou devient indisponible, arme avec moins d'emplacements, sauvegarde incohérente au chargement), les materias en trop sont déséquipées : les premières materias équipées de la liste sont conservées.
- AP requis pour le niveau suivant = ⌈F(ap) × 60 × niveau⌉. Le gain de niveau s'arrête au niveau 100.
- Puissance effective = puissance de base + niveau − 1
- **Materia d'attaque** : coûte ⌈(puissance + 1) / 50⌉ − 1 MP. Utilisable seulement en combat, si l'équipe a assez de MP. Elle inflige une attaque de puissance d'équipe × puissance effective / 100, avec l'élément de la materia (variation et critique comme une attaque normale).
- **Materia de soin** : coûte ⌈(puissance + 1) / 20⌉ − 1 MP. Utilisable si les HP ne sont pas au maximum, **même hors combat**. Elle soigne HP max équipe × puissance effective / 100, ±10 %.
- On ne peut posséder qu'un exemplaire de chaque materia.

## 7. Objets

### 7.1 Liste (`assets/data/items.json`)

| Objet | Effet | Puissance | Prix | Dispo. zone |
|---|---|---|---|---|
| Potion | HP | 33 % | 60 | 1 |
| Ether | MP | 33 % | 70 | 1 |
| Super potion (hi-potion) | HP | 66 % | 100 | 7 |
| Super ether (hi-ether) | MP | 66 % | 130 | 7 |

### 7.2 Règles (`models/item.ts`, `models/items/`)

- Un objet restaure ⌈puissance × max⌉ HP ou MP de l'équipe.
- Il est utilisable si la jauge concernée n'est pas pleine, en combat comme hors combat. Chaque utilisation consomme un exemplaire.
- Au maximum **2 types d'objets** (`MAX_ITEMS`) peuvent être équipés, c'est-à-dire affichés dans la barre d'actions.

## 8. Armes

### 8.1 Liste (`assets/data/weapons.json`)

| Arme | Type | Dégâts | Emplacements materia | Prix | Dispo. zone |
|---|---|---|---|---|---|
| Buster Sword | broadsword | 18 | 1 | 170 | 1 |
| Mythril Saber | broadsword | 23 | 1 | 1000 | 7 |
| Gatling Gun | gun-arm | 14 | 1 | 130 | 1 |
| Assault Gun | gun-arm | 17 | 1 | 350 | 2 |
| Cannon Ball | gun-arm | 23 | 1 | 900 | 7 |
| Leather Glove | knuckle | 13 | 1 | 120 | 2 |
| Metal Knuckle | knuckle | 18 | 1 | 320 | 3 |
| Mythril Claw | knuckle | 24 | 1 | 1100 | 7 |
| Guard Stick | stave | 12 | 2 | 140 | 3 |
| Mythril Rod | stave | 16 | 2 | 370 | 3 |
| Full Metal Staff | stave | 22 | 2 | 850 | 7 |
| Mythril Clip | headdresse | 24 | 1 | 800 | 5 |
| 4-pt Shuriken | shuriken | 23 | 2 | 180 | 9 |

### 8.2 Règles

- Un personnage ne peut porter qu'une arme de son type.
- Une arme est équipée si un personnage (de l'équipe ou de la réserve) la porte. L'arme portée par chaque personnage est la seule source de cet état.
- Équiper une arme remplace l'arme que le personnage portait, qui redevient libre, puis recalcule les statistiques d'équipe.

## 9. Écrans

Le menu donne accès à : Jeu, Carte, Boutique, Équipement, Materia, Objets, Config, PHS (seulement si zone max ≥ 5) et Sauvegarde. À partir de 768 px de large (`md`), c'est un menu horizontal dans la barre de navigation (compact sous 1024 px). Sur mobile, c'est un dock fixé en bas de l'écran (`DockComponent`) avec cinq boutons à icône : Jeu, Carte, Boutique, Équipement et « Plus ». « Plus » ouvre vers le haut un menu avec les autres écrans (Materia, Objets, PHS, Config, Sauvegarde) ; il est mis en évidence quand l'un d'eux est affiché et se referme après chaque navigation. Les barres d'actions collées en bas de certains écrans se placent juste au-dessus du dock.

| Écran | Route | Contenu |
|---|---|---|
| Jeu | `/game` | Barres HP / MP / Limite de l'équipe, liste des membres (portrait, niveau, barre d'XP, réplique), panneau ennemi (« Aucun ennemi » hors combat), actions de combat, gils et zone courante. C'est l'écran par défaut. Sur grand écran, trois colonnes : actions, équipe, ennemis. Sur mobile : ennemis en haut, puis l'équipe, et les actions dans une barre collée en bas de l'écran (zone et gils, materias et objets sur une ligne défilante, boutons de combat en grille 2×2). |
| Carte | `/map` | Choix de la zone parmi les zones débloquées ; passage à la zone suivante. La zone choisie est présentée dans une carte (image, numéro, nom, état terminé ou non, description). Sur grand écran, les boutons de zone sont en colonne à gauche ; sur mobile, ce sont des boutons numérotés (5 par ligne) dans une barre collée en bas de l'écran, avec le bouton « Aller à la zone suivante » au-dessus. |
| Boutique | `/shop` | Onglets Acheter / Vendre × Armes / Materias / Objets (voir §10). Sur grand écran, les onglets sont en colonne à gauche du tableau ; sur mobile, ils sont sur deux lignes dans une barre collée en bas de l'écran (Acheter / Vendre et gils, puis Armes / Materias / Objets) et le prix et le stock sont affichés sous le nom au lieu de colonnes. |
| Équipement | `/equip` | Sélection d'un membre de l'équipe et choix de son arme parmi les armes possédées de son type. Le personnage choisi est présenté dans une carte (portrait, niveau, HP / MP / puissance, arme équipée avec sa puissance et ses emplacements de materia) ; dans la liste, l'arme équipée porte un badge « Équipée » au lieu du bouton. Sur grand écran, les boutons des personnages sont en colonne à gauche ; sur mobile, la carte est en haut, la liste des armes en dessous et les personnages sont dans une barre collée en bas de l'écran. |
| Materia | `/materia` | Équiper / déséquiper les materias selon les emplacements disponibles (compteur équipées / emplacements dans l'en-tête du tableau). Les materias équipées sont surlignées. Sur mobile, la barre d'AP est affichée sous la description au lieu d'une colonne Évolution. |
| Objets | `/items` | Équiper / déséquiper les objets (2 maximum, compteur équipés / maximum dans l'en-tête du tableau). Les objets équipés sont surlignés. Sur mobile, la quantité en stock est affichée dans un badge à côté du nom au lieu d'une colonne. |
| Config | `/config` | Difficulté (Facile / Normal / Difficile) et langue (Français / English / Español), chacune choisie en cliquant sur un badge (le choix actif est en couleur) au lieu d'une liste déroulante. |
| PHS | `/phs` | Échange de personnages entre l'équipe et la réserve : 3 membres au maximum, 1 au minimum (compteur membres / maximum à côté du titre Équipe). Chaque personnage est présenté dans une carte (portrait, niveau, HP / MP / puissance, barre d'EXP) avec un bouton flèche pour le mettre en soutien ou le faire entrer dans l'équipe, grisé quand l'échange est impossible. Sur grand écran, l'équipe et le soutien sont en deux colonnes ; sur mobile, l'un sous l'autre. |
| Sauvegarde | `/save` | Voir §11. Deux cartes : « Dernière sauvegarde » (portraits de l'équipe, temps de jeu, gils, boutons Enregistrer et Réinitialiser) et « Transfert » (Exporter sauvegarde, Exporter jeu, Importer). Sur grand écran, elles sont en deux colonnes ; sur mobile, l'une sous l'autre. |

**Tutoriel** : visite guidée avec intro.js, lancée par le bouton d'aide (point d'interrogation dans un rond) de la barre de navigation (`HelpButtonComponent`, désactivé pendant un combat) et chargée à la demande. Elle renvoie d'abord à l'écran Jeu. Les étapes sont définies dans `models/help.ts` et ancrées sur les éléments `#step1` à `#step13` : équipe, barres HP/MP/Limit, ennemis, boutons Combat aléa./Attaquer/Fuir, materias utilisables, menu principal (`#step10-menu` sur grand écran, dock `#step10-dock` sur mobile : le tutoriel retient le premier élément visible), zone, lien de version et lien « New Issue » du pied de page. Sur téléphone (moins de 640 px de large), chaque élément est d'abord amené en haut de l'écran pour que la bulle tienne au-dessus ou en dessous, les bulles sont plus compactes, et la barre d'actions de l'écran Jeu n'est plus collée en bas pendant la visite (classe `help-tour` sur `<body>`, variante Tailwind `help-tour:`). Leurs textes sont les clés `step1`…`step15` de `help.json` (la première et la dernière étape n'ont pas d'élément cible).

**Répliques** : chaque personnage affiche une réplique qui dépend de la zone max atteinte (clé i18n `Line {levelMax} {ref}`).

**Bandeau de mise à jour** : quand une nouvelle version du jeu a été téléchargée en arrière-plan, un bandeau en bas de l'écran invite à sauvegarder puis à recharger (voir §12).

**Thème** : clair (cupcake) ou sombre (dark). Les deux thèmes daisyUI sont redéfinis dans `src/styles.scss` avec la palette du jeu (surfaces bleu ardoise, vert Mako en couleur principale, cyan en secondaire, ambre en accent) mais gardent leur nom. Le thème par défaut est sombre, et le choix est mémorisé dans `localStorage['theme']`. Une ancienne valeur `light` est convertie en `cupcake` au chargement, et toute autre valeur inconnue donne le thème sombre.

## 10. Boutique

- **Catalogue** (`ShopService`) : armes, materias et objets dont la zone de disponibilité est inférieure ou égale à la zone max atteinte. Il est recalculé à chaque ouverture de l'écran.
- **Achat d'arme** : possible seulement si le joueur n'en possède aucun exemplaire et a assez de gils. L'arme achetée n'est pas équipée.
- **Achat de materia** : possible seulement si elle n'est pas déjà possédée et que le joueur a assez de gils. Elle n'est pas équipée.
- **Achat d'objet** : possible dès que le joueur a assez de gils, sans limite de quantité. Un nouveau type d'objet est équipé automatiquement s'il reste une place (moins de 2 équipés).
- **Revente** : au **prix d'achat / 2**. Impossible de vendre le dernier exemplaire d'une arme équipée, ni une materia équipée (signalée par un badge « Équipée » dans l'onglet Vente).
- **Règles** : `ShopService` vérifie chaque achat et chaque revente (`canBuy*` / `canSell*`) et ne fait rien si l'opération est impossible, indépendamment des boutons désactivés de l'écran.
- **Tri** : armes par type (broadsword, gun-arm, knuckle, stave, headdresse, shuriken) puis par dégâts ; materias par puissance ; objets par identifiant.

## 11. Sauvegarde et paramètres

- **Contenu** (`models/save.ts`) : personnages (niveau, XP, équipe, arme), HP / MP / Limite de l'équipe, zones visitées (combats, terminée), zone courante et zone max, armes (quantité), materias (niveau, AP, équipée), objets, gils, langue, difficulté, temps de jeu, version.
- **Armes équipées** : elles se déduisent de l'arme de chaque personnage. Le champ `weapons[].equipped` est encore écrit (calculé à partir des personnages) pour rester lisible par la 1.5.0, mais il est facultatif et ignoré au chargement.
- **Portraits** : l'image d'un personnage vient toujours du catalogue (`characters.json`), y compris pour les portraits de l'écran Sauvegarde. Le champ `characters[].image` est encore écrit pour rester lisible par la 1.6.0, mais il est facultatif et ignoré au chargement.
- **Compatibilité** : tous les cas d'anciennes versions gérés sont listés dans `docs/compatibilite.md`.
- **Stockage** : JSON encodé en base64 dans `localStorage['save1']`. Il n'y a qu'un seul emplacement.
- **Sauvegarde manuelle uniquement**, depuis l'écran Sauvegarde. Il n'y a pas de sauvegarde automatique. Si le navigateur refuse l'écriture (stockage plein ou désactivé), le message « Échec de la sauvegarde : stockage plein ou désactivé » s'affiche sous le résumé, et la dernière sauvegarde affichée reste la précédente. Le message disparaît à la sauvegarde suivante réussie.
- **Au démarrage** : la sauvegarde est chargée si elle existe, qu'elle est valide et que sa version est ≥ 1.1.0. Sinon, elle est effacée et une nouvelle partie démarre en zone 1. Une sauvegarde est invalide si elle n'est pas du JSON en base64, s'il lui manque un champ obligatoire de `Save` (ou si son type est incorrect), si elle référence un personnage, une arme, une materia, un objet ou une zone inconnus, ou si elle n'est pas jouable : zone courante absente de la liste des zones ou au-delà de la zone max, zone max au-delà de la dernière zone de la liste ou de la zone 9, aucun personnage disponible dans l'équipe, ou difficulté autre que 1, 2 ou 3. Au chargement, les materias en trop par rapport aux emplacements de l'équipe sont déséquipées, ainsi que les objets équipés au-delà de 2 (les derniers de la liste). La version enregistrée est celle de `package.json`.
- **Exporter la sauvegarde** : affiche la dernière sauvegarde en base64.
- **Exporter la partie** : affiche l'état courant en base64, même s'il n'est pas sauvegardé.
- **Copier** : la chaîne exportée s'affiche dans une zone en lecture seule (tout est sélectionné au focus) avec un bouton Copier qui la met dans le presse-papiers et devient « Copié ! ». Si le presse-papiers est indisponible, rien ne se passe.
- **Importer** : charge une chaîne base64 collée dans la zone d'import, sans contrôle de version, après confirmation, puis renvoie à l'écran Jeu. La chaîne est vérifiée avant la confirmation : si elle est invalide (mêmes critères qu'au démarrage), le message « Sauvegarde invalide » s'affiche et rien ne change. Si la sauvegarde référence une donnée inconnue ou n'est pas jouable, la partie en cours est conservée et le même message s'affiche. L'import remplace la partie en cours mais n'écrit pas dans `localStorage` : il faut enregistrer ensuite pour le conserver.
- **Réinitialiser** : possible seulement si une sauvegarde existe, après confirmation. Efface la sauvegarde, recommence en zone 1 et renvoie à l'écran Jeu.
- **Temps de jeu** : compteur incrémenté chaque seconde, affiché au format `h:mm:ss`.
- **Langue** : par défaut, celle du navigateur si elle vaut en, fr ou es, sinon en. Elle est enregistrée dans la sauvegarde. Le français est la langue source des traductions (Crowdin).
- **Difficulté** : Normal par défaut. Elle s'applique aux ennemis générés ensuite (§5.2). Elle est enregistrée comme un nombre (1 Facile, 2 Normal, 3 Difficile). Une ancienne sauvegarde où elle est stockée en chaîne (« 2 ») reste valide et est convertie en nombre au chargement.
- **Argent de départ** : 200 gils.

## 12. Application installable et mode hors ligne (PWA)

- **Installation** : le jeu est une PWA (`src/manifest.webmanifest`). Le navigateur propose de l'installer comme une application (nom « ClickingFF7 », affichage plein écran sans barre d'adresse, couleur `#1d232a`). Les icônes (192 et 512 px, 512 px *maskable* pour Android, 180 px `apple-touch-icon` pour iOS) sont dans `src/assets/icons/`, et le favicon (`src/favicon.ico`, 16/32/48 px) reprend le même motif. Tous sont générés à partir de `resources/icon/sword.png` : icône « Sword » de Geoffrey Joe (The Noun Project) sous licence CC BY 3.0, recolorée. L'attribution, avec un lien vers la licence et la mention de la modification, est dans le pied de page et le README.
- **Hors ligne** : un service worker Angular (`ngsw-config.json`) met en cache dès la première visite toute l'application et **tous** les fichiers de `src/assets` (données, traductions, images). Le jeu fonctionne ensuite entièrement sans réseau, toutes zones confondues. Il n'y a pas de serveur : la sauvegarde reste dans `localStorage`.
- **Actif en production seulement** : le service worker n'est enregistré que dans un build de production (`pnpm build`), pas avec `pnpm start`.
- **Mises à jour** : à chaque lancement, et toutes les heures pendant une partie (`UPDATE_CHECK_INTERVAL`), le service worker cherche une nouvelle version et la télécharge en arrière-plan. Elle n'est jamais appliquée de force, puisqu'il n'y a pas de sauvegarde automatique. Un bandeau (`UpdateBannerComponent`) propose « Recharger » (désactivé pendant un combat) ou « Plus tard ». Sans rechargement, la nouvelle version s'applique au prochain lancement. Si la version en cache ne peut plus être servie, le bandeau demande de recharger.
