# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Clickingff7 is a browser-based idle/clicker RPG built with Angular 22 (standalone components, zoneless change detection), Tailwind CSS 4 + daisyUI 5, and ngx-translate. Deployed to Firebase Hosting.

## Commands

Package manager is **pnpm**.

- `pnpm i`: install deps
- `pnpm start` (or `ng s`): dev server at http://localhost:4200
- `pnpm build`: production build (budgets: 500kb warn / 1mb error initial; 2kb/4kb per component style)
- `pnpm test`: Vitest via `@angular/build:unit-test`, watch mode
- `pnpm test:ci`: single run
- Single test file: `ng test --watch=false --include src/app/core/services/battle.service.spec.ts`
- `pnpm lint`: Biome check (lint + format). Use `pnpm biome check --write` to auto-fix.
- `pnpm deploy:hosting`: build + `firebase deploy --only hosting`

CI (`.github/workflows/main.yml`, on `main`/`next`) runs build, `test:ci`, then `lint`. The Husky pre-commit hook runs `biome check --staged`.

## Functional specs

`specs.md` (in French) documents every game rule, formula, data table and screen as currently implemented. **Keep it in sync**: any change to game logic, balancing formulas, `src/assets/data/*.json`, unlocks, screens or save format must update the matching section of `specs.md` in the same change.

`docs/bugs.md` (in French) lists known bugs and unfinished features. Add any bug you find there. When fixing one, remove it from the list and renumber the following entries.

`docs/compatibilite.md` (in French) lists every place that handles data written by an older version (save fields, `localStorage` values, version thresholds). **Keep it in sync**: any backward-compatibility code added or removed must add or remove its entry in the same change.

`docs/changelog.md` (in French) records changes version by version. **Keep the « Prochaine version » section up to date**: any change a player can notice (new feature, bug fix, gameplay, UI or save change) must add an entry there in the same change. Don't put a version number on that section until asked.
- « Notes de release (anglais) »: short English bullets for the GitHub release, in the style of the previous releases (`Fix …` for fixes, one optional `Note:` line at the end for notable technical changes). Nothing too technical. Keep the list sorted from most to least important for players (major features first, minor fixes last), and re-sort it whenever you add an entry.
- « Détail des changements »: French details, under `#### Nouveautés`, `#### Corrections`, `#### Changements`, `#### Disparitions` or `#### Côté technique` (create a subsection when it gets its first entry). Pure refactors, tests and docs only go in « Côté technique », and only when significant.

## Code style

Biome is the only linter/formatter (no ESLint/Prettier). It uses single quotes and space indentation, and formats HTML templates too. `noUnusedImports` is an error.

## Architecture

### Bootstrapping and data loading
`app.config.ts` registers an app initializer that runs `DataService.preloadAll()` **before** anything else. It fetches the static game definitions from `src/assets/data/*.json` (characters, enemies, items, materias, weapons, zones) and keeps them as raw JSON.

`StoreService` builds model instances from that JSON by typed ref enums (`models/refs/*.ts`, e.g. `CharacterRef.Cloud`, `WeaponRef.BusterSword`). **Every call returns a new instance** (a zone gets its own enemies, a character its own default weapon), so the player's stock, the shop catalog and successive games never share state. The `type` field picks the subclass for materias and items. It throws if a ref is missing. Every ref enum value must match an entry in the corresponding JSON file.

### Game state
`GameService` (root singleton) holds the whole mutable player state: `characters`, `zones`, `weapons`, `materias`, `items`, `gils`, `language`, `difficulty`, `time`. On construction it:
1. loads the save from `localStorage['save1']` (base64-encoded JSON, shaped like the `Save` interface in `models/save.ts`); saves older than `1.1.0` are discarded
2. otherwise resets and calls `buildLevel(1)`

`buildLevel(n)` adds zone n and what it unlocks, read from the `ZONE_UNLOCKS` table (`models/zone-unlocks.ts`: new characters, characters rejoining the team, weapons, materias, items), then restores HP and MP. The save version comes from `package.json` `version`.

Each collection class (`models/units/characters.ts`, `models/zones.ts`, `models/weapons.ts`, `models/materias.ts`, `models/items.ts`) has `export()` / load logic that maps to `Save`. `SaveService` (`core/services/save.service.ts`) converts the whole game state to a `Save` and back (`export()`, `load()`, playability checks); `GameService` keeps the storage and the game life cycle (`run`, `newGame`, `importGame`, `save`). When you add a persisted field, update the `Save` interfaces, the `export()` methods and `SaveService.load()` together.

### Battles
`BattleService` holds the current battle in a `signal<Battle | undefined>`. `Battle` (`models/battle.ts`) runs the enemy attack loop on `setTimeout` and reports state through an RxJS `BehaviorSubject<BattleState>`. On `Ended`, the service applies rewards (gils, XP to the team, AP to equipped materias, zone completion on boss defeat) and clears the signal. A zone's boss becomes available after `MAX_FIGHTS` fights.

Player actions are in `models/actions/` (attack, cure). Materia and item subclasses (`models/materias/`, `models/items/`) implement specific effects.

### Routing and views
`app.routes.ts` lazy-loads one standalone component per screen from `views/view-*`. The functional guard `battleGuard` blocks leaving `/game` while a battle is ongoing, and `zoneGuard` gates `/phs`. Shared presentational components live in `shared/ui/`, and stateful shared components (sidemenu, theme-picker, help-button) in `shared/components/`.

### Change detection
The app is **zoneless** (`provideZonelessChangeDetection`), and components use OnPush, which is the Angular 22 default. State changed by timers is held in signals: `Units.hp`, `Characters.mp` / `limit`, `GameService.gils` / `time` and `BattleService.battle`. `Characters.team` is a signal set by `refresh()`, and the team stats (`hpMax`, `mpMax`, `limitMax`, `hits`, `levelMax`, `levelSum`), the `backup` and the materia slots (`maxMaterias`) are `computed` from it (views read them directly), so call `characters.refresh()` after changing the team, levels or weapons. The rest of the game state (inventories, zones, character XP) is still plain mutable fields, so a mutation from a timer or service won't re-render the view unless it goes through a signal, an input change, or an event handler. Keep this in mind when UI fails to update.

### i18n
Translations are in `src/assets/i18n/{en,fr,es}/{main,help}.json`, loaded with `provideTranslateMultiHttpLoader`. **French is the source language** for Crowdin (`crowdin.yml`). `pnpm i18n:download` pulls translations. Supported languages are listed in `LANGUAGES` (`models/language.ts`).

### PWA / offline
`@angular/service-worker` is registered in `app.config.ts` only outside dev mode, so it is active in production builds, not with `pnpm start`. `ngsw-config.json` prefetches the whole app and all of `src/assets`: the game must work fully offline, so don't load anything from an external URL. `PwaUpdateService` exposes the update state, and `UpdateBannerComponent` asks the player to reload (never forced, since there is no autosave). `firebase.json` serves `ngsw-worker.js`, `ngsw.json` and `index.html` with `no-cache`. App icons in `src/assets/icons/` and `src/favicon.ico` are generated from `resources/icon/sword.png` (CC BY 3.0, recolored: keep the attribution in the About screen and README).

### Styling
Global styles are in `src/styles.scss` (Tailwind + daisyUI with the `cupcake` default and `dark` themes). The in-game help tour uses intro.js: `HelpButtonComponent` (the navbar help button) imports it dynamically on click (lazy chunk), and only its CSS is loaded globally through `angular.json` `styles`.
