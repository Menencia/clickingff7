# Changelog

## Prochaine version

### Notes de release (anglais)

```
- Battle screen redesign: the team faces the enemy, with portraits and circular gauges
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

- Écran de combat repensé (pensé d'abord pour mobile) : l'équipe, à gauche, fait face à l'ennemi, à droite. Les jauges HP, MP et Limite deviennent circulaires, l'XP de chaque personnage entoure son portrait et les HP de l'ennemi entourent le sien.

#### Disparitions

- Les noms des personnages et des ennemis ne sont plus affichés en combat, ni les répliques des personnages.
