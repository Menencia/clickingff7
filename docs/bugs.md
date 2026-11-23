# Bugs connus

Écarts constatés dans le code actuel : bugs avérés ou fonctionnalités inachevées, à corriger ou à confirmer. Les règles de jeu implémentées sont décrites dans `specs.md`.

Quand un bug est corrigé, le retirer de cette liste et renuméroter les suivants.

1. **Langue de la sauvegarde non vérifiée.** `GameService.load()` recopie `save.language` sans passer par `getLanguage()`. Une sauvegarde modifiée avec une langue inconnue fait charger des fichiers de traduction inexistants, et l'écran Options n'affiche aucune langue sélectionnée. Voir le commit 3 de `docs/refactors.md`.
