---
name: raccourcir-notes
description: Raccourcit au minimum chaque ligne du bloc « Notes de release (anglais) » de docs/changelog.md, dans le style des releases GitHub déjà publiées, et indique le numéro de la prochaine version. À utiliser quand l'utilisateur demande de raccourcir, condenser, resserrer ou simplifier les notes de release.
---

# Raccourcir les notes de release

Échanges en français. La cible est le bloc « Notes de release (anglais) » de `## Prochaine version` dans `docs/changelog.md` (ou de la section de version donnée en argument). Ne toucher à rien d'autre : « Détail des changements » garde tous les détails, à part le titre de la section (voir « Numéro de version »).

## Numéro de version

En même temps, indiquer le numéro de la version à venir dans le titre de la section : `## Prochaine version (X.Y.Z)`. Garder « Prochaine version » dans le titre : la version n'est pas encore livrée, et `livrer-version` la retrouve sous ce nom.

- Partir de `"version"` dans `package.json` : version mineure +1 si les notes contiennent au moins une nouveauté ou un changement, version corrective +1 si elles ne contiennent que des `Fix …`.
- Si le titre a déjà un numéro, le vérifier avec la même règle et ne le changer qu'avec l'accord de l'utilisateur.
- Si un numéro est donné en argument, utiliser celui-là.

## Référence : les releases publiées

Les notes doivent ressembler aux releases déjà publiées (`gh release view v1.6.0`, `v1.5.0`, `v1.3.0`) :

```
- Installable as an app and playable offline (PWA)
- New dark and light color theme
- Dark theme is now the default
- Colored HP, MP, Limit bars
- Equipped materias are shown in Shop section and can no longer be sold
- Fix Yuffie not being able to change her weapon
- Fix zone 9 that could not be completed
- Fix weapon sorting in Shop section
```

En cas de doute sur le style, relire ces releases avec `gh release view <tag> --json body -q .body`.

## Règles

Pour chaque ligne :

- **Un seul fait**, en 3 à 10 mots environ (12 au maximum). Une ligne = ce que le joueur voit changer, pas comment ni pourquoi.
- **Pas d'explication** : supprimer tout ce qui suit `:`, `—`, `, so…`, `, which…`, les parenthèses explicatives et les énumérations d'exemples. Garder une parenthèse seulement si c'est un sigle connu (`(PWA)`).
- **Pas de contexte superflu** : retirer « now », « also », « properly », « the game », les précisions d'appareil (« on phones », « in the phone menu bar ») sauf si le changement ne concerne que cet appareil et que la ligne serait fausse sans.
- **Tournures des releases publiées** :
  - nouveauté : `New …`, `Add …` ou un groupe nominal (`Colored HP, MP, Limit bars`) ;
  - changement : `Shorter …`, `… is now …`, `… now …` ;
  - correction : `Fix …` suivi du symptôme vu par le joueur, le plus court possible (`Fix zone 9 that could not be completed`, `Fix weapon sorting in Shop section`).
- **Noms d'écran** comme dans les releases : `Shop section`, `Game section`, `About screen`, entre guillemets seulement pour un libellé de bouton (`"More"`).
- **Fusionner** les lignes qui parlent du même sujet (deux corrections du même menu, deux changements du même écran) en une seule ligne courte.
- **Ne pas perdre d'information importante** : si raccourcir rend la ligne ambiguë ou fausse, garder le mot qui manque.

Ensuite :

- Conserver l'ordre du plus au moins important pour les joueurs (nouveautés majeures d'abord, petites corrections à la fin), et le re-trier si une fusion le change.
- Garder la ligne `Note:` éventuelle en dernier, raccourcie de la même façon.
- Garder le bloc entre ses trois backticks.

## Exemples

| Avant | Après |
| --- | --- |
| New About screen with the game version, GitHub links and credits, replacing the page footer | New About screen |
| The action bar only shows useful buttons: Attack and Escape replace the fight buttons during battles, and attack materias are hidden outside battles | Action bar only shows usable buttons |
| Fix the game crashing after importing an edited save with a missing zone or an empty team: such saves are now refused | Fix a crash when importing an invalid save |
| Fix saving silently failing when the browser storage is full or disabled: an error message is now shown | Fix saving failing silently |
| The "More" menu of the phone menu bar now closes when tapping outside it | "More" menu closes when tapping outside it |

## Déroulé

1. Lire le bloc actuel.
2. Proposer la nouvelle version sous forme de tableau avant / après (une ligne par entrée, fusions signalées), puis le bloc final complet et le numéro de version retenu.
3. Après accord de l'utilisateur, remplacer le bloc et le titre de la section dans `docs/changelog.md`. Ne pas committer sauf demande.
