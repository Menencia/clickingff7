# Changelog

## Prochaine version

### Notes de release (anglais)

```
- Fix the game crashing after importing an edited save with a missing zone or an empty team: such saves are now refused
- Fix saving silently failing when the browser storage is full or disabled: an error message is now shown
- Fix the help tour on phones: the right element is highlighted and tooltips no longer go off screen
```

### Détail des changements

#### Corrections

- Une sauvegarde modifiée à la main qui ne peut pas être jouée (zone courante absente, zone max incohérente, équipe vide, difficulté inconnue) est maintenant refusée à l'import, ou remplacée par une nouvelle partie au démarrage, au lieu de faire planter les écrans Jeu ou Équipement. Les objets équipés en trop sont déséquipés au chargement.
- Si le navigateur refuse d'enregistrer la sauvegarde (stockage plein ou désactivé), l'écran Sauvegarde affiche maintenant un message d'erreur au lieu de laisser croire que la partie est sauvegardée.
- Tutoriel sur téléphone : les boutons de la barre d'actions (Attaquer, Fuir, materias…) étaient parfois mal mis en évidence, et certaines bulles sortaient de l'écran ou cachaient l'élément présenté. Chaque élément est maintenant amené en haut de l'écran et les bulles sont plus compactes.
