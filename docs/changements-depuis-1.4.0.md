# Changements depuis la version 1.4.0

Bilan des 51 commits passés sur la branche `experiments` depuis le tag `v1.4.0` (mai 2024). Ces changements ne sont pas encore publiés.

## Nouveautés

- **Nouvelle interface (daisyUI)** : l'interface a été entièrement refaite et PrimeNG a été remplacé par daisyUI.
  - Le menu est horizontal sur grand écran et devient un tiroir latéral sur mobile.
  - Le titre utilise une nouvelle police.
  - Les barres HP, MP, Limite et HP ennemis sont colorées (vert, bleu, jaune, rouge).
  - La zone sélectionnée sur la Carte et le personnage sélectionné dans Équipement sont mis en évidence.
- **Confirmations dans Sauvegarde** : « Réinitialiser » et « Importer » ouvrent une fenêtre de confirmation qui explique ce qui sera perdu. Une sauvegarde collée est vérifiée avant l'import, et le message « Sauvegarde invalide » s'affiche si elle n'est pas valide.
- **Boutique, onglet Vente** : un badge « Équipée » signale les materias équipées, qu'on ne peut pas vendre.

## Corrections

- **Yuffie** peut enfin changer d'arme : son type d'arme était `yuffie` au lieu de `shuriken`, donc aucune arme ne lui était proposée.
- Le **4-pt Shuriken** est maintenant vendu en boutique.
- **Bottomswell** est bien reconnu comme le boss de la zone 9. Avant, la zone 9 ne pouvait jamais être terminée.
- Après une **défaite**, les boutons de combat restent désactivés tant que l'équipe n'a pas été soignée. Avant, le combat suivant était perdu dès la première attaque ennemie.
- On ne peut plus **vendre une materia équipée**.
- Les **niveaux des personnages et des materias** ne dépassent plus 100, même après un gros gain d'XP ou d'AP.
- Une **sauvegarde corrompue** ne bloque plus le démarrage du jeu : elle est effacée et une nouvelle partie commence.
- **Réinitialiser** ou **importer** une partie repart réellement de zéro. Avant, la progression des zones, les niveaux, les AP et les quantités de la partie précédente pouvaient être conservés, parce que le joueur et la boutique partageaient les mêmes objets.
- Un **import qui échoue** (données inconnues) restaure la partie en cours au lieu de la laisser à moitié chargée.
- La **difficulté** est enregistrée comme un nombre et non plus comme du texte. Les anciennes sauvegardes sont converties au chargement.
- Les **numéros de version** des sauvegardes sont comparés comme des nombres : `1.10.0` est bien considérée comme plus récente que `1.9.0`.
- Le **tri des armes** en boutique prend en compte les 6 types d'arme (3 seulement avant).
- Une fuite de mémoire est corrigée sur l'écran Jeu : chaque visite laissait un abonnement actif sur les barres de progression.

## Changements

- **Thème** : le thème clair par défaut devient le thème sombre. Le thème clair s'appelle désormais « cupcake ». Une préférence enregistrée par la 1.4.0 (`light`) est convertie en « cupcake ».
- **Astérisque sur « Carte »** : en 1.4.0, il apparaissait quand une nouvelle zone était débloquée et disparaissait après une visite de la Carte. Il reste maintenant affiché tant que la zone courante est terminée et qu'il existe une zone suivante.
- **Pied de page** : il est plus grand et se trouve sur un fond sombre.
- **Tutoriel** : il se lance avec l'icône d'aide (point d'interrogation dans un rond) de la barre du haut, désactivée pendant un combat. Chaque étape désigne de nouveau son élément. Sur mobile, l'étape du menu principal désigne le bouton du tiroir. La bulle et ses boutons suivent le thème, donc restent lisibles en mode sombre.
- **Panneau ennemi** : il reste affiché hors combat, avec la mention « Aucun ennemi ».
- **Accessibilité clavier** : sur les écrans PHS, Materia et Objets, les icônes cliquables (rejoindre ou quitter l'équipe, équiper ou déséquiper) sont de vrais boutons. On les atteint avec Tab et on les active avec Entrée ou Espace.

## Disparitions

- **Police Material Icons** : elle n'est plus chargée depuis Google Fonts. Ses icônes sont remplacées par des SVG (Lucide).

## Côté technique

- Angular 17 → 22, migration de version en version : composants standalone, OnPush, application *zoneless*, signaux, `input()`, `inject()` et guards fonctionnels.
- PrimeNG, Font Awesome, `@angular/animations`, subsink et compodoc ont été retirés.
- ESLint et Prettier sont remplacés par Biome, et Husky est ajouté (pre-commit).
- Le gestionnaire de paquets passe de npm à pnpm.
- Les tests unitaires passent de Karma/Jasmine à Vitest et tournent en CI. Les nouveaux tests couvrent la boucle de combat, les récompenses, le déblocage des boss et les formules de stats.
- La documentation est complétée : `CLAUDE.md`, `specs.md` (spécifications fonctionnelles), `docs/bugs.md`, `docs/ameliorations.md` et `docs/refactors.md`.

## Texte de la release 1.5.0

```
- New design and new title font
- Horizontal menu on large screens, side drawer on small screens
- Dark theme is now the default (the light theme is now called "cupcake")
- Colored HP, MP, Limit and enemy HP bars
- Highlight the selected zone in Map section and the selected character in Equip section
- Enemy panel stays visible outside of battles
- The tutorial can be started from the help button in the top bar and is readable in dark mode
- Confirmation popups before resetting or importing a game, and invalid saves are now detected
- Equipped materias are flagged in Shop section and can no longer be sold
- Keyboard navigation for the buttons in PHS, Materia and Items sections
- Fix Yuffie not being able to change her weapon
- Fix 4-pt Shuriken missing from Shop section
- Fix zone 9 that could never be completed (Bottomswell)
- Fix losing the next battle right away after a defeat
- Fix character and materia levels going above 100
- Fix a corrupted save blocking the game at startup
- Fix progress from the previous game being kept after a reset or an import
- Fix weapon sorting in Shop section

Note: Project has been updated to Angular 22 and the PrimeNG library has been replaced by daisyUI
```
