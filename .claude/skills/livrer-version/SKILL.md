---
name: livrer-version
description: Prépare et livre une version de Clickingff7 (argument : numéro, ex. 1.7.0) : notes de release, passage de version, fusion de next dans main, tag, CI, release GitHub, déploiement Firebase et réouverture du changelog. À utiliser quand l'utilisateur demande de préparer, sortir, livrer ou publier une version, de faire une release ou de déployer une nouvelle version.
---

# Livrer une version

Échanges en français. `X.Y.Z` est le numéro donné en argument. S'il manque, proposer le suivant d'après `package.json` (mineure +1 si la version apporte des nouveautés, correctif +1 si elle ne contient que des corrections) et demander confirmation.

Le processus a deux phases. Elles peuvent être lancées séparément : « prépare la version » s'arrête après la phase 1.

## Prérequis

- Être sur `next` avec un arbre propre (`git status --short` vide). Si l'arbre n'est pas propre, s'arrêter et demander.
- `gh auth status` : connecté à GitHub avec le scope `repo`. Sinon, demander à l'utilisateur de lancer `gh auth login`.
- `firebase projects:list` fonctionne (le projet `clickingff7` y figure). Sinon, demander `firebase login`.

## Phase 1 : préparer (sur `next`)

1. **Notes de release** : relire le bloc « Notes de release (anglais) » de `## Prochaine version` dans `docs/changelog.md`.
   - Les lignes sont courtes et concrètes (appliquer les règles du skill `raccourcir-notes`). Fusionner les entrées qui parlent du même sujet (par ex. plusieurs écrans retravaillés pour le mobile).
   - Elles sont triées du plus au moins important pour les joueurs, avec les corrections (`Fix …`) à la fin et une ligne `Note:` facultative tout en bas.
   - Rien de technique : les détails restent dans « Détail des changements », en français.
   - Montrer les notes à l'utilisateur avant de continuer.
2. Renommer `## Prochaine version` (ou `## Prochaine version (X.Y.Z)` si le numéro y est déjà) en `## X.Y.Z`. Si le titre porte un autre numéro que `X.Y.Z`, s'arrêter et demander.
3. Chercher les mentions de la version à venir (`grep -rni "version qui suit\|prochaine version" docs specs.md`) et les remplacer par `X.Y.Z`, en particulier dans `docs/compatibilite.md`.
4. Passer `"version"` à `X.Y.Z` dans `package.json`. Ce numéro est écrit dans les sauvegardes et affiché dans le pied de page.
5. Lancer `pnpm test:ci` et `pnpm lint`.
6. Faire deux commits, sans pousser :
   - `docs: add X.Y.Z release notes` (changelog et docs) ;
   - `chore: bump version to X.Y.Z` (`package.json`).

## Phase 2 : livrer

**Avant de commencer, demander confirmation** : cette phase pousse sur le dépôt public, publie une release et déploie le site en production.

1. `git fetch origin`. Vérifier que `origin/next` est un ancêtre de `next` et que `main` est un ancêtre de `next` (`git merge-base --is-ancestor`). Sinon, s'arrêter et faire le point. Ne jamais forcer un push.
2. `git push origin next`.
3. `git checkout main && git merge --ff-only next`. `main` avance toujours en fast-forward, sans commit de fusion.
4. Créer un tag annoté **sur `main`** : `git tag -a vX.Y.Z -m "vX.Y.Z"`. Puis `git push origin main` et `git push origin vX.Y.Z`.
5. **CI** : `gh run list --branch main --limit 1` pour trouver le run du commit, puis `gh run watch <id> --exit-status`. Si elle échoue, s'arrêter, ne pas publier la release ni déployer, et montrer l'erreur (`gh run view <id> --log-failed`).
6. **Release GitHub** : extraire le contenu du bloc « Notes de release (anglais) » de `## X.Y.Z`, sans les backticks, dans un fichier du scratchpad. Puis :
   `gh release create vX.Y.Z --verify-tag --title vX.Y.Z --notes-file <fichier>`.
   Vérifier avec `gh release list --limit 2` qu'elle est marquée « Latest ».
7. **Déploiement**, toujours sur `main` : `pnpm deploy:hosting` (build de production puis `firebase deploy --only hosting`). Attendre « Deploy complete! ». Vérifier ensuite que le site sert la nouvelle version : le numéro `X.Y.Z` doit apparaître dans un des chunks JS listés par `https://clickingff7.web.app/ngsw.json`.
8. **Retour sur `next`** : `git checkout next`. Dans `docs/changelog.md`, **supprimer toute la section `## X.Y.Z`** qui vient d'être livrée (son contenu est conservé dans la release GitHub et dans l'historique Git), puis la remplacer, sous `# Changelog`, par une section vide :

   ````
   ## Prochaine version

   ### Notes de release (anglais)

   ```
   ```

   ### Détail des changements
   ````

   Commit `docs: open the next version in the changelog`, puis `git push origin next`.

## Bilan

Terminer par un résumé court : commits poussés, tag, état de la CI, lien de la release, URL du site déployé et version vérifiée en ligne. Signaler toute étape sautée ou en échec.
