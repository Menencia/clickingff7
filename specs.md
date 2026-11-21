# Spécifications fonctionnelles — Clickingff7

Ce document décrit le comportement **actuellement implémenté** du jeu. Il doit être mis à jour à chaque évolution du code qui change une règle, une formule, une donnée de jeu ou un écran.

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
- Niveau maximum : 100. Au-delà, l'XP reçue est ignorée et remise à 0. Un gain d'XP peut faire passer plusieurs niveaux d'un coup.

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
- Quand la zone courante est terminée et que `levelMax < 9`, l'écran Carte propose d'aller à la zone suivante. Le menu affiche alors un `*` à côté de « Carte ».
- Aller à une zone jamais visitée augmente `levelMax` et applique les déblocages (§4.3). Le catalogue de la boutique en dépend (§10).
- Le joueur peut revenir à tout moment dans une zone déjà débloquée, depuis la Carte.

### 4.3 Déblocages par zone (`GameService.buildLevel`)

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

Un seul combat peut avoir lieu à la fois. Pendant un combat, tous les écrans sauf Jeu sont inaccessibles (`BattleGuard`), et le tutoriel ne peut pas être lancé.

Actions disponibles :

- **Combat aléatoire** : lance un combat contre un ennemi de la zone courante (hors combat uniquement).
- **Combat de boss** : lance un combat contre le boss, quand il est disponible.
- **Attaque** (ou **Limite** quand la jauge est pleine) : inflige des dégâts aux ennemis. Le joueur peut cliquer autant qu'il veut.
- **Fuite** : termine le combat sans récompense et sans pénalité. Le combat ne compte pas dans `nbFights`.
- **Materias** équipées et **objets** équipés (voir §6 et §7).

Ces actions du joueur sont appliquées par `BattleService` (`attack`, `useMateria`, `useItem`). Une materia ou un objet inutilisable (bouton désactivé) est ignoré, sans coût.

Les ennemis attaquent toutes les **1 seconde**. Si les HP de l'équipe tombent à 0, le combat est perdu : la Limite est remise à 0, et les HP **restent à 0** jusqu'à ce qu'ils soient soignés. Il n'y a pas de régénération automatique. Si les HP ennemis tombent à 0 après une action du joueur, le combat est gagné.

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
- Équiper une arme déséquipe l'arme du même type qui était portée, puis recalcule les statistiques d'équipe.

## 9. Écrans

Le menu latéral donne accès à : Jeu, Carte, Boutique, Équipement, Materia, Objets, Config, PHS (seulement si zone max ≥ 5) et Sauvegarde. Sur mobile, le menu est un tiroir qui se referme après chaque navigation.

| Écran | Route | Contenu |
|---|---|---|
| Jeu | `/game` | Barres HP / MP / Limite de l'équipe, liste des membres (portrait, niveau, barre d'XP, réplique), panneau ennemi, actions de combat, gils et zone courante. C'est l'écran par défaut. |
| Carte | `/map` | Choix de la zone parmi les zones débloquées ; passage à la zone suivante. |
| Boutique | `/shop` | Onglets Acheter / Vendre × Armes / Materias / Objets (voir §10). |
| Équipement | `/equip` | Sélection d'un membre de l'équipe et choix de son arme parmi les armes possédées de son type. |
| Materia | `/materia` | Équiper / déséquiper les materias selon les emplacements disponibles. |
| Objets | `/items` | Équiper / déséquiper les objets (2 maximum). |
| Config | `/config` | Difficulté (Facile / Normal / Difficile) et langue (FR / EN / ES). |
| PHS | `/phs` | Échange de personnages entre l'équipe et la réserve : 3 membres au maximum, 1 au minimum. |
| Sauvegarde | `/save` | Voir §11. |

**Tutoriel** : le bouton d'aide lance une visite guidée avec intro.js. Les étapes sont ancrées sur les éléments `#step1` à `#step13`, et leurs textes sont les clés `step1`…`step15` de `help.json`.

**Répliques** : chaque personnage affiche une réplique qui dépend de la zone max atteinte (clé i18n `Line {levelMax} {ref}`).

**Thème** : clair (cupcake) ou sombre (dark). Le thème par défaut est sombre, et le choix est mémorisé dans `localStorage['theme']`.

## 10. Boutique

- **Catalogue** (`ShopService`) : armes, materias et objets dont la zone de disponibilité est inférieure ou égale à la zone max atteinte. Il est recalculé à chaque ouverture de l'écran.
- **Achat d'arme** : possible seulement si le joueur n'en possède aucun exemplaire et a assez de gils. L'arme achetée n'est pas équipée.
- **Achat de materia** : possible seulement si elle n'est pas déjà possédée et que le joueur a assez de gils. Elle n'est pas équipée.
- **Achat d'objet** : sans limite de quantité. Un nouveau type d'objet est équipé automatiquement s'il reste une place (moins de 2 équipés).
- **Revente** : au **prix d'achat / 2**. Impossible de vendre le dernier exemplaire d'une arme équipée.
- **Tri** : armes par type (broadsword, gun-arm, knuckle, stave, headdresse, shuriken) puis par dégâts ; materias par puissance ; objets par identifiant.

## 11. Sauvegarde et paramètres

- **Contenu** (`models/save.ts`) : personnages (niveau, XP, équipe, arme), HP / MP / Limite de l'équipe, zones visitées (combats, terminée), zone courante et zone max, armes, materias (niveau, AP, équipée), objets, gils, langue, difficulté, temps de jeu, version.
- **Stockage** : JSON encodé en base64 dans `localStorage['save1']`. Il n'y a qu'un seul emplacement.
- **Sauvegarde manuelle uniquement**, depuis l'écran Sauvegarde. Il n'y a pas de sauvegarde automatique.
- **Au démarrage** : la sauvegarde est chargée si elle existe, qu'elle est valide et que sa version est ≥ 1.1.0. Sinon, elle est effacée et une nouvelle partie démarre en zone 1. Une sauvegarde est invalide si elle n'est pas du JSON en base64, s'il lui manque un champ obligatoire de `Save` (ou si son type est incorrect), ou si elle référence un personnage, une arme, une materia, un objet ou une zone inconnus. La version enregistrée est celle de `package.json`.
- **Exporter la sauvegarde** : affiche la dernière sauvegarde en base64.
- **Exporter la partie** : affiche l'état courant en base64, même s'il n'est pas sauvegardé.
- **Importer** : charge une chaîne base64 collée dans la zone d'import, sans contrôle de version, après confirmation, puis renvoie à l'écran Jeu. La chaîne est vérifiée avant la confirmation : si elle est invalide (mêmes critères qu'au démarrage), le message « Sauvegarde invalide » s'affiche et rien ne change. Si la sauvegarde référence une donnée inconnue, la partie en cours est conservée et le même message s'affiche. L'import remplace la partie en cours mais n'écrit pas dans `localStorage` : il faut enregistrer ensuite pour le conserver.
- **Réinitialiser** : possible seulement si une sauvegarde existe, après confirmation. Efface la sauvegarde, recommence en zone 1 et renvoie à l'écran Jeu.
- **Temps de jeu** : compteur incrémenté chaque seconde, affiché au format `h:mm:ss`.
- **Langue** : par défaut, celle du navigateur si elle vaut en, fr ou es, sinon en. Elle est enregistrée dans la sauvegarde. Le français est la langue source des traductions (Crowdin).
- **Difficulté** : Normal par défaut. Elle s'applique aux ennemis générés ensuite (§5.2).
- **Argent de départ** : 200 gils.

## 12. Anomalies connues

Ces écarts ont été constatés dans le code actuel. Ce sont probablement des bugs ou des fonctionnalités inachevées, à corriger ou à confirmer :

1. Après une **défaite**, les HP restent à 0. Le combat suivant est perdu dès la première attaque ennemie, sauf si le joueur se soigne avant.
2. Les personnages n'attaquent pas automatiquement : `autoFighting()` existe mais n'est jamais appelé.
3. La vente d'une materia ne vérifie pas si elle est équipée.
4. Le niveau maximum de 100 (personnages et materias) n'est vérifié qu'**avant** la boucle de montée de niveau dans `Character.setXp` et `Materia.setAp`. Un gros gain d'XP ou d'AP au niveau 99 fait donc dépasser le niveau 100.
