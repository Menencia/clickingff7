# Bugs connus

Écarts constatés dans le code actuel : bugs avérés ou fonctionnalités inachevées, à corriger ou à confirmer. Les règles de jeu implémentées sont décrites dans `specs.md`.

Quand un bug est corrigé, le retirer de cette liste et renuméroter les suivants.

1. **Materias équipées au-delà des emplacements disponibles.** Le nombre d'emplacements (`Characters.getMaxMaterias()`) est la somme des `maxMaterias` des armes de l'équipe. Il diminue quand un personnage quitte l'équipe (PHS) ou change pour une arme qui a moins d'emplacements (Équipement), mais aucune materia n'est alors déséquipée. Exemple : Aerith (bâton, 2 emplacements) quitte l'équipe, et les materias restent équipées au-delà de la limite, avec leurs AP et leur usage en combat.
