# Changelog

## Prochaine version

### Notes de release (anglais)

```
- Fix random damage and healing variance going well beyond ±10% on small values
- Fix a save with an unknown language loading without translations
```

### Détail des changements

#### Corrections

- La variation aléatoire des dégâts et des soins respecte mieux les ±10 % annoncés sur les petites valeurs : 5 dégâts donnaient 4 ou 6 une fois sur deux, et 1 dégât pouvait tomber à 0. Les petites valeurs varient toujours, mais plus rarement, et ne descendent jamais à 0. Les attaques ennemies du début de partie sont donc moins dispersées.
- Une sauvegarde dont la langue n'est pas prise en charge se charge dans la langue du navigateur (ou en anglais) au lieu d'afficher le jeu sans traductions.
