# Refactors prioritaires

- Date : 2026-11-21
- Commit analysé : `e85f577` (branche `experiments`)
- Périmètre : tout `src/app` (modèles, services, guards, vues, composants partagés), plus `src/assets/data`. Le projet est petit, tout a été lu.

**Légende** : 🔴 haute · 🟠 moyenne · 🟢 basse

**Vérifications après chaque commit** (identiques à la CI) : `pnpm build`, `pnpm test:ci`, `pnpm lint`. Chaque commit doit les laisser au vert. Si un commit change une règle de jeu, il met aussi à jour `specs.md` (voir CLAUDE.md).

## Hors refactor

Ces problèmes ne relèvent pas du refactor, mais ils sont à traiter en priorité.

- **Réinitialiser et Importer sont inaccessibles** 🔴 ✅ fait : dans `views/view-save/view-save.component.html`, les deux boutons sont commentés. Ils utilisaient une directive de confirmation `[message]` / `(confirm)` qui a disparu avec PrimeNG. `ViewSaveComponent.resetGame()` et `importSave()` ne sont donc plus appelables. Il faut les rebrancher avec une confirmation daisyUI (`<dialog class="modal">`), **après** le commit 7 : en l'état, une réinitialisation ou un import réutiliserait des instances déjà modifiées.
- **Sécurité** : rien à signaler. L'application tourne uniquement côté client, sans backend. Le joueur peut modifier sa sauvegarde en base64, ce qui est acceptable pour un jeu solo.

## Lot 1 — Filet de tests

Les 26 fichiers `*.spec.ts` ne vérifient que la création des composants et services (`should create`). `core/services/game.service.spec.ts` remplace même `GameService` par un mock avant de l'injecter : il ne teste rien. Aucune règle métier n'est couverte, alors que les lots suivants vont déplacer cette logique.

### 1. `test(models): cover stats, leveling and damage formulas` 🔴 ✅ fait

Ajouter des tests unitaires purs, sans TestBed, sur :
- `Character` (`getHpMax`, `getMpMax`, `getXpMax`, `setXp` avec plusieurs niveaux d'un coup et le plafond à 100)
- `Enemy.toLevel` (effet de la difficulté)
- `Materia.setAp` et les coûts en MP de `AttackMateria` / `CureMateria`
- `Characters.refresh`, `getAttacked` (faiblesse, résistance, Limite) et `getAttackSkill` (Limite ×5)
- `compareVersions`

Bouchonner `Math.random` pour rendre `random()` déterministe.

**Risque** : nul pour le code de production. Les tests figent le comportement actuel, y compris le bug de `compareVersions` (commit 6) : écrire ce cas comme un test attendu en échec (`it.fails`) ou le documenter.

### 2. `test(battle): cover battle loop, rewards and boss unlock` 🔴 ✅ fait

Tester :
- `Battle` avec des faux timers Vitest (attaque ennemie toutes les secondes, défaite à 0 HP)
- `BattleService.onTeamVictory` (gils, XP, AP, `nbFights`, fin de zone sur un boss)
- `canFightBoss`
- `GameService` : aller-retour `export()` / `load()`, et `buildLevel(1..5)`

Fournir à `DataService` des données en mémoire pour ne pas passer par HTTP.

**Risque** : `GameService` lit `localStorage` et lance un timer dès son constructeur (`run()`). Il faut vider `localStorage` et utiliser des faux timers dans `beforeEach`. Le commit 9 simplifiera ces tests.

## Lot 2 — Fiabilité

### 3. `fix(save): do not crash on corrupted or invalid save` 🔴 ✅ fait

`GameService.run()` fait `JSON.parse(atob(localStorage['save1']))` sans `try/catch`, directement dans le constructeur. Une sauvegarde corrompue empêche donc l'application de démarrer (écran blanc dès qu'une vue injecte `GameService`). `ViewSaveComponent.importSave()` a le même problème. L'encodage base64 est par ailleurs dupliqué dans `GameService.save()`, `ViewSaveComponent.exportLastSave()` et `exportCurrentGame()`.

Changement : extraire `encodeSave()` / `decodeSave()` dans `shared/utils/save.utils.ts`. `decodeSave()` renvoie `null` si la chaîne est invalide ou si les champs obligatoires de `Save` manquent. En cas d'échec au démarrage, lancer une nouvelle partie au lieu de planter.

**Risque** : faible. Vérifier qu'une sauvegarde existante se recharge toujours (test d'aller-retour du commit 2). C'est un prérequis pour rebrancher l'import.

### 4. `fix(progress-bar): unsubscribe from hits stream on destroy` 🟠 ✅ fait

Dans `ProgressBarComponent.ngOnInit`, `this.hits.subscribe(...)` n'est jamais désabonné, et le `setTimeout` n'est pas annulé. Or `Characters.source.hp` vit dans `GameService` pendant toute la partie. Chaque passage sur l'écran Jeu ajoute donc un abonnement, qui continue de modifier un composant détruit.

Changement : `takeUntilDestroyed(this.destroyRef)`, plus `clearTimeout` dans un `DestroyRef.onDestroy`.

**Risque** : faible. Vérifier que les dégâts flottants s'affichent toujours après plusieurs allers-retours Jeu → Carte → Jeu.

### 5. `refactor(battle): move player actions from UiActionsComponent to BattleService` 🟠 ✅ fait

`UiActionsComponent.attack()`, `useMateria()` et `useItem()` contiennent de la logique métier : débit des MP, consommation des objets, et fin de combat quand les ennemis meurent (dupliquée entre `attack` et `useMateria`). En cas d'action impossible, ces méthodes lèvent `throw new Error('CANNOT USE')`.

Changement : créer `BattleService.attack()`, `useMateria(m)` et `useItem(i)`. Ils construisent le `Context`, vérifient `canUse`, appliquent l'action et appellent `battle.end(true)` si l'ennemi est mort. Le composant ne fait plus que déléguer.

**Risque** : moyen. C'est le chemin principal du jeu. Il est couvert par le commit 2 ; ajouter des tests sur ces trois méthodes.

### 6. `fix(version): compare save versions numerically` 🟢 ✅ fait

Dans `shared/utils/version.utils.ts`, `compareVersions` compare les groupes de la regex comme des chaînes (« 10 » < « 9 »). Le point de la regex n'est pas échappé. De plus, le nom et le commentaire (« true if version 1 is older ») disent le contraire de ce que fait la fonction, qui renvoie `true` si v1 ≥ v2.

Changement : parser les groupes en nombres, échapper le point et renommer la fonction en `isVersionAtLeast(v, min)`.

**Risque** : faible. Un seul appelant (`GameService.run`). Le test du commit 1 passe au vert.

## Lot 3 — Dé-duplication du domaine

### 7. `fix(store): return fresh model instances instead of shared catalog objects` 🔴 ✅ fait

`StoreService.getZone`, `getCharacter`, `getWeapon`, `getMateria` et `getItem` renvoient l'instance stockée dans `DataService`. La partie du joueur, la boutique et les sauvegardes successives partagent donc les mêmes objets.

Conséquence : `GameService.preload()` recrée bien les collections, mais `buildLevel()` et `load()` y remettent les instances déjà modifiées. Après une réinitialisation ou un import, `Zone.nbFights` et `completed`, le niveau et l'AP des materias, `Weapon.nbr`, ainsi que l'XP et `inTeam` des personnages gardent les valeurs de la partie précédente. Par ailleurs, une arme achetée est l'objet même du catalogue, ce qui mélange `nbr` et `equipped` entre les deux.

Changement : `DataService` garde les données JSON brutes, et `StoreService` construit une nouvelle instance à chaque appel. Les fabriques par `type` (`buildItems`, `buildMaterias`) passent dans `StoreService`.

**Risque** : moyen. Il faut vérifier toutes les comparaisons par identité (`===`), par exemple `ViewEquipComponent` (`team.find(c => c === selected)`), les ventes en boutique (`filter(e => e !== weapon)`) et `useItem`. Elles restent valides tant qu'elles comparent des objets du stock du joueur entre eux. Les tests du commit 2 servent de filet. Ce commit doit précéder le rebranchement de Réinitialiser et d'Importer.

### 8. `refactor(shop): single source for shop catalog` 🟠 ✅ fait

Le catalogue de la boutique (listes de refs, filtre `zoneAvailable <= levelMax`) est dupliqué entre `ShopService.refresh()` et `ViewShopComponent.refresh()`. L'écran Boutique n'utilise pas `ShopService` : l'appel `shopService.refresh()` dans `ViewMapComponent.goNextZone()` ne sert à rien. De plus, `sortWeapons` ne connaît que 3 types d'armes sur 6.

Changement : `ShopService` expose des `computed` du catalogue trié à partir de `zones.levelMax`. La vue s'appuie dessus, et l'appel inutile dans la Carte disparaît. Compléter l'ordre des types.

**Risque** : faible. Vérifier visuellement la boutique en zone 1 et en zone 7 (achat et vente).

### 9. `refactor(game): extract game constants and stat formulas` 🟢 ✅ fait

Plusieurs règles sont écrites en dur à plusieurs endroits :
- le facteur de stat `((s - 3) * 10) / 100 + 1`, répété 9 fois dans `Character`, `Enemy` et `Materia`
- la variation de ±10 %, dans `Attack.calculateHits`, `Cure.calculateHits` et `Enemies.getHits`
- le niveau max 100, dans `Character.setXp` et `Materia.setAp`
- le seuil d'accès au PHS (`levelMax >= 5`), dans `ZoneGuard` et `SidemenuComponent.displayPhs`

Changement : créer `shared/utils/game.utils.ts` (`statFactor`, `withVariance`, `MAX_LEVEL`, `PHS_UNLOCK_ZONE`).

**Risque** : très faible si le commit 1 est en place. Attention à garder les arrondis (`Math.ceil` ou `Math.round`) au même endroit.

### 10. `refactor(game): move bootstrap side effects out of GameService constructor` 🟠 ✅ fait

Le constructeur de `GameService` lance `run()` : il lit `localStorage`, charge la sauvegarde et démarre le timer. Cela rend le service difficile à tester (voir les mocks du commit 2), et la logique de réinitialisation est éparpillée dans `ViewSaveComponent.resetGame()`, qui enchaîne `preload`, `reset`, `buildLevel(1)` et `postload`.

Changement :
- lancer `run()` depuis l'initialiseur d'application, après `DataService.preloadAll()`
- exposer `newGame()` et `importGame(save)` dans `GameService`, à appeler depuis la vue

**Risque** : moyen. L'ordre d'initialisation change. Vérifier un démarrage sans sauvegarde, un démarrage avec sauvegarde, et un changement de langue au démarrage.

## Lot 4 — Modernisation (Angular 22, zoneless)

### 11. `refactor(units): convert team and battle state to signals` 🔴 ✅ fait

Avec le mode zoneless, seuls `Units.hp` et `BattleService.battle` sont des signaux. `Characters.mp`, `limit`, `hpMax`, `mpMax`, ainsi que `GameService.gils` et `time`, sont des champs simples que les timers modifient (`Battle.start`, `autoTimer`). Ces changements ne s'affichent que si un autre événement relance la détection de changements. C'est pour cela que `CharactersPanelComponent` est resté en `ChangeDetectionStrategy.Eager`.

Changement : passer ces champs en `signal` / `computed` (`hpMax`, `mpMax`, `limitMax`, `hits` deviennent des `computed` sur l'équipe), puis repasser `CharactersPanelComponent` en OnPush par défaut. Adapter les templates (`characters.mp()`) et `export()` / `load()`.

**Risque** : élevé, car de nombreux fichiers sont touchés (modèles, vues, objets, materias). Découper si besoin : d'abord `mp` et `limit`, ensuite `gils` et `time`, enfin les max en `computed`. Tester en jeu : barres MP et Limite pendant un combat sans clic, compteur de gils et temps de jeu dans la sauvegarde.

### 12. `refactor: use input(), viewChild() and inject()` 🟢 ✅ fait

À migrer :
- les `@Input()` de `ProgressBarComponent`, `MateriaIconComponent`, `WeaponIconComponent`, `UiFooterComponent`, `CharactersPanelComponent` et `EnemiesPanelComponent`
- le `@ViewChild` de `AppComponent`
- l'injection par constructeur, partout

`ProgressBarComponent.hits` peut devenir un `input<Observable<ItDisplayHits>>()`.

**Risque** : faible, la migration est mécanique (schématics `ng g @angular/core:signal-input-migration` et `inject-migration`). Les templates qui lisent ces inputs doivent les appeler (`progress()`).

### 13. `refactor(guards): use functional guards` 🟢 ✅ fait

Remplacer les classes `BattleGuard` et `ZoneGuard` (avec leur signature de retour verbeuse) par des `CanActivateFn` qui utilisent `inject()`. Mettre à jour `app.routes.ts` et les deux specs.

**Risque** : très faible.

### 14. `refactor(app): simplify initializer and router subscription` 🟢 ✅ fait

- `app.config.ts` : `provideAppInitializer` enveloppe une IIFE et appelle `toPromise()`, qui est déprécié. Remplacer par `provideAppInitializer(() => inject(DataService).preloadAll())`.
- `AppComponent.ngOnInit` : l'abonnement à `router.events` n'est jamais libéré. Utiliser `takeUntilDestroyed()`, ou un `effect` sur `toSignal(router.events)`.

**Risque** : très faible.

### 15. `refactor(help): import intro.js as an ES module` 🟢

intro.js est chargé comme script global (`angular.json` → `scripts`) et typé à la main avec `declare const introJs` dans `SidemenuComponent`. Utiliser `import introJs from 'intro.js'` (la librairie fournit ses types) et un import dynamique au clic pour sortir la librairie du bundle initial.

**Risque** : faible. Vérifier que le tutoriel se lance et que le CSS (`introjs.css`, toujours dans `styles`) est bien appliqué.

## Lot 5 — Nettoyage

### 16. `chore: remove dead code` 🟢

À supprimer :
- `Characters.autoFighting`, et les anciennes versions de `hasWeakness` / `hasResistance` commentées dans `models/units/characters.ts`
- `Units.arrHits`, qui n'est jamais lu (la barre de progression a son propre `arrHits`)
- `Enemies.timer` et `Enemies.remove`
- `Zones.getOthers`, et `Zones.nextZone`, qui est écrit mais jamais lu
- les lignes commentées de `Zones.complete`
- `GameService.lastExport`
- `Weapon.canEquip`, qui renvoie toujours `true`
- `UiMainContainerComponent`, jamais utilisé
- `msgImportSave` et `msgResetGame` dans `ViewSaveComponent`, à garder seulement si la confirmation les réutilise

**Risque** : très faible. Le build et le lint détectent les références restantes.

### 17. `fix(config): store difficulty as a number` 🟢

Dans `view-config.component.html`, `<option value="1">` avec `ngModel` enregistre `difficulty` comme une chaîne (« 1 »), qui part ensuite dans la sauvegarde typée `number`. `Enemy.toLevel` ne fonctionne que grâce à la conversion implicite de JavaScript. Utiliser `[ngValue]="Difficulty.Easy"`, etc.

**Risque** : faible. Les anciennes sauvegardes contenant « 2 » : convertir avec `Number()` dans `load()`.

### 18. `refactor(models): fix misleading names and comments` 🟢

- `Materia.inStock` renvoie un booléen alors que son commentaire parle d'un nombre ; le renommer en `isOwned`.
- `Character.notAvailable` est commenté « Returns true if the character is available ».
- `Units.hasResistance` porte le commentaire de `hasWeakness`.
- `DataService.buildCharacters` indique « Depends: enemies » alors qu'il dépend des armes.
- Le paramètre `zoneLlevelMax` contient une faute de frappe.

**Risque** : nul, sauf les appelants de `inStock` à renommer.

## Graphe des dépendances

```
1 ─┬─> 2 ─┬─> 5
   │      ├─> 7 ──> [rebrancher Réinitialiser/Importer]
   │      ├─> 10 ─> 11
   │      └─> 8
   ├─> 6
   └─> 9
3 ──> [rebrancher Importer]
4, 12, 13, 14, 15, 16, 17, 18 : indépendants (12 de préférence après 11)
```

## Ordre conseillé si le temps est limité

1. **1, 2** — sans filet, les commits suivants sont risqués.
2. **3** — une sauvegarde corrompue empêche aujourd'hui le jeu de démarrer.
3. **7**, puis rebrancher Réinitialiser et Importer (hors refactor) — fonctionnalités perdues pour le joueur.
4. **11** — rend le mode zoneless fiable, ce qui est l'objectif actuel de la branche.
5. **4, 5** — fuite d'abonnements et logique métier dans la vue.
