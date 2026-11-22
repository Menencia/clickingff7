# Changelog

## Prochaine version

### Notes de release (anglais)

```
- The game can now be installed as an app and played fully offline (PWA), with a new sword icon
- Fix materias staying equipped beyond the available slots when a character leaves the team
- Restyle the item, materia, equipment and shop tables
- Fix the materia AP bar not showing progress
- New color theme (dark and light), with Mako green, cyan and amber on slate blue
- Better game screen on mobile: enemies on top, compact team, and the battle buttons in a bar at the bottom of the screen
- Better shop on mobile: compact tabs in a bar at the bottom of the screen, with the price and stock under each name
- Better zone screen on mobile: the zone card on top and the zone buttons in a bar at the bottom of the screen
- Better equipment screen on mobile: the character card on top and the character buttons in a bar at the bottom of the screen
- Better materia screen on mobile: the AP bar under each materia, no more sideways scrolling, and equipped materias highlighted
- Better items screen on mobile: more compact, with the quantity next to each name, and equipped items highlighted
```

### Détail des changements

#### Nouveautés

- Le jeu peut être installé comme une application (PWA) et fonctionne entièrement hors ligne : dès la première visite, toute l'application et toutes les images, données et traductions sont mises en cache. Le jeu a une nouvelle icône (une épée), aussi utilisée comme favicon.
- Quand une nouvelle version est disponible, un bandeau propose de recharger le jeu (après avoir sauvegardé) ; sinon, elle s'applique au prochain lancement.

#### Corrections

- Les materias en trop sont déséquipées quand le nombre d'emplacements diminue (un personnage quitte l'équipe dans le PHS, devient indisponible ou change pour une arme qui a moins d'emplacements). Une sauvegarde qui équipe trop de materias est corrigée au chargement.
- La barre d'AP des materias se remplit de nouveau (elle restait vide).

#### Changements

- Les tableaux des écrans Objets, Materia, Équipement et Boutique ont un nouveau style : présentés dans une carte arrondie, ligne surlignée au survol, en-tête distinct, chiffres et prix alignés à droite, description en dessous du nom, message centré quand la liste est vide. Les boutons équiper / déséquiper utilisent partout les mêmes icônes (au lieu d'emojis dans l'écran Objets), et les boutons de la Boutique et de l'Équipement sont plus compacts et colorés (achat, vente, équiper). L'écran Équipement affiche aussi l'icône et la puissance de chaque arme.
- Nouvelles couleurs pour les thèmes sombre et clair : surfaces bleu ardoise, vert Mako pour les actions principales (Acheter, barre d'AP), cyan pour les onglets sélectionnés, ambre en accent. Le fond des pages est un ton plus foncé que les tableaux et les boutons, qui ressortent mieux. Les dégâts affichés et le badge « NEW » suivent la couleur d'erreur du thème. La barre du navigateur et l'écran de lancement de l'application installée prennent le nouveau bleu nuit.

- L'écran de jeu est réorganisé sur mobile : les ennemis sont en haut, l'équipe est plus compacte (portraits plus petits, réplique sur une ligne), et les actions sont regroupées dans une barre collée en bas de l'écran, à portée de pouce : zone et gils, puis les materias et objets sur une ligne qui défile horizontalement, puis les quatre boutons de combat en grille (Attaquer mis en avant en vert). Sur ordinateur, la disposition en trois colonnes ne change pas, à part le bouton Attaquer coloré.
- Les libellés des barres (HP, MP, LIMIT, EXP, AP) sont affichés au-dessus de la barre au lieu de la chevaucher.
- La Boutique est plus lisible sur mobile : les onglets Armes / Materia / Objets et Acheter / Vendre sont sur deux lignes compactes dans une barre collée en bas de l'écran, comme sur l'écran de jeu : Acheter / Vendre et les gils, puis les catégories en dessous, à portée de pouce, et les colonnes Stock et Prix sont remplacées par une ligne sous le nom (prix, quantité en stock, materia possédée ou équipée). Sur ordinateur, la disposition ne change pas.
- L'écran Zones est réorganisé : la zone choisie est présentée dans une carte (image, numéro, nom, badge « Terminé ! » ou « Non terminé », description), avec le bouton « Aller à la zone suivante » mis en avant. Sur mobile, la carte est en haut et les zones sont des boutons numérotés compacts (5 par ligne) dans une barre collée en bas de l'écran, avec le bouton de zone suivante au-dessus ; sur ordinateur, les boutons restent en colonne à gauche.
- L'écran Équipement est réorganisé : le personnage choisi est présenté dans une carte (portrait, niveau, HP / MP / puissance) avec son arme équipée dans un encadré, et la liste des armes indique aussi le nombre d'emplacements de materia ; l'arme équipée y porte un badge « Équipée » au lieu d'un bouton grisé. Sur mobile, la carte est en haut, la liste des armes en dessous et les personnages sont des boutons dans une barre collée en bas de l'écran ; sur ordinateur, les boutons restent en colonne à gauche.
- L'écran Materia est plus lisible sur mobile : la colonne Évolution est remplacée par la barre d'AP sous la description, ce qui évite le défilement horizontal du tableau, le tableau est plus compact et les boutons d'équipement sont plus grands. Sur tous les écrans, les materias équipées sont surlignées.
- L'écran Objets est plus lisible sur mobile : la colonne En stock est remplacée par un badge de quantité à côté du nom, le tableau est plus compact et les boutons d'équipement sont plus grands. Sur tous les écrans, les objets équipés sont surlignés.

#### Côté technique

- L'arme équipée n'est plus enregistrée qu'à un seul endroit : l'arme de chaque personnage. Le champ `equipped` des armes est toujours écrit dans la sauvegarde pour rester compatible avec la 1.5.0, mais il est ignoré au chargement. Une sauvegarde modifiée à la main ne peut donc plus se contredire sur ce point.

