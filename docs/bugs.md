# Bugs connus

Écarts constatés dans le code actuel : bugs avérés ou fonctionnalités inachevées, à corriger ou à confirmer. Les règles de jeu implémentées sont décrites dans `specs.md`.

Quand un bug est corrigé, le retirer de cette liste et renuméroter les suivants.

1. **Bandeau de mise à jour sur les barres d'actions (mobile, à confirmer)** : le bandeau `UpdateBannerComponent` est un `toast toast-center` fixé en bas de l'écran (`z-50`). Sur mobile, les écrans Jeu, Boutique, Zones et Équipement ont une barre d'actions collée en bas (`sticky bottom-0`) : le bandeau la recouvre probablement, y compris les boutons de combat de l'écran Jeu, tant que le joueur ne clique pas sur « Plus tard ». Piste : l'afficher en haut de l'écran sur mobile (`toast-top`), ou au-dessus de la barre.
2. **Tutoriel sur mobile (à confirmer)** : les étapes du tutoriel intro.js (`models/help.ts`, `#step1` à `#step13`) visent des éléments qui ont été déplacés sur mobile, notamment les boutons de combat, les materias et la zone, maintenant dans la barre collée en bas de l'écran Jeu. Il faut parcourir le tutoriel sur un petit écran pour vérifier que chaque élément est bien mis en évidence et que les bulles restent lisibles sans sortir de l'écran.
