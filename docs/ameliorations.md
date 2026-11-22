# Améliorations

Idées d'évolution du jeu, à discuter avant implémentation. Les bugs sont listés dans `bugs.md`. Les règles de jeu actuelles sont décrites dans `specs.md`.

1. **Restaurer un minimum de HP hors combat.** Depuis qu'aucun combat ne peut être lancé à 0 HP, le joueur doit se soigner pour rejouer. Le coût en MP de la materia de soin augmente avec son niveau, et les MP ne se régénèrent pas. Un joueur sans MP, sans potion et sans gils pour en acheter ne peut donc plus combattre. Pistes :
   - régénérer lentement les HP (et éventuellement les MP) hors combat, par exemple avec le timer de `GameService` ;
   - remettre automatiquement un pourcentage des HP max après une défaite ;
   - ajouter une action « Se reposer », gratuite ou payante en gils, qui restaure l'équipe.
2. **Attaque automatique des personnages.** En combat, seuls les ennemis ont une boucle d'attaque (`Battle.start`). Les personnages n'attaquent que sur action du joueur.
3. **Pied de page plus compact sur mobile.** Le pied de page (`ui-footer`) a une marge intérieure `p-10` sur toutes les tailles d'écran, ce qui prend beaucoup de place sur un téléphone pour trois lignes de liens. Piste : une marge réduite sur mobile (par exemple `p-4 sm:p-10`) et un texte plus petit.
