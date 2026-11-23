# Refactors prioritaires

Analyse du 23/11/2026, commit `df63b0c` (version 1.7.0). Tout le code TypeScript de `src/app` a été lu (services, modèles, vues, composants partagés, utilitaires, guards). Les templates HTML n'ont été consultés que pour vérifier des usages, les specs seulement pour mesurer la couverture.

**Légende** : 🔴 haute · 🟠 moyenne · 🟢 basse

**Vérifications après chaque commit** (identiques à la CI) : `pnpm build`, `pnpm test:ci`, `pnpm lint`. Chaque commit doit les laisser au vert. Si un commit change une règle de jeu ou le format de sauvegarde, il met aussi à jour `specs.md`, s'il touche du code de compatibilité `docs/compatibilite.md`, et s'il change quelque chose de visible pour le joueur le changelog (voir CLAUDE.md).

Les 16 entrées de l'analyse précédente (commit `c5d5cb0`) sont toutes livrées. Le code est désormais propre dans l'ensemble : les entrées ci-dessous sont surtout des fiabilisations ciblées et de petites dé-duplications.

## Hors refactor

- **Variation aléatoire hors de ±10 % sur les petites valeurs** 🟠 (bug n°1 de `docs/bugs.md`) : `withVariance()` (`shared/utils/game.utils.ts`) appelle `random(a, b)` avec des bornes non entières, alors que `random()` (`math.utils.ts`) est conçu pour des entiers (`floor(Math.random() * (max - min + 1) + min)`). Pour 5 dégâts, on obtient 4, 5 ou 6 (±20 %) ; pour 1, on obtient 0, 1 ou 2. Touche surtout les attaques ennemies du début de partie et les soins faibles, alors que `specs.md` §5.3 annonce ±10 %. Corrigé par le commit 2.
- **Langue de la sauvegarde non vérifiée** 🟢 (bug n°2) : `GameService.load()` recopie `save.language` tel quel, sans passer par `getLanguage()`. Une sauvegarde modifiée avec une langue inconnue fait charger `assets/i18n/<langue>/*.json`, qui n'existe pas, et l'écran Options n'affiche aucune langue sélectionnée. Corrigé par le commit 3.
- **Sécurité** : rien à signaler. Jeu uniquement côté client, sans backend ni appel externe ; une sauvegarde modifiée à la main est refusée si elle n'est pas jouable (`checkPlayable()`).

## Lot 1 — Filet de tests

### 1. `test(actions): cover attack, cure and potion amounts` 🟠 ✅ fait

`Attack` et `Cure` (`models/actions/`) n'ont pas de spec : la variation, le critique et la puissance ne sont testés qu'indirectement par `battle.service.spec.ts` et `materia.spec.ts`. Les montants de `HpPotion` / `MpPotion` non plus.

Ajouter `attack.spec.ts`, `cure.spec.ts` et des cas de potions, avec `Math.random` simulé aux bornes (0 et 0,999…), y compris pour de petites valeurs.

**Risque** : nul pour le code de production. Sert de filet au commit 2 : les cas « petites valeurs » documentent le comportement actuel et seront ajustés par lui.

## Lot 2 — Fiabilité

### 2. `fix(battle): keep damage variance within ±10%` 🟠 ✅ fait

Voir « Hors refactor ». `withVariance()` calcule directement `Math.round(value * (1 + VARIANCE * (2 * Math.random() - 1)))`, sans passer par `random()`, qui reste réservé aux entiers (choix de l'ennemi, critique).

**Risque** : faible, mais c'est de l'équilibrage : les dégâts ennemis du début de partie deviennent moins dispersés. Dépend du commit 1. Mettre à jour `game.utils.spec.ts`, `specs.md` §2 et §5.3 si la formule y est détaillée, `docs/bugs.md` (retirer le n°1, renuméroter) et le changelog.

### 3. `fix(save): fall back to a supported language on load` 🟢 ✅ fait

Voir « Hors refactor ». Dans `GameService.load()`, passer `save.language` par `getLanguage()` (langue du navigateur, puis `en`).

**Risque** : très faible. Tester qu'une sauvegarde en `de` charge en anglais et qu'une sauvegarde en `es` reste en espagnol. `specs.md` §11, `docs/bugs.md` et changelog.

### 4. `refactor(progress-bar): follow changes of the hits input` 🟢

`ProgressBarComponent` ne lit l'input `hits` qu'une fois, dans `ngOnInit()`. Les dégâts flottants des ennemis ne s'affichent à chaque combat que parce que le `@if (enemies().list.length > 0)` d'`EnemiesPanelComponent` détruit et recrée la barre entre deux combats : couplage caché avec le template parent.

Changement : s'abonner via `toObservable(this.hits).pipe(switchMap(...))` (ou un `effect` qui gère l'abonnement), et supprimer `OnInit`.

**Risque** : très faible. Ajouter à `progress-bar.component.spec.ts` un cas où l'input change d'observable. Vérifier en jeu deux combats d'affilée.

### 5. `refactor(game): keep the same collections across games` 🟢

`GameService.preload()` remplace `characters`, `zones`, `weapons`, `materias` et `items` par de nouvelles instances. Tout ce qui a gardé une référence devient obsolète : `ViewGameComponent.characters`, `ViewPhsComponent.team` / `backup`, `ViewMateriaComponent.maxMaterias`, `ViewEquipComponent.team`, les `list` copiées par `ViewItemsComponent` et `ViewMateriaComponent`. Ça marche aujourd'hui parce que `newGame()` et `importGame()` sont suivis d'une navigation vers `/game`, qui recrée les vues. Un futur bouton « Recommencer » sur l'écran Jeu (cf. `docs/ameliorations.md` n°1) afficherait l'ancienne partie.

Changement : une méthode `clear()` par collection (vider `list`, remettre `team`, `hp`, `mp`, `limit`, `level`… à zéro), appelée par `preload()` à la place des `new`.

**Risque** : moyen, `importGame()` restaure la partie courante en cas d'échec et doit continuer à le faire. `game.service.spec.ts` couvre `newGame`, `importGame` (succès et échec) ; ajouter un test qui vérifie que `game.characters` est la même instance avant et après.

## Lot 3 — Dé-duplication du domaine

### 6. `refactor(models): move difficulties and languages out of GameService` 🟢

- `Difficulty` est déclaré dans `core/services/game.service.ts`, la liste `DIFFICULTIES` y est aussi, et `ViewConfigComponent.difficulties` la recopie avec les libellés. `Enemy.toLevel()` prend la difficulté en `number`, faute de pouvoir importer un service depuis un modèle.
- Les langues sont listées deux fois : `GameService.getLanguage()` (`['en', 'fr', 'es']`) et `ViewConfigComponent.languages`.

Changement : `models/difficulty.ts` (enum, liste avec libellés) et une constante `LANGUAGES` (code, libellé), utilisées par `GameService`, `BattleService`, `Enemy.toLevel(…, difficulty: Difficulty)` et `ViewConfigComponent`.

**Risque** : très faible, le compilateur signale les imports. `view-config.component.spec.ts` couvre les deux listes. Plus simple après le commit 3, qui touche `getLanguage()`.

### 7. `refactor(materias): add Materias.remove for selling` 🟢

`ShopService.sellMateria()` filtre lui-même `game.materias.list`, alors que les armes et objets passent par `Stock.remove()`. C'est le seul endroit hors des collections qui réécrit une `list`.

Changement : `Materias.remove(materia)`, appelé par `ShopService`.

**Risque** : très faible. `shop.service.spec.ts` couvre la vente ; ajouter un cas à `materias.spec.ts`.

### 8. `refactor(characters): keep the selected character in the team` 🟢

`Characters.selected` (assertion `!`) n'est fixé que par `select()`, et peut désigner un personnage sorti de l'équipe depuis le PHS. `ViewEquipComponent` rattrape le cas dans son constructeur en recopiant la logique « premier de l'équipe ».

Changement : `Characters.getSelected()` (ou un `computed` sur `team`) qui renvoie le personnage choisi s'il est dans l'équipe, sinon le premier ; la vue le lit sans logique propre.

**Risque** : faible. `view-equip.component.spec.ts` couvre la sélection ; ajouter le cas « sélectionné puis retiré de l'équipe » à `characters.spec.ts`.

## Lot 4 — Lisibilité

### 9. `refactor(save): move save loading and export out of GameService` 🟢

`GameService` (417 lignes, le plus gros fichier) mélange l'état de jeu, la progression (`buildLevel`, `goNextZone`), l'équipement, le chrono et la persistance (`run`, `importGame`, `tryLoad`, `load`, `checkPlayable`, `export`, `save`, `reset`, accès à `localStorage`).

Changement : sortir la conversion `Save` ⇄ état (`load`, `checkPlayable`, `export`) dans un module dédié (`models/game-save.ts` ou un `SaveService`), `GameService` gardant l'orchestration (`run`, `newGame`, `importGame`, `save`).

**Risque** : moyen, c'est le chargement des sauvegardes et tout le code de compatibilité : mettre à jour les chemins dans `docs/compatibilite.md` (entrées 1 à 4). `game.service.spec.ts` doit passer sans changer d'assertions. À faire après 3, 5 et 6, qui touchent les mêmes méthodes.

## Lot 5 — Modernisation

### 10. `refactor(models): move action interfaces into models` 🟢

Les modèles importent `ItAction`, `ItActionAttack` et `ItDisplayHits` depuis `core/interfaces/` (15 imports) : dépendance inversée entre couches. `Units.source.hp` est un nom peu parlant pour le flux des dégâts flottants, et `{ hits } as ItDisplayHits` est casté partout.

Changement : déplacer les interfaces dans `models/actions/` (et `models/units.ts`), renommer `source.hp` en `hitEvents`, typer les `next()` sans cast.

**Risque** : très faible, renommage vérifié par le compilateur. Plus simple après le commit 4, qui touche l'input `hits` de la barre.

## Lot 6 — Nettoyage

### 11. `chore: remove trivial getters and redundant code` 🟢

- `Enemy.getHpMax()`, `getHits()`, `xpReward()`, `apReward()`, `gilsReward()` ne font que renvoyer un champ public.
- Le constructeur d'`Enemies` réinitialise des champs déjà initialisés par `Units`.
- `Character.xpProgress(pixelsMax)` et `Materia.apProgress(pixelsMax)` sont toujours appelés avec `100` : les remplacer par `percent()` (`math.utils.ts`).
- `Materia.isOwned()` : `if`/`return true`/`return false` autour d'un `some()`.
- Dans `BattleService.onTeamVictory()`, la condition `zones.level + 1 > zones.levelMax` est toujours vraie quand un boss est vaincu (`canFightBoss()` exige une zone non terminée, donc la dernière débloquée).

**Risque** : très faible. Le build et les specs existantes (`enemy.spec.ts`, `character.spec.ts`, `materia.spec.ts`, `battle.service.spec.ts`) détectent les écarts.

## Graphe des dépendances

```
1 ──> 2
3 ──> 6 ──> 9
5 ────────> 9
4 ──> 10
7, 8, 11 : indépendants
```

## Ordre conseillé si le temps est limité

1. **1, puis 2** : seul bug de gameplay (dégâts dispersés à ±20 % et plus en début de partie), avec son filet de tests.
2. **3** : correction en une ligne.
3. **4** : supprime un couplage caché dans l'affichage des dégâts.
4. **5** : rend `newGame()` / `importGame()` sûrs quelle que soit la vue affichée, avant d'ajouter un bouton « Recommencer ».
5. **6 et 7** : dé-duplications rapides et sans risque.
