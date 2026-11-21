# Bugs connus

Écarts constatés dans le code actuel : bugs avérés ou fonctionnalités inachevées, à corriger ou à confirmer. Les règles de jeu implémentées sont décrites dans `specs.md`.

Quand un bug est corrigé, le retirer de cette liste et renuméroter les suivants.

1. Les personnages n'attaquent pas automatiquement : seuls les ennemis ont une boucle d'attaque (`Battle.start`).
2. La vente d'une materia ne vérifie pas si elle est équipée.
3. Le niveau maximum de 100 (personnages et materias) n'est vérifié qu'**avant** la boucle de montée de niveau dans `Character.setXp` et `Materia.setAp`. Un gros gain d'XP ou d'AP au niveau 99 fait donc dépasser le niveau 100.
4. Le **tutoriel est inaccessible** : `SidemenuComponent.help()` n'est appelé par aucun template. Le bouton d'aide a disparu au commit `851d583` (`refactor: enable back sidemenu`), qui a déplacé la méthode dans le menu sans y ajouter de bouton. De plus, les ancres `#step2` à `#step4`, `#step9` et `#step10` utilisées par `models/help.ts` n'existent plus dans les templates : même avec le bouton, ces étapes n'auraient pas d'élément cible.
5. Dans l'onglet **Vente** de la boutique, la colonne « possédée » des materias est toujours vide : le template appelle `materia.isOwned([])` avec une liste vide au lieu des materias du joueur.
