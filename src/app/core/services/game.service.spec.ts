import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import packageJson from '../../../../package.json';
import { CharacterRef } from '../../models/refs/characters';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import { ZoneRef } from '../../models/refs/zones';
import { Save } from '../../models/save';
import {
  loadGameData,
  MemoryStorage,
  provideInMemoryGameData,
} from '../../testing/game-data.testing';
import { Difficulty, GameService } from './game.service';

/** Starts the app: fresh catalog, then GameService (which runs run()). */
async function startGame(): Promise<GameService> {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      provideInMemoryGameData(),
      provideTranslateService({ fallbackLang: 'en' }),
    ],
  });
  await loadGameData();
  return TestBed.inject(GameService);
}

/** Unlocks the next zone, as ViewMapComponent.goNextZone() does. */
function unlockNextZone(game: GameService): void {
  game.zones.level += 1;
  game.zones.levelMax += 1;
  game.buildLevel(game.zones.level);
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
      expect(game.weapons.list.every((w) => w.equipped)).toBe(true);

      expect(refs(game.materias.getEquipped())).toEqual([
        MateriaRef.Restore,
        MateriaRef.Bolt,
      ]);

      expect(refs(game.items.list)).toEqual([ItemRef.Potion]);
      expect(game.items.list[0].nbr).toBe(2);
      expect(game.items.list[0].equipped).toBe(true);
    });

    it('starts with default settings and full HP/MP', () => {
      expect(game.gils).toBe(200);
      expect(game.difficulty).toBe(Difficulty.Normal);
      expect(game.time).toBe(0);
      expect(game.version).toBe(packageJson.version);

      expect(game.characters.hpMax).toBeGreaterThan(0);
      expect(game.characters.hp()).toBe(game.characters.hpMax);
      expect(game.characters.mp).toBe(game.characters.mpMax);
      expect(game.characters.limit).toBe(0);
      expect(game.characters.selected.ref).toBe(CharacterRef.Cloud);
    });

    it('counts play time every second', () => {
      vi.advanceTimersByTime(3000);
      expect(game.time).toBe(3);
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
      expect(refs(game.characters.getBackup())).toEqual([]);
      expect(refs(game.weapons.list)).toContain(WeaponRef.GuardStick);
    });

    it('zone 4: Barret and Tifa come back, Aerith is unavailable', () => {
      for (let i = 0; i < 3; i++) unlockNextZone(game);

      expect(refs(game.characters.getTeam())).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
        CharacterRef.Tifa,
      ]);
      expect(refs(game.characters.getBackup())).toEqual([]);
    });

    it('zone 5: adds Red XIII as a backup character', () => {
      for (let i = 0; i < 4; i++) unlockNextZone(game);

      expect(refs(game.characters.getBackup())).toEqual([CharacterRef.RedXIII]);
      expect(refs(game.characters.getTeam())).not.toContain(
        CharacterRef.RedXIII,
      );
      expect(refs(game.weapons.list)).toContain(WeaponRef.MythrilClip);
      expect(refs(game.zones.list)).toHaveLength(5);
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
      game.characters.mp = 0;
      game.characters.limit = 10;

      unlockNextZone(game);

      expect(game.characters.hp()).toBe(game.characters.hpMax);
      expect(game.characters.mp).toBe(game.characters.mpMax);
      expect(game.characters.limit).toBe(0);
    });
  });

  describe('save', () => {
    beforeEach(async () => {
      game = await startGame();
    });

    it('writes the export as base64 JSON in localStorage', () => {
      game.gils = 1234;
      game.save();

      const saved = JSON.parse(atob(localStorage.getItem('save1') ?? ''));
      expect(saved).toEqual(game.export());
      expect(game.saves[0]).toEqual(saved);
    });

    it('does nothing when not confirmed', () => {
      game.save(false);
      expect(localStorage.getItem('save1')).toBeNull();
    });

    it('reset removes the save', () => {
      game.save();
      game.reset();
      expect(localStorage.getItem('save1')).toBeNull();
      expect(game.saves).toEqual([]);
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
      game.characters.mp = 1;
      game.characters.limit = 3;
      game.gils = 4321;
      game.time = 99;
      game.difficulty = Difficulty.Hard;
      game.language = 'fr';
      game.save();
      clearTimeout(game.timer);

      const exported = structuredClone(game.export());
      game = await startGame();

      expect(game.export()).toEqual(exported);
      expect(game.saves).toEqual([exported]);
    });

    it('discards a save older than 1.1.0 and starts a new game', async () => {
      game = await startGame();
      game.gils = 9999;
      const old: Save = { ...game.export(), version: '1.0.9' };
      localStorage.setItem('save1', btoa(JSON.stringify(old)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.gils).toBe(200);
      expect(game.saves).toEqual([]);
      expect(localStorage.getItem('save1')).toBeNull();
    });

    it('offers the next zone when the last zone is completed', async () => {
      game = await startGame();
      game.zones.list[0].completed = true;
      game.save();
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.zones.nextZone).toBe(true);
    });

    it.each([
      ['not base64', 'not base64 JSON'],
      ['not JSON', btoa('{oops')],
      ['missing fields', btoa(JSON.stringify({ version: '9.9.9' }))],
    ])('starts a new game when the save is corrupted (%s)', async (_, s) => {
      localStorage.setItem('save1', s);
      game = await startGame();

      expect(game.gils).toBe(200);
      expect(refs(game.zones.list)).toEqual([ZoneRef.Zone1]);
      expect(game.saves).toEqual([]);
      expect(localStorage.getItem('save1')).toBeNull();
    });

    it('starts a clean new game when the save references unknown data', async () => {
      game = await startGame();
      unlockNextZone(game);
      game.gils = 9999;
      const save = structuredClone(game.export());
      save.items.push({ ref: 'unknown' as ItemRef, nbr: 1, equipped: false });
      localStorage.setItem('save1', btoa(JSON.stringify(save)));
      clearTimeout(game.timer);

      game = await startGame();

      expect(game.gils).toBe(200);
      expect(refs(game.zones.list)).toEqual([ZoneRef.Zone1]);
      expect(refs(game.characters.list)).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
      ]);
      expect(game.saves).toEqual([]);
    });
  });
});
