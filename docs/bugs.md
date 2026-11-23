# Bugs connus

Écarts constatés dans le code actuel : bugs avérés ou fonctionnalités inachevées, à corriger ou à confirmer. Les règles de jeu implémentées sont décrites dans `specs.md`.

Quand un bug est corrigé, le retirer de cette liste et renuméroter les suivants.

1. **Variation aléatoire hors de ±10 % sur les petites valeurs.** `withVariance()` (`src/app/shared/utils/game.utils.ts`) appelle `random(a, b)` avec des bornes non entières, alors que `random()` (`math.utils.ts`) arrondit pour des entiers. Pour 5 dégâts, on obtient 4, 5 ou 6 (±20 %) ; pour 1, on obtient 0, 1 ou 2. Touche surtout les attaques ennemies du début de partie et les petits soins, alors que `specs.md` §5.3 annonce ±10 %. Voir le commit 2 de `docs/refactors.md`.
2. **Langue de la sauvegarde non vérifiée.** `GameService.load()` recopie `save.language` sans passer par `getLanguage()`. Une sauvegarde modifiée avec une langue inconnue fait charger des fichiers de traduction inexistants, et l'écran Options n'affiche aucune langue sélectionnée. Voir le commit 3 de `docs/refactors.md`.
