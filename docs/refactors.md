# Refactors prioritaires

Analyse du 22/11/2026, commit `c5d5cb0` (version 1.6.0). Tout le code de `src/app` a été lu (services, modèles, vues, composants partagés, utilitaires, specs survolées). Les templates HTML et les styles n'ont été consultés que pour vérifier des usages.

**Légende** : 🔴 haute · 🟠 moyenne · 🟢 basse

**Vérifications après chaque commit** (identiques à la CI) : `pnpm build`, `pnpm test:ci`, `pnpm lint`. Chaque commit doit les laisser au vert. Si un commit change une règle de jeu ou le format de sauvegarde, il met aussi à jour `specs.md`, et s'il touche du code de compatibilité, `docs/compatibilite.md` (voir CLAUDE.md).

Les 10 entrées de l'analyse précédente (filet de tests des vues, logique métier sortie des vues, armes portées dérivées des personnages, `Stock`, typage des armes, signal `team`, nettoyage) sont toutes livrées.

## Hors refactor

- **Sauvegarde incohérente acceptée au chargement** 🟠 (bug n°2 de `docs/bugs.md`) : `decodeSave()` ne vérifie que la forme du JSON, et `GameService.load()` recopie `zones.level` / `levelMax` sans contrôle. Une sauvegarde modifiée à la main avec une zone courante absente de `zones.list` est acceptée par `importGame()` (rien n'appelle `zones.current()` pendant `tryLoad()`), puis `UiActionsComponent.remainingBattles()` lève « Zone not found » à chaque rendu de l'écran Jeu. Même chose si aucun personnage n'est dans l'équipe : `characters.select()` laisse `selected` à `undefined` et l'écran Équipement plante. Une difficulté hors de 1 à 3 et plus de `MAX_ITEMS` objets équipés passent aussi. Corrigé par le commit 2.
- **Sécurité** : rien à signaler. Le jeu tourne uniquement côté client, sans backend ni appel externe. Le joueur peut modifier sa sauvegarde en base64, ce qui est acceptable pour un jeu solo, du moment qu'elle ne fait pas planter le jeu (point précédent).

## Lot 1 — Filet de tests

### 1. `test(units): cover enemy damage and the zone 9 unlock` 🟠 ✅ fait

`Enemies` (`models/units/enemies.ts`) n'a pas de spec : `getAttacked()` (faiblesse ×3, résistance ÷3) et `refresh()` (union des faiblesses et résistances du groupe, PV max) ne sont testés qu'indirectement. Dans `game.service.spec.ts`, `buildLevel` est testé pour les zones 1 à 5, pas pour la zone 9 (Yuffie et le 4-pt Shuriken).

Ajouter `enemies.spec.ts` et un cas `zone 9` dans `game.service.spec.ts`.

**Risque** : nul pour le code de production. Sert de filet aux commits 6 et 11.

## Lot 2 — Fiabilité

### 2. `fix(save): reject saves whose zone or team cannot be played` 🟠 ✅ fait

Voir « Hors refactor ». À la fin de `GameService.load()`, vérifier ce que `decodeSave()` ne peut pas savoir : `zones.current()` existe, `levelMax` ne dépasse ni `MAX_ZONES` ni la dernière zone de la liste, l'équipe compte au moins un personnage disponible, `difficulty` est une valeur de `Difficulty`. En cas d'écart, lever une erreur : `tryLoad()` la transforme déjà en refus (import refusé, ou nouvelle partie au démarrage). Ramener les objets équipés à `MAX_ITEMS`, comme `fitMaterias()` le fait pour les materias.

**Risque** : faible. Une sauvegarde valide ne doit pas être refusée : tester l'aller-retour `export()` / `load()` en zones 3 et 4 (personnages indisponibles) et en zone 9. Mettre à jour `specs.md` §11, `docs/bugs.md` (retirer le n°2) et le changelog.

### 3. `refactor(progress-bar): hold the floating hits in a signal` 🟢 ✅ fait

`ProgressBarComponent.arrHits` est un tableau mutable rempli dans un `subscribe` à `Units.source.hp`, qui émet depuis le `setTimeout` de `Battle.start()`. En zoneless, les dégâts flottants ne s'affichent que parce que `hp` change dans la même tâche et rafraîchit la vue : c'est un couplage caché.

Changement : `arrHits` devient un `signal<ItDisplayHits[]>`, mis à jour avec `update()` dans le `subscribe` et dans `onAnimationEvent()`.

**Risque** : très faible. Vérifier en combat que les dégâts et soins flottants apparaissent et disparaissent. `progress-bar.component.spec.ts` couvre l'ajout et le retrait.

### 4. `fix(save): report a failed save to the player` 🟢

`GameService.save()` écrit dans `localStorage` sans `try`/`catch`. Si l'écriture échoue (quota, stockage désactivé), l'erreur part dans le listener global et l'écran Sauvegarde ne dit rien : le joueur croit avoir sauvegardé.

Changement : `save()` renvoie `false` en cas d'échec et `ViewSaveComponent` affiche un message (nouvelle clé dans `fr`, `en`, `es`).

**Risque** : faible. Tester avec un `localStorage.setItem` qui lève. Entrée au changelog.

## Lot 3 — Dé-duplication du domaine

### 5. `refactor(models): add Stock.remove for selling and consuming` 🟠 ✅ fait

La même logique (« décrémenter `nbr`, ou retirer l'entrée de la liste à la dernière copie ») est écrite trois fois : `ShopService.sellWeapon()`, `ShopService.sellItem()` et `BattleService.useItem()`.

Changement : `Stock.remove(entry)` dans `models/stock.ts`, appelé aux trois endroits.

**Risque** : très faible. `stock.spec.ts`, `shop.service.spec.ts` et `battle.service.spec.ts` couvrent les trois cas (plusieurs copies, dernière copie).

### 6. `refactor(units): share elemental damage between characters and enemies` 🟢

`Characters.getAttacked()` et `Enemies.getAttacked()` dupliquent le calcul faiblesse / résistance. Seul le diviseur change (÷10 pour l'équipe, ÷3 pour les ennemis), écrit en dur dans chaque méthode.

Changement : une méthode protégée `Units.applyAffinities(hits, elements)` et un diviseur de résistance déclaré par sous-classe. Chaque `getAttacked()` garde ses effets propres (jauge de Limite pour l'équipe).

**Risque** : faible, aucun chiffre ne doit changer. Dépend du commit 1 (`characters.spec.ts` couvre déjà l'équipe).

### 7. `refactor(models): type elements and rename attack types to elements` 🟢

Les éléments (`'bolt'`, `'fire'`, `'wind'`…) sont des `string[]` libres dans `EnemyJson.weakness` / `resistance`, `Units`, `AttackMateriaJson.elements` et `Attack`. Dans `ItActionAttack`, ils s'appellent `type`, alors que `Materia.type` / `Item.type` désignent la sous-classe à instancier.

Changement : un type union `Element` (sur le modèle de `WeaponType`), `ItActionAttack.type` renommé `elements`. Un test de `store.service.spec.ts` vérifie que chaque élément des JSON est connu.

**Risque** : très faible, le compilateur signale les écarts. Plus simple après le commit 6, qui regroupe les usages.

### 8. `refactor(models): move zone availability and power to base classes` 🟢

- `zoneAvailable` est déclaré dans `Weapon`, `Materia` et `Item`. Seul `Item` a une méthode `available()` ; `ShopService.getWeapons()` / `getMaterias()` recopient le test `zoneAvailable <= levelMax`.
- `getPwr()` est identique dans `AttackMateria` et `CureMateria`.

Changement : `zoneAvailable` et `isAvailable(levelMax)` dans `Purchasable`, utilisés par les trois getters de `ShopService` ; `getPwr()` dans `Materia`.

**Risque** : très faible. `shop.service.spec.ts` couvre le filtrage du catalogue par zone, `materia.spec.ts` le coût en PM.

### 9. `refactor(zones): expose the PHS unlock from Zones` 🟢

La règle `zones.levelMax >= PHS_UNLOCK_ZONE` est recopiée dans `zoneGuard`, `DockComponent.displayPhs()` et `SidemenuComponent.displayPhs()`.

Changement : `Zones.isPhsUnlocked()`, appelée aux trois endroits.

**Risque** : très faible. `zone.guard.spec.ts` couvre la règle, mais simule `zones` par un objet `{ levelMax }` : le passer à une vraie instance de `Zones`. Ni le dock ni le menu latéral ne testent l'affichage du PHS : en ajouter un.

### 10. `refactor(battle): name the enemy scaling rules` 🟢

`BattleService` contient des formules d'équilibrage sans nom : niveau du boss `zone.level * (nbCharacters + 1) * 3 * 1.4` dans `startBoss()`, bonus ×1,2 des mini-boss et plage d'ennemis `nbFights / MAX_FIGHTS * 4` (bornée à 3) dans `getRandomEnemy()`. `startBoss()` et `onTeamVictory()` relisent l'équipe avec `getTeam()` au lieu du signal `team()`, et `onTeamVictory()` est public sans raison.

Changement : constantes nommées et petites fonctions (`bossLevelSum(zone, teamSize)`), `team()` partout, `onTeamVictory()` privé.

**Risque** : faible, aucun chiffre ne doit changer. `battle.service.spec.ts` couvre le niveau du boss et la plage d'ennemis. Vérifier que `specs.md` décrit toujours les mêmes formules.

## Lot 4 — Lisibilité

### 11. `refactor(game): describe zone unlocks as a table` 🟢 ✅ fait

`GameService.buildLevel()` (≈ 80 lignes, le plus gros bloc du plus gros fichier) code les déblocages dans un `switch` : personnages, armes, materias et objets ajoutés, et retour de Barret et Tifa en zone 4.

Changement : une table déclarative `ZONE_UNLOCKS` (personnage et entrée dans l'équipe, armes, materias, objets, personnages qui rejoignent l'équipe) lue par `buildLevel()`. La remise à niveau et la restauration des PV / PM restent dans la méthode.

**Risque** : moyen, c'est la progression du jeu. Dépend du commit 1 (zone 9). Les tests `buildLevel` des zones 1 à 5 et 9 doivent passer sans modification. `specs.md` reste valable, car les règles ne changent pas.

### 12. `refactor(save): keep a single last save in GameService` 🟢

`GameService.saves: Save[]` ne sert qu'à l'indice 0 (`saves[0] = s` dans `save()`, `saves.push()` dans `run()`). `ViewSaveComponent` recopie la référence du tableau dans son constructeur, alors que `reset()` le remplace par un nouveau.

Changement : `readonly lastSave = signal<Save | undefined>(undefined)`, lu directement par la vue et son template.

**Risque** : faible. `view-save.component.spec.ts` couvre la réinitialisation ; vérifier aussi l'export de la dernière sauvegarde et l'affichage du résumé après « Sauvegarder », sans changer d'écran.

### 13. `refactor(characters): take character images from the catalog` 🟢

`CharacterSave.image` est écrit dans la sauvegarde, et `Character.load()` écrase avec lui l'image de `characters.json`. Le jour où une image est renommée ou convertie (par exemple en `.webp`), les anciennes sauvegardes afficheraient une image cassée.

Changement : ignorer `image` au chargement et prendre celle du catalogue. Continuer à l'écrire pour que la 1.6.0 puisse lire une sauvegarde récente. L'écran Sauvegarde, qui affiche les portraits depuis la sauvegarde, les cherche dans le catalogue par `ref`.

**Risque** : faible, mais c'est du code de compatibilité : ajouter l'entrée dans `docs/compatibilite.md` et mettre à jour `specs.md` §11. Plus simple après le commit 12, qui touche le même écran.

## Lot 5 — Modernisation

### 14. `refactor(battle): replace the state subject with an end callback` 🟢

`Battle` publie un `BehaviorSubject<BattleState>` pour une seule transition (`Started` → `Ended`), auquel `BattleService.startBattle()` s'abonne. Le constructeur de `Battle` lance aussi le premier `setTimeout`, ce qui oblige les tests à créer le combat au bon moment.

Changement : `Battle` reçoit un rappel `onEnd(victory)` (ou expose un signal `ended`), et `start()` est appelé explicitement par `BattleService`. `BattleState` disparaît s'il n'a plus d'usage.

**Risque** : moyen, c'est la boucle de combat. `battle.spec.ts` et `battle.service.spec.ts` couvrent victoire, défaite, fuite et Limite. Vérifier en jeu qu'un combat se termine une seule fois (victoire par materia pendant une attaque ennemie).

### 15. `refactor(theme): read the saved theme when the picker is created` 🟢

`ThemePickerComponent` écrit le thème deux fois au démarrage : `ngOnInit()` (sans `implements OnInit`) puis l'`effect` du constructeur. La conversion de l'ancienne valeur `light` (entrée n°4 de `docs/compatibilite.md`) n'a aucun test.

Changement : initialiser `isLightTheme` depuis `localStorage` à la création, garder l'`effect` comme seule écriture, supprimer `ngOnInit()` et `DEFAULT_THEME`. Ajouter les tests de la conversion `light` → `cupcake` et mettre à jour la ligne « Tests » de l'entrée n°4.

**Risque** : faible. Vérifier au premier lancement (sans clé `theme`) que le thème sombre s'applique, et qu'un thème clair enregistré est conservé.

## Lot 6 — Nettoyage

### 16. `chore: remove dead code and redundant options` 🟢 ✅ fait

À supprimer :
- `Characters.getBackup()`, remplacé par le `computed` `backup`
- `Attack.critical`, écrit mais jamais lu
- l'affectation de `ref` dans `Materia.load()` (déjà fixé par le catalogue)
- `standalone: true` de `PipeTimePipe` (valeur par défaut en Angular 22)
- la valeur par défaut `'0.1.0'` de `UiFooterComponent.version`, toujours fournie par `AppComponent`
- les deux méthodes `round()` de `CharactersPanelComponent` et `EnemiesPanelComponent`, à remplacer par des pourcentages calculés (`computed`) dans chaque panneau

**Risque** : très faible. Le build et le lint détectent les références restantes.

## Graphe des dépendances

```
1 ─┬─> 6 ──> 7
   └─> 11
2, 3, 4, 5, 8, 9, 10, 14, 15, 16 : indépendants
12 ──> 13
```

## Ordre conseillé si le temps est limité

1. **2** : seul bug visible (sauvegarde modifiée qui fait planter le jeu), et correction courte.
2. **5** : la dé-duplication la plus utile, sans risque.
3. **1, puis 11** : filet de tests, puis la table des déblocages, qui rend la progression lisible et facilite l'ajout de zones.
4. **3** : supprime un couplage caché avec le zoneless.
5. **16** : nettoyage rapide et sans risque.
