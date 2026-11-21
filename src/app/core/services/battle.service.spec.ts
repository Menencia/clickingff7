import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MAX_FIGHTS } from '../../models/zone';
import {
  loadGameData,
  MemoryStorage,
  provideInMemoryGameData,
} from '../../testing/game-data.testing';
import { BattleService } from './battle.service';
import { GameService } from './game.service';

describe('BattleService', () => {
  let service: BattleService;
  let game: GameService;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    await loadGameData();
    game = TestBed.inject(GameService); // new game: buildLevel(1)
    service = TestBed.inject(BattleService);
  });

  afterEach(() => {
    service.battle()?.stop();
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('startRandom', () => {
    it('starts a battle against one enemy of the current zone', () => {
      service.startRandom();

      const battle = service.battle();
      expect(battle).toBeDefined();
      expect(battle?.characters).toBe(game.characters);
      expect(battle?.enemies.list).toHaveLength(1);
      expect(game.zones.current().enemies).toContain(battle?.enemies.list[0]);
      expect(battle?.enemies.hp()).toBe(battle?.enemies.hpMax);
    });

    it('only picks the first enemy of the zone at the start', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      service.startRandom();
      expect(service.battle()?.enemies.list[0]).toBe(
        game.zones.current().enemies[0],
      );
    });

    it('can pick the 4th enemy of the zone after MAX_FIGHTS fights', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      game.zones.current().nbFights = MAX_FIGHTS;
      service.startRandom();
      expect(service.battle()?.enemies.list[0]).toBe(
        game.zones.current().enemies[3],
      );
    });

    it('throws if a battle is already ongoing', () => {
      service.startRandom();
      expect(() => service.startRandom()).toThrow();
      expect(() => service.startBoss()).toThrow();
    });
  });

  describe('on victory', () => {
    it('gives gils, XP and AP, counts the fight and clears the battle', () => {
      service.startRandom();
      const battle = service.battle();
      if (!battle) throw new Error('no battle');
      const [enemy] = battle.enemies.list;

      const gils = game.gils;
      const team = game.characters.getTeam();
      const materias = game.materias.getEquipped();
      expect(team.length).toBeGreaterThan(0);
      expect(materias.length).toBeGreaterThan(0);
      // rewards are small enough not to trigger a level up
      team.forEach((c) => {
        expect(enemy.xpReward()).toBeLessThan(c.getXpMax());
      });
      materias.forEach((m) => {
        expect(enemy.apReward()).toBeLessThan(m.getApMax());
      });

      battle.end(true);

      expect(game.gils).toBe(gils + enemy.gilsReward());
      team.forEach((c) => {
        expect(c.xp).toBe(enemy.xpReward());
      });
      materias.forEach((m) => {
        expect(m.ap).toBe(enemy.apReward());
      });
      game.materias.getUnequipped().forEach((m) => {
        expect(m.ap).toBe(0);
      });
      expect(game.zones.current().nbFights).toBe(1);
      expect(service.battle()).toBeUndefined();
    });

    it('does not complete the zone after a regular enemy', () => {
      service.startRandom();
      service.battle()?.end(true);
      expect(game.zones.current().completed).toBe(false);
    });

    it('refreshes team stats after a level up', () => {
      const hpMax = game.characters.hpMax;
      service.startRandom();
      game.characters.getTeam().forEach((c) => {
        c.xp = c.getXpMax() - 1;
      });
      service.battle()?.end(true);

      expect(game.characters.hpMax).toBeGreaterThan(hpMax);
    });
  });

  describe('on defeat', () => {
    it('gives no reward and does not count the fight', () => {
      const gils = game.gils;
      service.startRandom();
      service.battle()?.end(false);

      expect(game.gils).toBe(gils);
      expect(game.zones.current().nbFights).toBe(0);
      expect(service.battle()).toBeUndefined();
    });

    it('happens when enemies bring the team to 0 HP', () => {
      service.startRandom();
      game.characters.hp.set(1);

      vi.advanceTimersByTime(1000);

      expect(game.characters.hp()).toBe(0);
      expect(service.battle()).toBeUndefined();
      expect(game.zones.current().nbFights).toBe(0);
    });
  });

  describe('canFightBoss', () => {
    it('is false before MAX_FIGHTS fights', () => {
      game.zones.current().nbFights = MAX_FIGHTS - 1;
      expect(service.canFightBoss()).toBe(false);
    });

    it('is true after MAX_FIGHTS fights', () => {
      game.zones.current().nbFights = MAX_FIGHTS;
      expect(service.canFightBoss()).toBe(true);
    });

    it('is false during a battle', () => {
      game.zones.current().nbFights = MAX_FIGHTS;
      service.startRandom();
      expect(service.canFightBoss()).toBe(false);
    });

    it('is false once the zone is completed', () => {
      game.zones.current().nbFights = MAX_FIGHTS;
      game.zones.current().completed = true;
      expect(service.canFightBoss()).toBe(false);
    });
  });

  describe('boss', () => {
    it('fights the zone boss and completes the zone on victory', () => {
      const zone = game.zones.current();
      zone.nbFights = MAX_FIGHTS;

      service.startBoss();
      const battle = service.battle();
      expect(battle?.enemies.list).toEqual(zone.boss);
      expect(battle?.enemies.list.every((e) => e.boss)).toBe(true);

      battle?.end(true);

      expect(zone.completed).toBe(true);
      expect(zone.nbFights).toBe(MAX_FIGHTS + 1);
      expect(game.zones.isNextZone()).toBe(true);
      expect(service.canFightBoss()).toBe(false);
    });

    it('levels the boss from the zone level and team size', () => {
      const zone = game.zones.current();
      zone.nbFights = MAX_FIGHTS;
      const nbCharacters = game.characters.getTeam().length;

      service.startBoss();

      const [boss] = zone.boss;
      const expected = boss.level;
      boss.toLevel(zone.level * (nbCharacters + 1) * 3 * 1.4, game.difficulty);
      expect(boss.level).toBe(expected);
    });

    it('does not complete the zone on defeat', () => {
      const zone = game.zones.current();
      zone.nbFights = MAX_FIGHTS;

      service.startBoss();
      service.battle()?.end(false);

      expect(zone.completed).toBe(false);
      expect(service.canFightBoss()).toBe(true);
    });

    it('does not complete a zone below the highest unlocked zone', () => {
      game.zones.level = 2;
      game.zones.levelMax = 2;
      game.buildLevel(2);
      game.zones.level = 1;
      const zone = game.zones.current();
      zone.nbFights = MAX_FIGHTS;

      service.startBoss();
      service.battle()?.end(true);

      expect(zone.completed).toBe(false);
    });
  });
});
