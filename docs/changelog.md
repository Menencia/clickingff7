# Changelog

## Prochaine version

### Notes de release (anglais)

```
- New About screen with the game version, GitHub links and credits, replacing the page footer
- The action bar only shows useful buttons: Attack and Escape replace the fight buttons during battles, and attack materias are hidden outside battles
- Fix the game crashing after importing an edited save with a missing zone or an empty team: such saves are now refused
- Fix saving silently failing when the browser storage is full or disabled: an error message is now shown
- Fix the help tour on phones: the right element is highlighted and tooltips no longer go off screen
- Shorter help tour
- Fix the active page marker not being centered under "More" in the phone menu bar
```

### Détail des changements

#### Nouveautés

- Nouvel écran À propos (dernière entrée du menu, et du menu « Plus » sur mobile) avec la version du jeu, le lien vers les nouveautés, les liens GitHub (code source, tickets, signaler un bug ou proposer une idée) et les crédits.

#### Corrections

- Une sauvegarde modifiée à la main qui ne peut pas être jouée (zone courante absente, zone max incohérente, équipe vide, difficulté inconnue) est maintenant refusée à l'import, ou remplacée par une nouvelle partie au démarrage, au lieu de faire planter les écrans Jeu ou Équipement. Les objets équipés en trop sont déséquipés au chargement.
- Si le navigateur refuse d'enregistrer la sauvegarde (stockage plein ou désactivé), l'écran Sauvegarde affiche maintenant un message d'erreur au lieu de laisser croire que la partie est sauvegardée.
- Tutoriel sur téléphone : les boutons de la barre d'actions (Attaquer, Fuir, materias…) étaient parfois mal mis en évidence, et certaines bulles sortaient de l'écran ou cachaient l'élément présenté. Chaque élément est maintenant amené en haut de l'écran et les bulles sont plus compactes.
- Barre de navigation sur téléphone : le trait qui indique la page active n'était pas centré sous « Plus » quand la page venait de ce menu.

#### Changements

- La barre d'actions n'affiche plus que les boutons utiles : en combat, Attaquer et Fuir remplacent les boutons Combat aléatoire et Combat de boss ; hors combat, les materias d'attaque (Foudre…) sont masquées, seules les materias de soin et les objets restent.
- Le tutoriel est plus court : les boutons Attaquer et Fuir sont présentés avec le bouton de combat, et les liens du pied de page (version, signaler un bug) n'en font plus partie.
- Le pied de page disparaît : son contenu est dans le nouvel écran À propos. Sur téléphone, il prenait beaucoup de place sous chaque écran.
