# Changelog

## Prochaine version

### Notes de release (anglais)

```
- Battle screen redesign: the team faces the enemy, with portraits and circular gauges, and actions in Battle, Magic and Items tabs
- Gils are now shown in the header on every screen
- The Limit gets its own button: Attack no longer uses it automatically
- Fix a new fight starting by accident when clicking Attack right as a battle ends
- Fix random damage and healing variance going well beyond ±10% on small values
- Fix a save with an unknown language loading without translations
```

### Détail des changements

#### Corrections

- Les boutons Combat aléatoire et Combat de boss, qui prennent la place d'Attaquer et Fuir à la fin d'un combat, restent désactivés pendant 1 seconde : un clic de trop sur Attaquer au moment où l'ennemi meurt ne relance plus un combat aussitôt.
- La variation aléatoire des dégâts et des soins respecte mieux les ±10 % annoncés sur les petites valeurs : 5 dégâts donnaient 4 ou 6 une fois sur deux, et 1 dégât pouvait tomber à 0. Les petites valeurs varient toujours, mais plus rarement, et ne descendent jamais à 0. Les attaques ennemies du début de partie sont donc moins dispersées.
- Une sauvegarde dont la langue n'est pas prise en charge se charge dans la langue du navigateur (ou en anglais) au lieu d'afficher le jeu sans traductions.

#### Changements

- Écran de combat repensé (pensé d'abord pour mobile) : l'équipe, à gauche, fait face à l'ennemi, à droite. Les jauges HP, MP et Limite deviennent circulaires, l'XP de chaque personnage entoure son portrait et les HP de l'ennemi entourent le sien. Les chiffres de dégâts partent du centre de l'ennemi, tour à tour vers la droite et la gauche, les coups critiques s'affichent plus grands et en jaune, les soins en vert avec un « + », et un coup sur une faiblesse est signalé par « Faiblesse » au-dessus du chiffre. L'ennemi vaincu reste affiché un instant, grisé, pour qu'on voie les dégâts du dernier coup. Un bandeau en haut de l'écran affiche la zone en cours (numéro et nom) ; le toucher ouvre l'écran Zones. Sur mobile, ce bandeau remplace l'entrée Zones du dock, et son icône de carte porte la pastille signalant qu'une nouvelle zone est disponible. Les actions sont rangées en trois onglets en bas de l'écran : Combat, Magie et Objets, avec des boutons sur toute la largeur qui affichent une icône et une courte description. Le bouton Combat de boss n'apparaît que lorsque le boss peut être affronté ; d'ici là, un message sous Combat aléatoire indique le nombre de victoires restantes (il remplace le compteur du bouton).
- Entre 768 et 1024 px de large, le dock du bas remplace le menu horizontal, qui ne tenait pas dans la barre du haut (les gils étaient coupés).
- Sur grand écran, l'écran Jeu reprend la disposition mobile dans une colonne centrée, avec une arène plus grande ; à partir de 1024 px, les groupes Combat, Magie et Objets sont affichés côte à côte au lieu d'onglets.
- Les gils sont affichés dans la barre du haut, sur tous les écrans, à gauche du bouton d'aide (pièce « G » suivie du montant) ; ils ne sont plus dans la barre d'actions de l'écran Jeu.
- La Limite a son propre bouton, qui apparaît sous Attaquer quand la jauge est pleine. Attaquer ne la déclenche plus automatiquement : le joueur peut la garder pour le bon moment.

#### Disparitions

- Les noms des personnages et des ennemis ne sont plus affichés en combat, ni les répliques des personnages.
