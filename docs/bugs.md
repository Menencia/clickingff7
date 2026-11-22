# Bugs connus

Écarts constatés dans le code actuel : bugs avérés ou fonctionnalités inachevées, à corriger ou à confirmer. Les règles de jeu implémentées sont décrites dans `specs.md`.

Quand un bug est corrigé, le retirer de cette liste et renuméroter les suivants.

1. **Barre d'EXP du PHS vide** : dans l'écran PHS, la barre d'EXP de chaque personnage (`view-phs.component.html`) utilise les classes `characters_xp`, `xp_progress` et `bar-label`, qui ne sont définies nulle part : le remplissage ne s'affiche pas. À remplacer par `app-progress-bar`, comme la barre d'AP de l'écran Materia.
