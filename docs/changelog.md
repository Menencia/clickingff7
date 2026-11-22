# Changelog

## Prochaine version

### Notes de release (anglais)

```
```

### Détail des changements

## 1.6.0

### Notes de release (anglais)

```
- Installable as an app and playable offline (PWA)
- Mobile-friendly screens, with a bottom navigation bar and actions within thumb reach
- New dark and light color theme
- Restyle the item, materia, equipment and shop tables
- Fix materias staying equipped beyond the available slots
- Fix the materia AP bar not showing progress
```

### Détail des changements

#### Nouveautés

- Le jeu peut être installé comme une application (PWA) et fonctionne entièrement hors ligne : dès la première visite, toute l'application et toutes les images, données et traductions sont mises en cache. Le jeu a une nouvelle icône (une épée), aussi utilisée comme favicon.
- Quand une nouvelle version est disponible, un bandeau (en haut de l'écran sur mobile) propose de recharger le jeu (après avoir sauvegardé) ; sinon, elle s'applique au prochain lancement.

#### Corrections

- Les materias en trop sont déséquipées quand le nombre d'emplacements diminue (un personnage quitte l'équipe dans le PHS, devient indisponible ou change pour une arme qui a moins d'emplacements). Une sauvegarde qui équipe trop de materias est corrigée au chargement.
- La barre d'AP des materias se remplit de nouveau (elle restait vide).

#### Changements

- Sur mobile, le menu latéral (ouvert par le bouton ☰) est remplacé par un dock fixé en bas de l'écran, à portée de pouce : Jeu, Zones, Boutique et Équipement ont chacun un bouton avec une icône, et le bouton « Plus » ouvre un menu avec Matéria, Objets, PHS, Config et Enregistrer. Une pastille sur Zones signale qu'une nouvelle zone est accessible. Sur tablette en paysage et sur ordinateur (à partir de 768 px de large), le menu reste horizontal, en plus compact sous 1024 px. Le pied de page prend la couleur des cartes, plus claire que le fond en thème sombre, au lieu d'un fond très sombre.
- Les tableaux des écrans Objets, Materia, Équipement et Boutique ont un nouveau style : présentés dans une carte arrondie, ligne surlignée au survol, en-tête distinct, chiffres et prix alignés à droite, description en dessous du nom, message centré quand la liste est vide. Les boutons équiper / déséquiper utilisent partout les mêmes icônes (au lieu d'emojis dans l'écran Objets), et les boutons de la Boutique et de l'Équipement sont plus compacts et colorés (achat, vente, équiper). L'écran Équipement affiche aussi l'icône et la puissance de chaque arme.
- Nouvelles couleurs pour les thèmes sombre et clair : surfaces bleu ardoise, vert Mako pour les actions principales (Acheter, barre d'AP), cyan pour les onglets sélectionnés, ambre en accent. Le fond des pages est un ton plus foncé que les tableaux et les boutons, qui ressortent mieux. Les dégâts affichés et le badge « NEW » suivent la couleur d'erreur du thème. La barre du navigateur et l'écran de lancement de l'application installée prennent le nouveau bleu nuit.

- L'écran de jeu est réorganisé sur mobile : les ennemis sont en haut, l'équipe est plus compacte (portraits plus petits, réplique sur une ligne), et les actions sont regroupées dans une barre collée en bas de l'écran, à portée de pouce : zone et gils, puis les materias et objets sur une ligne qui défile horizontalement, puis les quatre boutons de combat en grille (Attaquer mis en avant en vert). Sur ordinateur, la disposition en trois colonnes ne change pas, à part le bouton Attaquer coloré.
- Les libellés des barres (HP, MP, LIMIT, EXP, AP) sont affichés au-dessus de la barre au lieu de la chevaucher.
- La Boutique est plus lisible sur mobile : les onglets Armes / Materia / Objets et Acheter / Vendre sont sur deux lignes compactes dans une barre collée en bas de l'écran, comme sur l'écran de jeu : Acheter / Vendre et les gils, puis les catégories en dessous, à portée de pouce, et les colonnes Stock et Prix sont remplacées par une ligne sous le nom (prix, quantité en stock, materia possédée ou équipée). Sur ordinateur, la disposition ne change pas.
- L'écran Zones est réorganisé : la zone choisie est présentée dans une carte (image, numéro, nom, badge « Terminé ! » ou « Non terminé », description), avec le bouton « Aller à la zone suivante » mis en avant. Sur mobile, la carte est en haut et les zones sont des boutons numérotés compacts (5 par ligne) dans une barre collée en bas de l'écran, avec le bouton de zone suivante au-dessus ; sur ordinateur, les boutons restent en colonne à gauche.
- L'écran Équipement est réorganisé : le personnage choisi est présenté dans une carte (portrait, niveau, HP / MP / puissance) avec son arme équipée dans un encadré, et la liste des armes indique aussi le nombre d'emplacements de materia ; l'arme équipée y porte un badge « Équipée » au lieu d'un bouton grisé. Sur mobile, la carte est en haut, la liste des armes en dessous et les personnages sont des boutons dans une barre collée en bas de l'écran ; sur ordinateur, les boutons restent en colonne à gauche.
- L'écran Materia est plus lisible sur mobile : la colonne Évolution est remplacée par la barre d'AP sous la description, ce qui évite le défilement horizontal du tableau, le tableau est plus compact et les boutons d'équipement sont plus grands. Sur tous les écrans, les materias équipées sont surlignées.
- L'écran Objets est plus lisible sur mobile : la colonne En stock est remplacée par un badge de quantité à côté du nom, le tableau est plus compact et les boutons d'équipement sont plus grands. Sur tous les écrans, les objets équipés sont surlignés.
- L'écran Config est plus pratique sur mobile : la difficulté et la langue se choisissent en cliquant sur des badges (le choix actif est en couleur) au lieu de listes déroulantes, dans une carte centrée.
- L'écran PHS est réorganisé : chaque personnage, dans l'équipe comme en soutien, est présenté dans une carte (portrait, niveau, HP / MP / puissance, barre d'EXP qui s'affiche enfin correctement) avec un bouton flèche pour le changer de groupe, au lieu d'un clic sur le portrait ; le bouton est grisé quand l'échange est impossible (équipe pleine, dernier membre). Un compteur indique le nombre de membres de l'équipe. Sur mobile, l'équipe et le soutien sont l'un sous l'autre.
- L'écran Sauvegarde est réorganisé : la dernière sauvegarde (portraits de l'équipe, temps de jeu, gils) est présentée dans une carte avec les boutons Enregistrer (mis en avant) et Réinitialiser, et l'export / import dans une carte « Transfert ». La chaîne exportée est en lecture seule, entièrement sélectionnée au toucher, avec un bouton Copier qui la met dans le presse-papiers ; la zone d'import a un texte d'aide et passe en rouge si la sauvegarde est invalide. Sur mobile, les deux cartes sont l'une sous l'autre.

#### Côté technique

- L'arme équipée n'est plus enregistrée qu'à un seul endroit : l'arme de chaque personnage. Le champ `equipped` des armes est toujours écrit dans la sauvegarde pour rester compatible avec la 1.5.0, mais il est ignoré au chargement. Une sauvegarde modifiée à la main ne peut donc plus se contredire sur ce point.

