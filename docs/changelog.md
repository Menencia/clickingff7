# Changelog

## Prochaine version

### Notes de release (anglais)

```
- Fix materias staying equipped beyond the available slots when a character leaves the team
```

### Détail des changements

#### Corrections

- Les materias en trop sont déséquipées quand le nombre d'emplacements diminue (un personnage quitte l'équipe dans le PHS, devient indisponible ou change pour une arme qui a moins d'emplacements). Une sauvegarde qui équipe trop de materias est corrigée au chargement.

#### Côté technique

- L'arme équipée n'est plus enregistrée qu'à un seul endroit : l'arme de chaque personnage. Le champ `equipped` des armes est toujours écrit dans la sauvegarde pour rester compatible avec la 1.5.0, mais il est ignoré au chargement. Une sauvegarde modifiée à la main ne peut donc plus se contredire sur ce point.

