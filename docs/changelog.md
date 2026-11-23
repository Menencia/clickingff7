# Changelog

## Prochaine version

### Notes de release (anglais)

```
- Fix random damage and healing variance going well beyond ±10% on small values
```

### Détail des changements

#### Corrections

- La variation aléatoire des dégâts et des soins respecte mieux les ±10 % annoncés sur les petites valeurs : 5 dégâts donnaient 4 ou 6 une fois sur deux, et 1 dégât pouvait tomber à 0. Les petites valeurs varient toujours, mais plus rarement, et ne descendent jamais à 0. Les attaques ennemies du début de partie sont donc moins dispersées.
