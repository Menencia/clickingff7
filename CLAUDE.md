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
- `pnpm deploy`: build + `firebase deploy`

CI (`.github/workflows/main.yml`, on `main`/`next`) runs build, `test:ci`, then `lint`. The Husky pre-commit hook runs `biome check --staged`.

## Functional specs

`specs.md` (in French) documents every game rule, formula, data table and screen as currently implemented, plus a list of known anomalies. **Keep it in sync**: any change to game logic, balancing formulas, `src/assets/data/*.json`, unlocks, screens or save format must update the matching section of `specs.md` in the same change. When fixing an issue listed under "Anomalies connues", remove it from that list.

## Code style

Biome is the only linter/formatter (no ESLint/Prettier). It uses single quotes and space indentation, and formats HTML templates too. `noUnusedImports` is an error.

## Architecture

### Bootstrapping and data loading
`app.config.ts` registers an app initializer that runs `DataService.preloadAll()` **before** anything else. It fetches the static game definitions from `src/assets/data/*.json` (characters, enemies, items, materias, weapons, zones) and turns them into model instances. The build order matters: weapons are built before characters, enemies before zones, and so on (see the `/** Depends: ... */` comments).

`StoreService` is a lookup layer over `DataService` by typed ref enums (`models/refs/*.ts`, e.g. `CharacterRef.Cloud`, `WeaponRef.BusterSword`). It throws if a ref is missing. Every ref enum value must match an entry in the corresponding JSON file.

### Game state
`GameService` (root singleton) holds the whole mutable player state: `characters`, `zones`, `weapons`, `materias`, `items`, `gils`, `language`, `difficulty`, `time`. On construction it:
1. loads the save from `localStorage['save1']` (base64-encoded JSON, shaped like the `Save` interface in `models/save.ts`); saves older than `1.1.0` are discarded
2. otherwise resets and calls `buildLevel(1)`

`buildLevel(n)` hardcodes how characters, weapons, materias and items are unlocked as zones progress. The save version comes from `package.json` `version`.

Each collection class (`models/units/characters.ts`, `models/zones.ts`, `models/weapons.ts`, `models/materias.ts`, `models/items.ts`) has `export()` / load logic that maps to `Save`. When you add a persisted field, update the `Save` interfaces, the `export()` methods and `GameService.load()` together.

### Battles
`BattleService` holds the current battle in a `signal<Battle | undefined>`. `Battle` (`models/battle.ts`) runs the enemy attack loop on `setTimeout` and reports state through an RxJS `BehaviorSubject<BattleState>`. On `Ended`, the service applies rewards (gils, XP to the team, AP to equipped materias, zone completion on boss defeat) and clears the signal. A zone's boss becomes available after `MAX_FIGHTS` fights.

Player actions are in `models/actions/` (attack, cure). Materia and item subclasses (`models/materias/`, `models/items/`) implement specific effects.

### Routing and views
`app.routes.ts` lazy-loads one standalone component per screen from `views/view-*`. `BattleGuard` blocks leaving `/game` while a battle is ongoing, and `ZoneGuard` gates `/phs`. Shared presentational components live in `shared/ui/`, and stateful shared components (sidemenu, theme-picker) in `shared/components/`.

### Change detection
The app is **zoneless** (`provideZonelessChangeDetection`), and components use OnPush, which is the Angular 22 default. Game state is mostly plain mutable class fields rather than signals, so a mutation from a timer or service won't re-render the view unless it goes through a signal, an input change, or an event handler. Recent work on the `experiments` branch migrates components off `ChangeDetectionStrategy.Eager` and moves state to signals (e.g. `Units.hp`). Keep this in mind when UI fails to update.

### i18n
Translations are in `src/assets/i18n/{en,fr,es}/{main,help}.json`, loaded with `provideTranslateMultiHttpLoader`. **French is the source language** for Crowdin (`crowdin.yml`). `pnpm i18n:download` pulls translations. Supported languages are listed in `GameService.getLanguage`.

### Styling
Global styles are in `src/styles.scss` (Tailwind + daisyUI with the `cupcake` default and `dark` themes). intro.js is loaded globally through `angular.json` for the in-game help tour.
