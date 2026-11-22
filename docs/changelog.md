# Changelog

## Prochaine version

### Notes de release (anglais)

```
- Fix the game crashing after importing an edited save with a missing zone or an empty team: such saves are now refused
```

### Détail des changements

#### Corrections

- Une sauvegarde modifiée à la main qui ne peut pas être jouée (zone courante absente, zone max incohérente, équipe vide, difficulté inconnue) est maintenant refusée à l'import, ou remplacée par une nouvelle partie au démarrage, au lieu de faire planter les écrans Jeu ou Équipement. Les objets équipés en trop sont déséquipés au chargement.
