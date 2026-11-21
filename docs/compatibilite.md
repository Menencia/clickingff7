# Compatibilité avec les anciennes versions

Liste de tous les endroits du code qui gèrent des données écrites par une version précédente du jeu (sauvegarde, `localStorage`). **À tenir à jour** : tout code de compatibilité ajouté ou retiré doit ajouter ou retirer son entrée ici, dans le même changement.

Pour chaque entrée : ce qui est géré, depuis quand, où dans le code, comment c'est testé, et quand on pourrait le retirer.

## Sauvegarde (`localStorage['save1']`)

### 1. Sauvegardes antérieures à la 1.1.0 abandonnées

- **Ce qui est géré** : au démarrage, une sauvegarde dont la version est < 1.1.0 est ignorée et une nouvelle partie démarre. L'import (écran Sauvegarde) ne vérifie pas la version.
- **Code** : `GameService.run()` (`src/app/core/services/game.service.ts`), via `isVersionAtLeast()` (`src/app/shared/utils/version.utils.ts`).
- **Tests** : `game.service.spec.ts` (« discards a save older than 1.1.0 and starts a new game »), `version.utils.spec.ts`.
- **Spécification** : `specs.md` §11, « Au démarrage ».
- **Retrait** : relever le seuil si une future version casse la compatibilité avec un format plus récent.

### 2. Difficulté enregistrée en chaîne

- **Ce qui est géré** : les anciennes sauvegardes stockent la difficulté en chaîne (`"2"`). Elle est acceptée à la validation et convertie en nombre au chargement.
- **Code** : `isNumeric()` dans `src/app/shared/utils/save.utils.ts`, `Number(save.difficulty)` dans `GameService.load()`.
- **Tests** : `save.utils.spec.ts` (« accepts a difficulty stored as a numeric string »), `game.service.spec.ts` (« converts a difficulty stored as a string to a number »).
- **Spécification** : `specs.md` §11, « Difficulté ».
- **Retrait** : quand les sauvegardes antérieures à la conversion en nombre ne sont plus chargées (seuil du point 1).

### 3. Champ `weapons[].equipped`

- **Ce qui est géré** : depuis la version qui suit la 1.5.0, l'arme portée ne vient que de `characters[].weaponRef`. Le champ `weapons[].equipped` est encore **écrit** (calculé à partir des personnages) pour qu'une sauvegarde reste lisible par la 1.5.0, mais il est **ignoré** au chargement et facultatif à la validation.
- **Code** : `WeaponSave.equipped` (`src/app/models/save.ts`), `Weapon.export()` (`src/app/models/weapon.ts`), `Weapons.export()` (`src/app/models/weapons.ts`), `isOwnedWeapon()` dans `src/app/shared/utils/save.utils.ts`, `GameService.load()`.
- **Tests** : `game.service.spec.ts` (« derives the equipped weapons from the characters on load », « loads a save without weapons[].equipped »), `save.utils.spec.ts` (« accepts a weapon without the equipped field »).
- **Spécification** : `specs.md` §11, « Contenu ».
- **Retrait** : quand la compatibilité descendante avec la 1.5.0 (import d'une sauvegarde récente dans la 1.5.0) n'est plus souhaitée, cesser d'écrire le champ et le retirer de `WeaponSave`.

## Paramètres hors sauvegarde

### 4. Thème `light`

- **Ce qui est géré** : les anciennes versions enregistraient le thème clair sous la valeur `light`, qui n'est plus un thème daisyUI configuré. Elle est convertie en `cupcake` au chargement.
- **Code** : `ThemePickerComponent.ngOnInit()` (`src/app/shared/components/theme-picker/theme-picker.component.ts`), clé `localStorage['theme']`.
- **Tests** : aucun.
- **Spécification** : `specs.md` §9, « Thème ».
- **Retrait** : à tout moment, au prix d'un retour au thème par défaut pour les joueurs concernés.
