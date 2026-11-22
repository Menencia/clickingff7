# Bugs connus

Écarts constatés dans le code actuel : bugs avérés ou fonctionnalités inachevées, à corriger ou à confirmer. Les règles de jeu implémentées sont décrites dans `specs.md`.

Quand un bug est corrigé, le retirer de cette liste et renuméroter les suivants.

1. **Tutoriel sur mobile (à confirmer)** : les étapes du tutoriel intro.js (`models/help.ts`, `#step1` à `#step13`) visent des éléments qui ont été déplacés sur mobile, notamment les boutons de combat, les materias et la zone, maintenant dans la barre collée en bas de l'écran Jeu, et le menu (étape 10), maintenant le dock `#step10-dock`. Il faut parcourir le tutoriel sur un petit écran pour vérifier que chaque élément est bien mis en évidence et que les bulles restent lisibles sans sortir de l'écran.
2. **Sauvegarde incohérente qui fait planter le jeu** : `decodeSave()` ne vérifie que la forme de la sauvegarde, et `GameService.load()` recopie `zones.level` / `levelMax` sans contrôle. Une sauvegarde modifiée à la main dont la zone courante n'est pas dans `zones.list` est acceptée à l'import, puis l'écran Jeu lève « Zone not found » à chaque affichage (`UiActionsComponent.remainingBattles()`). Une équipe vide laisse `characters.selected` à `undefined` et fait planter l'écran Équipement. Une difficulté hors de 1 à 3 et plus de `MAX_ITEMS` objets équipés sont aussi acceptées. Correction prévue : commit 2 de `docs/refactors.md`.
