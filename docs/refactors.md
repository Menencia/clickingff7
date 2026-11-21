# Refactors prioritaires

**Légende** : 🔴 haute · 🟠 moyenne · 🟢 basse

**Vérifications après chaque commit** (identiques à la CI) : `pnpm build`, `pnpm test:ci`, `pnpm lint`. Chaque commit doit les laisser au vert. Si un commit change une règle de jeu ou le format de sauvegarde, il met aussi à jour `specs.md` (voir CLAUDE.md).

## Hors refactor

- **Emplacements de materia dépassés** 🟠 ✅ fait (bug n°1 de `docs/bugs.md`) : le nombre d'emplacements (`Characters.getMaxMaterias()`) dépend des armes de l'équipe, mais rien ne déséquipe les materias en trop quand il diminue. Exemple : Aerith (bâton, 2 emplacements) quitte l'équipe dans le PHS, et les materias équipées restent au-dessus de la limite. Plus simple à corriger après le commit 3, qui regroupe les règles d'équipement.
- **Sécurité** : rien à signaler. L'application tourne uniquement côté client, sans backend. Le joueur peut modifier sa sauvegarde en base64, ce qui est acceptable pour un jeu solo.

## Lot 1 — Filet de tests

### 1. `test(views): cover team, equipment and zone rules` 🟠 ✅ fait

Les specs de `ViewEquipComponent`, `ViewPhsComponent`, `ViewMapComponent`, `ViewMateriaComponent`, `ViewItemsComponent` et `UiActionsComponent` ne contiennent que `should create`. Or ces vues portent des règles de jeu que les commits 2 à 4 vont déplacer.

Tester avec les données réelles (`testing/game-data.testing.ts`) :
- `equipWeapon` (l'arme précédente du même type est déséquipée, les stats de l'équipe sont recalculées)
- `joinTeam` / `leaveTeam` et leurs limites (`MAX_TEAM`, au moins 1 personnage)
- `goNextZone` (zone connue ou nouvelle zone, avec déblocages de `buildLevel`) et `goZone`
- l'équipement des materias et des objets (limites d'emplacements et `MAX_ITEMS`)
- `escape`

**Risque** : nul pour le code de production. Écrire ces tests au niveau du service ou du modèle quand c'est possible, pour qu'ils survivent aux commits suivants.

## Lot 2 — Logique métier hors des vues

### 2. `refactor(shop): move buy and sell rules to ShopService` 🟠 ✅ fait

`ViewShopComponent` (`buyWeapon`, `sellWeapon`, `buyMateria`, `sellMateria`, `buyItem`, `sellItem`) débite et crédite les gils, ajoute au stock et retire de `gameService.*.list`. Les méthodes d'achat ne vérifient pas les gils : seul le `[disabled]` du template l'empêche. C'est le même problème que celui que le commit 5 de l'analyse précédente a réglé pour les actions de combat.

Changement : `ShopService.buy*()` / `sell*()` vérifient `canBuy*` / `canSell*`, appliquent l'opération et ne font rien si elle est impossible. La vue délègue puis rafraîchit ses listes.

**Risque** : faible. Les tests existants de `view-shop.component.spec.ts` (copie et non objet du catalogue, materia équipée invendable, empilement des objets) passent dans `shop.service.spec.ts`.

### 3. `refactor(game): move team and equipment rules out of views` 🟠 ✅ fait

Ces règles sont écrites dans les vues, et leurs limites ne sont vérifiées que par le template :
- `ViewPhsComponent.joinTeam` / `leaveTeam` modifient `character.inTeam` (limites `MAX_TEAM` et 1 personnage minimum)
- `ViewEquipComponent.equipWeapon` déséquipe l'arme du même type, modifie `selected.weapon` et appelle `refresh()`
- `ViewMateriaComponent.equip` (limite `getMaxMaterias()`) et `ViewItemsComponent.equipItem` (limite `MAX_ITEMS`)
- `UiActionsComponent.escape` appelle directement `battle.end(false)`

Changement : `Characters.join()` / `leave()`, `GameService.equipWeapon(character, weapon)`, `Materias.equip(m, max)`, `Items.equip(i)` et `BattleService.escape()`. Chaque méthode vérifie sa limite et appelle `refresh()` si besoin. Les vues délèguent.

**Risque** : moyen, car cinq écrans sont touchés. Le commit 1 sert de filet. Découper par écran si besoin. Ce commit prépare la correction du bug n°1 et les commits 5 et 9.

### 4. `refactor(zones): move zone navigation and unlock out of ViewMapComponent` 🟠 ✅ fait

`ViewMapComponent.goNextZone()` incrémente `zones.level` et `zones.levelMax`, puis appelle `buildLevel()` et `characters.refresh()`. Ce dernier appel est redondant, puisque `buildLevel()` le fait déjà. `goZone()` modifie `zones.level` directement. La progression du jeu dépend donc d'un composant.

Changement : `Zones.goTo(level)` et `GameService.goNextZone()` (débloque et construit la zone si elle est nouvelle). La vue délègue.

**Risque** : faible. Vérifier le passage en zone 5 (Red XIII, accès au PHS) et en zone 9 (Yuffie). Le commit 1 couvre `goNextZone`.

### 5. `refactor(weapons): derive equipped state from characters` 🟢 ✅ fait

L'arme portée est stockée deux fois : `Character.weapon` et `Weapon.equipped`. `GameService.linkWeapons()` doit les réaligner après `buildLevel()` et `load()`. La sauvegarde contient les deux (`characters[].weaponRef` et `weapons[].equipped`), qui peuvent se contredire dans une sauvegarde modifiée à la main.

Changement : une seule source, `Character.weapon`. `Weapons.isEquipped(weapon, characters)` remplace le champ `equipped`. Continuer d'écrire `equipped` dans la sauvegarde pour rester compatible avec la 1.5.0, mais l'ignorer au chargement.

**Risque** : moyen, car le format de sauvegarde est concerné : mettre à jour `specs.md` §11, garder le test d'aller-retour `export()` / `load()` et charger une sauvegarde 1.5.0. Dépend du commit 3.

### 6. `refactor(models): share stock logic between weapons, materias and items` 🟢

Plusieurs logiques sont dupliquées :
- `getPrice()` / `getSellPrice()` dans `Weapon`, `Materia` et `Item`
- `inStock()`, identique dans `Weapon` et `Item`
- `Weapons.add()` et `Items.add()`, identiques (empilement par `ref`)
- la boucle de `export()` dans les trois collections
- `getEquipped()` dans `Materias` et `Items`

Changement : une classe de base pour les objets achetables (prix et revente) et une pour les collections empilables (`add`, `inStock`, `export`).

**Risque** : faible, la refactorisation est mécanique. À faire après le commit 2 pour ne déplacer la logique de boutique qu'une fois.

## Lot 3 — Lisibilité

### 7. `refactor(units): separate queries from side effects and fix misleading names` 🟢

- `Characters.isAlive()` remet `hp` et `limit` à 0, et `Enemies.isAlive()` remet `hp` à 0, alors que `getAttacked()` borne déjà les HP à 0.
- `Characters.getAttackSkill()` vide la jauge de Limite : un simple « get » consomme une ressource.
- `ThemePickerComponent.isDarkMode` vaut `true` quand le thème est **clair** (`cupcake`). La valeur `'dark'` est écrite en dur à côté de `DEFAULT_THEME`.
- Le commentaire de `CureMateria.getSkill` annonce « +30% to +60% », alors que Restaurer soigne 20 % des HP max au niveau 1.
- `BattleService` contient un commentaire orphelin (« Returns true if zone boss is available ») au-dessus de `canFightRandom`.

Changement : `isAlive()` sans effet de bord, et remise à zéro de la Limite à la défaite dans `Battle.end` ou `BattleService`. La Limite est consommée dans `BattleService.attack()`. Renommer `isDarkMode` en `isLightTheme`. Corriger les commentaires.

**Risque** : faible. `characters.spec.ts` et `battle.spec.ts` couvrent la Limite et la défaite. Vérifier en jeu que la Limite repart à 0 après une défaite.

### 8. `refactor(models): type weapon types and enemy refs` 🟢

Les types d'arme (`'broadsword'`, `'gun-arm'`…) sont des chaînes libres dans `WeaponJson.type`, `CharacterBase.weaponType` et `WEAPON_TYPE_ORDER` (`shop.service.ts`), ainsi que dans `WeaponIconComponent`. C'est une faute de frappe de ce genre (`yuffie` au lieu de `shuriken`) qui empêchait Yuffie de changer d'arme. De même, `ZoneJson.enemies` / `boss` sont des `string[]`, et `StoreService.getEnemy(ref: string)` n'utilise pas `EnemyRef`.

Changement : un type union `WeaponType`, et `EnemyRef` dans `ZoneJson` et `getEnemy`. Un test de `store.service.spec.ts` vérifie que chaque type d'arme des JSON est connu.

**Risque** : très faible, le compilateur signale les écarts.

## Lot 4 — Modernisation

### 9. `refactor(views): read the team from the Characters.team signal` 🟢

`ViewEquipComponent`, `ViewPhsComponent` et `ViewMateriaComponent` recopient l'équipe (`getTeam()`, `getBackup()`) ou `getMaxMaterias()` dans des champs au constructeur, puis les recalculent à la main après chaque action. `Characters.team` est déjà un signal.

Changement : `computed` sur `characters.team()` pour l'équipe, la réserve et le nombre d'emplacements. Supprimer les `refresh()` locaux des vues.

**Risque** : faible. Dépend du commit 3. Rester en OnPush et vérifier que le PHS et l'Équipement se mettent à jour sans changer d'écran.

## Lot 5 — Nettoyage

### 10. `chore: remove dead code and unused scripts` 🟢 ✅ fait

À supprimer :
- dans `ProgressBarComponent` : `progressBg`, `time`, son `setTimeout` et son `clearTimeout`, `Math` et l'input `name`, qui ne sont pas lus par le template (adapter le test « updates the background after 300 ms » et retirer `[name]` des appelants)
- `Characters.hpProgress`, `mpProgress`, `limitProgress` et `Enemies.hpProgress`, jamais appelés
- `Zones.getAll`, `Materias.getUnequipped`, `Items.getUnequipped` et le champ `Items.equipped`
- le paramètre `confirm` de `GameService.load()` et `save()`, vestige de l'ancienne confirmation PrimeNG
- l'`async` inutile du `subscribe` dans `BattleService.startBattle`
- dans `package.json`, le script `check` (il lance `ng lint`, qui n'est plus configuré) et `lint:ci`, que la CI n'utilise pas (ou faire utiliser `lint:ci` par la CI)

**Risque** : très faible. Le build et le lint détectent les références restantes.

## Graphe des dépendances

```
1 ─┬─> 2 ──> 6
   ├─> 3 ─┬─> 5
   │      ├─> 9
   │      └─> [corriger le bug n°1]
   └─> 4
7, 8, 10 : indépendants
```

## Ordre conseillé si le temps est limité

1. **1** : les vues n'ont aucun test, alors que les commits 2 à 4 déplacent leur logique.
2. **3**, puis la correction du bug n°1 : règles d'équipement regroupées, et un bug visible par le joueur.
3. **2, 4** : le reste de la logique métier quitte les vues.
4. **10** : nettoyage rapide et sans risque.
