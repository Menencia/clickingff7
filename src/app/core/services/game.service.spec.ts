import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import packageJson from '../../../../package.json';
import { MAX_ITEMS } from '../../models/item';
import { CharacterRef } from '../../models/refs/characters';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import { ZoneRef } from '../../models/refs/zones';
import { Save } from '../../models/save';
import { Weapon } from '../../models/weapon';
import { MAX_ZONES } from '../../models/zones';
import {
  loadGameData,
  MemoryStorage,
  provideInMemoryGameData,
  startGame as startGameFromCatalog,
} from '../../testing/game-data.testing';
import { Difficulty, GameService } from './game.service';
import { StoreService } from './store.service';

/** Fresh injector with the in-memory catalog. */
function configure(): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      provideInMemoryGameData(),
      provideTranslateService({ fallbackLang: 'en' }),
    ],
  });
}

/** Starts the app: fresh catalog, then GameService.run(). */
async function startGame(): Promise<GameService> {
  configure();
  return startGameFromCatalog();
}

/** Completes the current zone and unlocks the next one. */
function unlockNextZone(game: GameService): void {
  game.zones.complete();
  game.goNextZone();
}

const refs = <T extends { ref: string }>(list: T[]) => list.map((e) => e.ref);

describe('GameService', () => {
  let game: GameService;

  beforeEach(() => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearTimeout(game?.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('constructor', () => {
    it('has no side effect until run() is called', async () => {
      const save = { getItem: vi.fn(), setItem: vi.fn() };
      vi.stubGlobal('localStorage', save);
      configure();
      await loadGameData();

      game = TestBed.inject(GameService);
      vi.advanceTimersByTime(3000);

      expect(save.getItem).not.toHaveBeenCalled();
      expect(game.zones.list).toEqual([]);
      expect(game.characters.list).toEqual([]);
      expect(game.time()).toBe(0);
    });
  });

  describe('new game', () => {
    beforeEach(async () => {
      game = await startGame();
    });

    it('starts in zone 1 with the level 1 inventory', () => {
      expect(refs(game.zones.list)).toEqual([ZoneRef.Zone1]);
      expect(game.zones.level).toBe(1);
      expect(game.zones.levelMax).toBe(1);

      expect(refs(game.characters.getTeam())).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
      ]);
      expect(game.characters.getTeam().every((c) => c.level === 1)).toBe(true);

      expect(refs(game.weapons.list)).toEqual([
        WeaponRef.BusterSword,
        WeaponRef.GatlingGun,
      ]);
      expect(
        game.weapons.list.every((w) =>
          game.weapons.isEquipped(w, game.characters.list),
        ),
      ).toBe(true);

      expect(refs(game.materias.getEquipped())).toEqual([
        MateriaRef.Restore,
        MateriaRef.Bolt,
      ]);

      expect(refs(game.items.list)).toEqual([ItemRef.Potion]);
      expect(game.items.list[0].nbr).toBe(2);
      expect(game.items.list[0].equipped).toBe(true);
    });

    it('starts with default settings and full HP/MP', () => {
      expect(game.gils()).toBe(200);
      expect(game.difficulty).toBe(Difficulty.Normal);
      expect(game.time()).toBe(0);
      expect(game.version).toBe(packageJson.version);

      expect(game.characters.hpMax()).toBeGreaterThan(0);
      expect(game.characters.hp()).toBe(game.characters.hpMax());
      expect(game.characters.mp()).toBe(game.characters.mpMax());
      expect(game.characters.limit()).toBe(0);
      expect(game.characters.selected.ref).toBe(CharacterRef.Cloud);
    });

    it('counts play time every second', () => {
      vi.advanceTimersByTime(3000);
      expect(game.time()).toBe(3);
    });

    it('does not write a save by itself', () => {
      expect(localStorage.getItem('save1')).toBeNull();
    });
  });

  describe('buildLevel', () => {
    beforeEach(async () => {
      game = await startGame();
    });

    it('zone 2: adds Tifa to the team', () => {
      unlockNextZone(game);

      expect(refs(game.zones.list)).toEqual([ZoneRef.Zone1, ZoneRef.Zone2]);
      expect(refs(game.characters.getTeam())).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
        CharacterRef.Tifa,
      ]);
      expect(refs(game.weapons.list)).toContain(WeaponRef.LeatherGlove);
    });

    it('zone 3: adds Aerith, Barret and Tifa are unavailable', () => {
      unlockNextZone(game);
      unlockNextZone(game);

      expect(refs(game.characters.getTeam())).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Aerith,
      ]);
      expect(refs(game.characters.backup())).toEqual([]);
      expect(refs(game.weapons.list)).toContain(WeaponRef.GuardStick);
    });

    it('zone 4: Barret and Tifa come back, Aerith is unavailable', () => {
      for (let i = 0; i < 3; i++) unlockNextZone(game);

      expect(refs(game.characters.getTeam())).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
        CharacterRef.Tifa,
      ]);
      expect(refs(game.characters.backup())).toEqual([]);
    });

    it('zone 5: adds Red XIII as a backup character', () => {
      for (let i = 0; i < 4; i++) unlockNextZone(game);

      expect(refs(game.characters.backup())).toEqual([CharacterRef.RedXIII]);
      expect(refs(game.characters.getTeam())).not.toContain(
        CharacterRef.RedXIII,
      );
      expect(refs(game.weapons.list)).toContain(WeaponRef.MythrilClip);
      expect(refs(game.zones.list)).toHaveLength(5);
    });

    it('zone 9: adds Yuffie as a backup character', () => {
      for (let i = 0; i < 8; i++) unlockNextZone(game);

      expect(refs(game.zones.list)).toHaveLength(MAX_ZONES);
      // Aerith is back after zone 5, out of the team
      expect(refs(game.characters.backup())).toEqual([
        CharacterRef.Aerith,
        CharacterRef.RedXIII,
        CharacterRef.Yuffie,
      ]);
      expect(refs(game.characters.getTeam())).not.toContain(
        CharacterRef.Yuffie,
      );
      expect(refs(game.weapons.list)).toContain(WeaponRef.FPtShuriken);
      const yuffie = game.characters.list.find(
        (c) => c.ref === CharacterRef.Yuffie,
      );
      expect(yuffie?.weapon.ref).toBe(WeaponRef.FPtShuriken);
    });

    it('zones 6 to 8: unlock nothing but the zone', () => {
      for (let i = 0; i < 4; i++) unlockNextZone(game);
      const characters = refs(game.characters.list);
      const weapons = refs(game.weapons.list);

      for (let i = 0; i < 3; i++) unlockNextZone(game);

      expect(refs(game.zones.list)).toHaveLength(8);
      expect(refs(game.characters.list)).toEqual(characters);
      expect(refs(game.weapons.list)).toEqual(weapons);
    });

    it('adds new characters at the highest team level', () => {
      game.characters.list.forEach((c) => {
        c.setLevel(7);
      });
      game.characters.refresh();

      unlockNextZone(game);

      const tifa = game.characters.list.find(
        (c) => c.ref === CharacterRef.Tifa,
      );
      expect(tifa?.level).toBe(7);
    });

    it('restores HP and MP and empties the limit gauge', () => {
      game.characters.hp.set(1);
      game.characters.mp.set(0);
      game.characters.limit.set(10);

      unlockNextZone(game);

      expect(game.characters.hp()).toBe(game.characters.hpMax());
      expect(game.characters.mp()).toBe(game.characters.mpMax());
      expect(game.characters.limit()).toBe(0);
    });
  });

  describe('save', () => {
    beforeEach(async () => {
      game = await startGame();
    });

    it('writes the export as base64 JSON in localStorage', () => {
      game.gils.set(1234);
      expect(game.save()).toBe(true);

      const saved = JSON.parse(atob(localStorage.getItem('save1') ?? ''));
      expect(saved).toEqual(game.export());
      expect(game.lastSave()).toEqual(saved);
    });

    it('returns false and keeps the last save when the storage refuses it', () => {
      game.gils.set(1000);
      game.save();
      const stored = localStorage.getItem('save1');
      const lastSave = game.lastSave();

      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      });
      game.gils.set(2000);

      expect(game.save()).toBe(false);
      expect(localStorage.getItem('save1')).toBe(stored);
      expect(game.lastSave()).toBe(lastSave);
    });

    it('returns false without a previous save when the storage refuses it', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('Storage disabled', 'SecurityError');
      });

      expect(game.save()).toBe(false);
      expect(localStorage.getItem('save1')).toBeNull();
      expect(game.lastSave()).toBeUndefined();
    });

    it('reset removes the save', () => {
      game.save();
      game.reset();
      expect(localStorage.getItem('save1')).toBeNull();
      expect(game.lastSave()).toBeUndefined();
    });
  });

  describe('load at startup', () => {
    it('restores an exported game (round trip)', async () => {
      game = await startGame();
      unlockNextZone(game);
      game.zones.level = 1;
      game.zones.list[0].nbFights = 15;
      game.zones.list[0].completed = true;
      game.characters.list[0].setXp(150);
      game.materias.list[1].setAp(70);
      game.weapons.list[0].nbr = 2;
      game.items.list[0].nbr = 1;
      game.characters.hp.set(10);
      game.characters.mp.set(1);
      game.characters.limit.set(3);
      game.gils.set(4321);
      game.time.set(99);
      game.difficulty = Difficulty.Hard;
      game.language = 'fr';
      game.save();
      clearTimeout(game.timer);

      const exported = structuredClone(game.export());
      game = await startGame();

      expect(game.export()).toEqual(exported);
      expect(game.lastSave()).toEqual(exported);
    });

    it('falls back to a supported language for an unknown saved one', async () => {
      game = await startGame();
      const save: Save = { ...game.export(), language: 'de' };
      localStorage.setItem('save1', btoa(JSON.stringify(save)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.lastSave()).toBeDefined();
      expect(game.language).toBe('en');
    });

    it('keeps a supported saved language', async () => {
      game = await startGame();
      const save: Save = { ...game.export(), language: 'es' };
      localStorage.setItem('save1', btoa(JSON.stringify(save)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.language).toBe('es');
    });

    it('discards a save older than 1.1.0 and starts a new game', async () => {
      game = await startGame();
      game.gils.set(9999);
      const old: Save = { ...game.export(), version: '1.0.9' };
      localStorage.setItem('save1', btoa(JSON.stringify(old)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.gils()).toBe(200);
      expect(game.lastSave()).toBeUndefined();
      expect(localStorage.getItem('save1')).toBeNull();
    });

    it('derives the equipped weapons from the characters on load', async () => {
      game = await startGame();
      game.weapons.add(
        TestBed.inject(StoreService).getWeapon(WeaponRef.MythrilSaber),
      );
      // 1.5.0 format, with weapons[].equipped contradicting the characters
      const old = {
        ...game.export(),
        version: '1.5.0',
        weapons: [
          { ref: WeaponRef.BusterSword, nbr: 1, equipped: false },
          { ref: WeaponRef.GatlingGun, nbr: 1, equipped: false },
          { ref: WeaponRef.MythrilSaber, nbr: 1, equipped: true },
        ],
      };
      localStorage.setItem('save1', btoa(JSON.stringify(old)));
      clearTimeout(game.timer);

      game = await startGame();

      const owned = (ref: WeaponRef) =>
        game.weapons.list.find((w) => w.ref === ref) as Weapon;
      const cloud = game.characters.list.find(
        (c) => c.ref === CharacterRef.Cloud,
      );
      expect(cloud?.weapon).toBe(owned(WeaponRef.BusterSword));
      expect(game.export().weapons).toEqual([
        { ref: WeaponRef.BusterSword, nbr: 1, equipped: true },
        { ref: WeaponRef.GatlingGun, nbr: 1, equipped: true },
        { ref: WeaponRef.MythrilSaber, nbr: 1, equipped: false },
      ]);
    });

    it('loads a save without weapons[].equipped', async () => {
      game = await startGame();
      const save = game.export();
      const old = {
        ...save,
        weapons: save.weapons.map(({ ref, nbr }) => ({ ref, nbr })),
      };
      localStorage.setItem('save1', btoa(JSON.stringify(old)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.lastSave()).toBeDefined();
      expect(game.export()).toEqual(save);
    });

    it('takes the character images from the catalog, not from the save', async () => {
      game = await startGame();
      const save = game.export();
      const old = {
        ...save,
        characters: {
          ...save.characters,
          list: save.characters.list.map((c) => ({
            ...c,
            image: '/assets/images/characters/renamed.png',
          })),
        },
      };
      localStorage.setItem('save1', btoa(JSON.stringify(old)));
      clearTimeout(game.timer);

      game = await startGame();

      const store = TestBed.inject(StoreService);
      for (const c of game.characters.list) {
        expect(c.image).toBe(store.getCharacter(c.ref).image);
      }
      expect(game.export()).toEqual(save);
    });

    it('loads a save without characters[].image', async () => {
      game = await startGame();
      const save = game.export();
      const old = {
        ...save,
        characters: {
          ...save.characters,
          list: save.characters.list.map(({ image: _, ...c }) => c),
        },
      };
      localStorage.setItem('save1', btoa(JSON.stringify(old)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.lastSave()).toBeDefined();
      expect(game.export()).toEqual(save);
    });

    it('still writes characters[].image for 1.6.0', async () => {
      game = await startGame();
      const store = TestBed.inject(StoreService);
      for (const c of game.export().characters.list) {
        expect(c.image).toBe(store.getCharacter(c.ref).image);
      }
    });

    it('converts a difficulty stored as a string to a number', async () => {
      game = await startGame();
      const old = { ...game.export(), difficulty: '3' };
      localStorage.setItem('save1', btoa(JSON.stringify(old)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.difficulty).toBe(Difficulty.Hard);
      expect(game.export().difficulty).toBe(3);
    });

    it('offers the next zone when the last zone is completed', async () => {
      game = await startGame();
      game.zones.list[0].completed = true;
      game.save();
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.zones.isNextZone()).toBe(true);
    });

    it.each([
      ['not base64', 'not base64 JSON'],
      ['not JSON', btoa('{oops')],
      ['missing fields', btoa(JSON.stringify({ version: '9.9.9' }))],
    ])('starts a new game when the save is corrupted (%s)', async (_, s) => {
      localStorage.setItem('save1', s);
      game = await startGame();

      expect(game.gils()).toBe(200);
      expect(refs(game.zones.list)).toEqual([ZoneRef.Zone1]);
      expect(game.lastSave()).toBeUndefined();
      expect(localStorage.getItem('save1')).toBeNull();
    });

    it('starts a clean new game when the save references unknown data', async () => {
      game = await startGame();
      unlockNextZone(game);
      game.gils.set(9999);
      const save = structuredClone(game.export());
      save.items.push({ ref: 'unknown' as ItemRef, nbr: 1, equipped: false });
      localStorage.setItem('save1', btoa(JSON.stringify(save)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.gils()).toBe(200);
      expect(refs(game.zones.list)).toEqual([ZoneRef.Zone1]);
      expect(refs(game.characters.list)).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
      ]);
      expect(game.lastSave()).toBeUndefined();
    });
  });

  describe('model instances', () => {
    beforeEach(async () => {
      game = await startGame();
    });

    it('characters use the owned weapon instances', () => {
      unlockNextZone(game);
      for (const c of game.characters.list) {
        expect(game.weapons.list).toContain(c.weapon);
      }
    });

    it('characters use the owned weapon instances after a load', async () => {
      unlockNextZone(game);
      game.save();
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.characters.list.length).toBe(3);
      for (const c of game.characters.list) {
        expect(game.weapons.list).toContain(c.weapon);
      }
    });

    it('newGame erases the stored save and restarts the play time', () => {
      game.save();
      vi.advanceTimersByTime(5000);

      game.newGame();

      expect(localStorage.getItem('save1')).toBeNull();
      expect(game.lastSave()).toBeUndefined();
      expect(game.time()).toBe(0);
      vi.advanceTimersByTime(2000);
      expect(game.time()).toBe(2);
    });

    it('a reset starts from clean instances', () => {
      unlockNextZone(game);
      unlockNextZone(game);
      const zone1 = game.zones.list[0];
      zone1.nbFights = 15;
      zone1.completed = true;
      game.characters.list[0].setXp(1000);
      game.materias.list[0].setAp(1000);
      game.weapons.list[0].nbr = 3;
      game.items.list[0].nbr = 9;

      game.newGame();

      expect(game.zones.list[0]).not.toBe(zone1);
      expect(game.zones.list[0]).toMatchObject({
        nbFights: 0,
        completed: false,
      });
      expect(refs(game.characters.list)).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
      ]);
      for (const c of game.characters.list) {
        expect(c).toMatchObject({ level: 1, xp: 0, inTeam: true });
      }
      for (const m of game.materias.list) {
        expect(m).toMatchObject({ level: 1, ap: 0 });
      }
      for (const w of game.weapons.list) {
        expect(w.nbr).toBe(1);
      }
      expect(game.items.list[0].nbr).toBe(2);
    });

    describe('keeps the same collections across games', () => {
      const collections = (g: GameService) => ({
        characters: g.characters,
        zones: g.zones,
        weapons: g.weapons,
        materias: g.materias,
        items: g.items,
        lists: [
          g.characters.list,
          g.zones.list,
          g.weapons.list,
          g.materias.list,
          g.items.list,
        ],
      });

      it('after a new game', () => {
        unlockNextZone(game);
        const before = collections(game);

        game.newGame();

        const after = collections(game);
        expect(after.characters).toBe(before.characters);
        expect(after.zones).toBe(before.zones);
        expect(after.weapons).toBe(before.weapons);
        expect(after.materias).toBe(before.materias);
        expect(after.items).toBe(before.items);
        after.lists.forEach((list, i) => {
          expect(list).toBe(before.lists[i]);
        });
        expect(refs(before.zones.list)).toEqual([ZoneRef.Zone1]);
        expect(before.characters.team().length).toBe(2);
      });

      it('after an import, successful or not', () => {
        const save = structuredClone(game.export());
        unlockNextZone(game);
        const current = structuredClone(game.export());
        const before = collections(game);

        expect(game.importGame(save)).toBe(true);
        expect(game.characters).toBe(before.characters);
        expect(game.zones).toBe(before.zones);
        expect(game.weapons).toBe(before.weapons);
        expect(game.materias).toBe(before.materias);
        expect(game.items).toBe(before.items);
        expect(game.characters.list).toBe(before.lists[0]);
        expect(game.zones.list).toBe(before.lists[1]);
        expect(refs(before.zones.list)).toEqual([ZoneRef.Zone1]);

        expect(game.importGame(current)).toBe(true);
        const broken = structuredClone(save);
        broken.zones.list.push({
          ...broken.zones.list[0],
          ref: 'unknown' as ZoneRef,
        });
        expect(game.importGame(broken)).toBe(false);
        expect(game.characters).toBe(before.characters);
        expect(game.zones).toBe(before.zones);
        expect(game.characters.list).toBe(before.lists[0]);
        expect(game.zones.list).toBe(before.lists[1]);
        expect(game.export()).toEqual(current);
      });
    });

    it('an import does not reuse the previous game objects', () => {
      const save = structuredClone(game.export());
      const previous = {
        zone: game.zones.list[0],
        character: game.characters.list[0],
        weapon: game.weapons.list[0],
        materia: game.materias.list[0],
        item: game.items.list[0],
      };

      expect(game.importGame(save)).toBe(true);
      previous.zone.nbFights = 7;
      previous.character.setXp(1000);
      previous.weapon.nbr = 5;
      previous.materia.setAp(1000);
      previous.item.nbr = 5;

      expect(game.zones.list[0]).not.toBe(previous.zone);
      expect(game.characters.list[0]).not.toBe(previous.character);
      expect(game.weapons.list[0]).not.toBe(previous.weapon);
      expect(game.materias.list[0]).not.toBe(previous.materia);
      expect(game.items.list[0]).not.toBe(previous.item);
      expect(game.export()).toEqual(save);
    });
  });

  describe('importGame', () => {
    beforeEach(async () => {
      game = await startGame();
    });

    it('replaces the current game without writing to storage', () => {
      unlockNextZone(game);
      game.gils.set(1234);
      game.language = 'fr';
      const save = structuredClone(game.export());
      game.newGame();

      expect(game.importGame(save)).toBe(true);

      expect(game.export()).toEqual(save);
      expect(localStorage.getItem('save1')).toBeNull();
    });

    it('keeps the current game when the save references unknown data', () => {
      unlockNextZone(game);
      game.gils.set(777);
      const before = structuredClone(game.export());
      const save = structuredClone(before);
      save.gils = 1;
      save.zones.list.push({
        ...save.zones.list[0],
        ref: 'unknown' as ZoneRef,
      });

      expect(game.importGame(save)).toBe(false);

      expect(game.export()).toEqual(before);
    });

    it.each([
      [
        'current zone missing',
        (s: Save) => {
          s.zones.level = 0;
        },
      ],
      [
        'current zone beyond the last unlocked one',
        (s: Save) => {
          s.zones.level = 2;
        },
      ],
      [
        'last unlocked zone missing',
        (s: Save) => {
          s.zones.levelMax = 2;
        },
      ],
      [
        'no zone',
        (s: Save) => {
          s.zones.list = [];
        },
      ],
      [
        'last unlocked zone beyond MAX_ZONES',
        (s: Save) => {
          s.zones.levelMax = MAX_ZONES + 1;
        },
      ],
      [
        'empty team',
        (s: Save) => {
          s.characters.list.forEach((c) => {
            c.inTeam = false;
          });
        },
      ],
      [
        'no character',
        (s: Save) => {
          s.characters.list = [];
        },
      ],
      [
        'difficulty 0',
        (s: Save) => {
          s.difficulty = 0;
        },
      ],
      [
        'difficulty 4',
        (s: Save) => {
          s.difficulty = 4;
        },
      ],
      [
        'non-numeric difficulty',
        (s: Save) => {
          s.difficulty = 'hard' as unknown as number;
        },
      ],
    ])('refuses a save that cannot be played (%s)', (_, alter) => {
      game.gils.set(777);
      const before = structuredClone(game.export());
      const save = structuredClone(before);
      alter(save);

      expect(game.importGame(save)).toBe(false);

      expect(game.export()).toEqual(before);
      expect(() => game.zones.current()).not.toThrow();
    });

    it('refuses an empty team once the unavailable characters leave it', () => {
      unlockNextZone(game);
      unlockNextZone(game); // zone 3: Barret and Tifa are unavailable
      const save = structuredClone(game.export());
      save.characters.list.forEach((c) => {
        c.inTeam = c.ref === CharacterRef.Barret || c.ref === CharacterRef.Tifa;
      });

      expect(game.importGame(save)).toBe(false);
    });

    it.each([3, 4, MAX_ZONES])(
      'accepts an exported game in zone %i (round trip)',
      (zone) => {
        while (game.zones.levelMax < zone) {
          unlockNextZone(game);
        }
        const save = structuredClone(game.export());
        game.newGame();

        expect(game.importGame(save)).toBe(true);

        expect(game.export()).toEqual(save);
        expect(game.characters.selected).toBeDefined();
      },
    );

    it(`unequips the items beyond ${MAX_ITEMS} on load`, () => {
      const store = TestBed.inject(StoreService);
      game.items.add(store.getItem(ItemRef.Ether));
      game.items.add(store.getItem(ItemRef.HiPotion));
      const save = structuredClone(game.export());
      save.items.forEach((i) => {
        i.equipped = true;
      });

      expect(game.importGame(save)).toBe(true);

      expect(refs(game.items.getEquipped())).toEqual([
        ItemRef.Potion,
        ItemRef.Ether,
      ]);
    });

    it('keeps a single play-time timer', () => {
      const save = structuredClone(game.export());
      game.importGame(save);
      game.importGame(save);

      vi.advanceTimersByTime(3000);
      expect(game.time()).toBe(save.time + 3);
    });
  });

  describe('goNextZone', () => {
    beforeEach(async () => {
      game = await startGame();
    });

    it('does nothing while the current zone is not completed', () => {
      game.goNextZone();

      expect(game.zones.level).toBe(1);
      expect(game.zones.levelMax).toBe(1);
      expect(game.zones.list).toHaveLength(1);
    });

    it('builds and unlocks a new zone', () => {
      game.zones.complete();
      game.goNextZone();

      expect(game.zones.level).toBe(2);
      expect(game.zones.levelMax).toBe(2);
      expect(game.zones.current().level).toBe(2);
      expect(refs(game.characters.list)).toContain(CharacterRef.Tifa);
    });

    it('moves to a known zone without rebuilding it', () => {
      unlockNextZone(game);
      const zone2 = game.zones.current();
      const nbCharacters = game.characters.list.length;

      game.zones.goTo(1);
      game.goNextZone();

      expect(game.zones.level).toBe(2);
      expect(game.zones.current()).toBe(zone2);
      expect(game.zones.list).toHaveLength(2);
      expect(game.characters.list).toHaveLength(nbCharacters);
    });

    it('does nothing after the last zone', () => {
      while (game.zones.levelMax < MAX_ZONES) unlockNextZone(game);
      game.zones.complete();
      game.goNextZone();

      expect(game.zones.level).toBe(MAX_ZONES);
      expect(game.zones.levelMax).toBe(MAX_ZONES);
      expect(game.zones.list).toHaveLength(MAX_ZONES);
    });
  });

  describe('Zones.goTo', () => {
    beforeEach(async () => {
      game = await startGame();
      unlockNextZone(game);
    });

    it('moves to an unlocked zone', () => {
      game.zones.goTo(1);
      expect(game.zones.level).toBe(1);
    });

    it('ignores a zone that is not unlocked', () => {
      game.zones.goTo(3);
      expect(game.zones.level).toBe(2);
      game.zones.goTo(0);
      expect(game.zones.level).toBe(2);
    });
  });

  describe('equipWeapon', () => {
    const character = (ref: CharacterRef) => {
      const found = game.characters.list.find((c) => c.ref === ref);
      if (!found) throw new Error(`${ref} not found`);
      return found;
    };
    const weapon = (ref: WeaponRef) => {
      const found = game.weapons.list.find((w) => w.ref === ref);
      if (!found) throw new Error(`${ref} not owned`);
      return found;
    };
    const isEquipped = (w: Weapon) =>
      game.weapons.isEquipped(w, game.characters.list);

    beforeEach(async () => {
      game = await startGame(); // zone 1: Cloud and Barret
      game.weapons.add(
        TestBed.inject(StoreService).getWeapon(WeaponRef.MythrilSaber),
      );
    });

    it('unequips the previous weapon and recomputes the team stats', () => {
      const cloud = character(CharacterRef.Cloud);
      const busterSword = weapon(WeaponRef.BusterSword);
      const saber = weapon(WeaponRef.MythrilSaber);
      const hits = game.characters.hits();

      expect(game.canEquipWeapon(cloud, saber)).toBe(true);
      game.equipWeapon(cloud, saber);

      expect(cloud.weapon).toBe(saber);
      expect(isEquipped(saber)).toBe(true);
      expect(isEquipped(busterSword)).toBe(false);
      expect(game.characters.hits()).toBeGreaterThan(hits);
      expect(game.canEquipWeapon(cloud, saber)).toBe(false);
      expect(game.canEquipWeapon(cloud, busterSword)).toBe(true);
    });

    it('ignores a weapon of another type', () => {
      const barret = character(CharacterRef.Barret);
      const gatlingGun = weapon(WeaponRef.GatlingGun);
      const saber = weapon(WeaponRef.MythrilSaber);

      expect(game.canEquipWeapon(barret, saber)).toBe(false);
      game.equipWeapon(barret, saber);

      expect(barret.weapon).toBe(gatlingGun);
      expect(isEquipped(gatlingGun)).toBe(true);
      expect(isEquipped(saber)).toBe(false);
    });

    it('ignores a weapon that is already worn', () => {
      const cloud = character(CharacterRef.Cloud);
      const busterSword = weapon(WeaponRef.BusterSword);

      game.equipWeapon(cloud, busterSword);

      expect(cloud.weapon).toBe(busterSword);
      expect(isEquipped(busterSword)).toBe(true);
    });
  });

  describe('materia slots', () => {
    const character = (ref: CharacterRef) => {
      const found = game.characters.list.find((c) => c.ref === ref);
      if (!found) throw new Error(`${ref} not found`);
      return found;
    };
    const equipped = () => refs(game.materias.getEquipped());

    beforeEach(async () => {
      game = await startGame();
      unlockNextZone(game);
      unlockNextZone(game); // zone 3: Cloud (1 slot) and Aerith (2 slots)
      game.materias.add(
        TestBed.inject(StoreService).getMateria(MateriaRef.Fire),
        true,
      );
    });

    it('all 3 slots are used in zone 3', () => {
      expect(game.characters.maxMaterias()).toBe(3);
      expect(equipped()).toEqual([
        MateriaRef.Restore,
        MateriaRef.Bolt,
        MateriaRef.Fire,
      ]);
    });

    it('a character leaving the team unequips the materias in excess', () => {
      game.leaveTeam(character(CharacterRef.Aerith));

      expect(game.characters.maxMaterias()).toBe(1);
      expect(equipped()).toEqual([MateriaRef.Restore]);
    });

    it('the last character cannot leave, and keeps the materias', () => {
      game.leaveTeam(character(CharacterRef.Aerith));
      game.leaveTeam(character(CharacterRef.Cloud));

      expect(character(CharacterRef.Cloud).inTeam).toBe(true);
      expect(equipped()).toEqual([MateriaRef.Restore]);
    });

    it('a weapon with fewer slots unequips the materias in excess', () => {
      const aerith = character(CharacterRef.Aerith);
      const rod = TestBed.inject(StoreService).getWeapon(WeaponRef.MythrilRod);
      rod.maxMaterias = 1;
      game.weapons.add(rod);

      game.equipWeapon(aerith, rod);

      expect(game.characters.maxMaterias()).toBe(2);
      expect(equipped()).toEqual([MateriaRef.Restore, MateriaRef.Bolt]);
    });

    it('a save with too many equipped materias is fixed on load', async () => {
      const save = game.export();
      save.characters.list.forEach((c) => {
        c.inTeam = c.ref === CharacterRef.Cloud;
      });
      localStorage.setItem('save1', btoa(JSON.stringify(save)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.characters.maxMaterias()).toBe(1);
      expect(equipped()).toEqual([MateriaRef.Restore]);
    });
  });
});
