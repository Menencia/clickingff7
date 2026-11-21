import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MateriaRef } from '../../models/refs/materias';
import { MAX_FIGHTS } from '../../models/zone';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
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
    game = await startGame(); // new game: buildLevel(1)
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
      expect(battle?.enemies.hp()).toBe(battle?.enemies.hpMax());
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

    it('throws if the team has no HP left', () => {
      game.characters.hp.set(0);
      game.zones.current().nbFights = MAX_FIGHTS;
      expect(() => service.startRandom()).toThrow();
      expect(() => service.startBoss()).toThrow();
      expect(service.battle()).toBeUndefined();
    });
  });

  describe('canFightRandom', () => {
    it('is true out of battle with HP left', () => {
      expect(service.canFightRandom()).toBe(true);
    });

    it('is false during a battle', () => {
      service.startRandom();
      expect(service.canFightRandom()).toBe(false);
    });

    it('is false after a defeat, until the team is healed', () => {
      service.startRandom();
      game.characters.hp.set(1);
      vi.advanceTimersByTime(1000);
      expect(service.canFightRandom()).toBe(false);

      game.characters.addHp(1);
      expect(service.canFightRandom()).toBe(true);
    });
  });

  describe('on victory', () => {
    it('gives gils, XP and AP, counts the fight and clears the battle', () => {
      service.startRandom();
      const battle = service.battle();
      if (!battle) throw new Error('no battle');
      const [enemy] = battle.enemies.list;

      const gils = game.gils();
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

      expect(game.gils()).toBe(gils + enemy.gilsReward());
      team.forEach((c) => {
        expect(c.xp).toBe(enemy.xpReward());
      });
      materias.forEach((m) => {
        expect(m.ap).toBe(enemy.apReward());
      });
      game.materias.list
        .filter((m) => !m.equipped)
        .forEach((m) => {
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
      const hpMax = game.characters.hpMax();
      service.startRandom();
      game.characters.getTeam().forEach((c) => {
        c.xp = c.getXpMax() - 1;
      });
      service.battle()?.end(true);

      expect(game.characters.hpMax()).toBeGreaterThan(hpMax);
    });
  });

  describe('on defeat', () => {
    it('gives no reward and does not count the fight', () => {
      const gils = game.gils();
      service.startRandom();
      service.battle()?.end(false);

      expect(game.gils()).toBe(gils);
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

    it('empties the limit gauge when the team is defeated', () => {
      service.startRandom();
      game.characters.hp.set(1);
      game.characters.limit.set(10);

      vi.advanceTimersByTime(1000);

      expect(service.battle()).toBeUndefined();
      expect(game.characters.limit()).toBe(0);
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

    it('is false when the team has no HP left', () => {
      game.zones.current().nbFights = MAX_FIGHTS;
      game.characters.hp.set(0);
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
  function startBattle() {
    service.startRandom();
    const battle = service.battle();
    if (!battle) throw new Error('no battle');
    return battle;
  }

  function materia(ref: MateriaRef) {
    const m = game.materias.list.find((e) => e.ref === ref);
    if (!m) throw new Error(`no materia ${ref}`);
    return m;
  }

  describe('attack', () => {
    it('does nothing outside a battle', () => {
      expect(() => service.attack()).not.toThrow();
      expect(service.battle()).toBeUndefined();
    });

    it('damages the enemies without ending the battle', () => {
      const battle = startBattle();
      battle.enemies.hp.set(battle.enemies.hpMax() * 1000);
      const hp = battle.enemies.hp();

      service.attack();

      expect(battle.enemies.hp()).toBeLessThan(hp);
      expect(service.battle()).toBe(battle);
    });

    it('uses the Limit and resets the gauge when full', () => {
      const battle = startBattle();
      battle.enemies.hp.set(battle.enemies.hpMax() * 1000);
      game.characters.limit.set(game.characters.limitMax());

      service.attack();

      expect(game.characters.limit()).toBe(0);
    });

    it('deals about 5 times more damage with the Limit', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // no variance, no critical
      const battle = startBattle();
      const hpStart = battle.enemies.hpMax() * 1000;

      battle.enemies.hp.set(hpStart);
      service.attack();
      const normal = hpStart - battle.enemies.hp();

      battle.enemies.hp.set(hpStart);
      game.characters.limit.set(game.characters.limitMax());
      service.attack();
      const limit = hpStart - battle.enemies.hp();

      // exact ×5 is covered in characters.spec.ts; here hits are small and rounded
      expect(limit).toBeGreaterThanOrEqual(normal * 4);
      expect(limit).toBeLessThanOrEqual(normal * 6);
    });

    it('keeps the gauge when it is not full', () => {
      const battle = startBattle();
      battle.enemies.hp.set(battle.enemies.hpMax() * 1000);
      game.characters.limit.set(1);

      service.attack();

      expect(game.characters.limit()).toBe(1);
    });

    it('wins the battle when the enemies reach 0 HP', () => {
      const battle = startBattle();
      battle.enemies.hp.set(1);

      service.attack();

      expect(battle.victory).toBe(true);
      expect(service.battle()).toBeUndefined();
      expect(game.zones.current().nbFights).toBe(1);
    });
  });

  describe('escape', () => {
    it('ends the battle as a defeat, without rewards', () => {
      service.startRandom();
      const battle = service.battle();
      const gils = game.gils();
      const xp = game.characters.list.map((c) => c.xp);

      service.escape();

      expect(service.battle()).toBeUndefined();
      expect(battle?.victory).toBe(false);
      expect(game.gils()).toBe(gils);
      expect(game.characters.list.map((c) => c.xp)).toEqual(xp);
      expect(game.zones.current().nbFights).toBe(0);
    });

    it('keeps the limit gauge', () => {
      service.startRandom();
      game.characters.limit.set(10);

      service.escape();

      expect(game.characters.limit()).toBe(10);
    });

    it('does nothing outside a battle', () => {
      expect(() => service.escape()).not.toThrow();
      expect(service.battle()).toBeUndefined();
    });
  });

  describe('useMateria', () => {
    it('pays the MP cost and damages the enemies', () => {
      const battle = startBattle();
      battle.enemies.hp.set(battle.enemies.hpMax() * 1000);
      const bolt = materia(MateriaRef.Bolt);
      game.characters.mp.set(game.characters.mpMax());
      const mp = game.characters.mp();
      const hp = battle.enemies.hp();

      expect(service.canUseMateria(bolt)).toBe(true);
      service.useMateria(bolt);

      expect(game.characters.mp()).toBe(mp - bolt.getMpCost());
      expect(battle.enemies.hp()).toBeLessThan(hp);
      expect(service.battle()).toBe(battle);
    });

    it('wins the battle when the enemies reach 0 HP', () => {
      const battle = startBattle();
      battle.enemies.hp.set(1);
      game.characters.mp.set(game.characters.mpMax());

      service.useMateria(materia(MateriaRef.Bolt));

      expect(battle.victory).toBe(true);
      expect(service.battle()).toBeUndefined();
    });

    it('does nothing when the materia cannot be used', () => {
      const bolt = materia(MateriaRef.Bolt);
      game.characters.mp.set(game.characters.mpMax());
      const mp = game.characters.mp();

      // attack materia outside a battle
      expect(service.canUseMateria(bolt)).toBe(false);
      expect(() => service.useMateria(bolt)).not.toThrow();
      expect(game.characters.mp()).toBe(mp);
    });

    it('does nothing without enough MP', () => {
      const battle = startBattle();
      const hp = battle.enemies.hp();
      const bolt = materia(MateriaRef.Bolt);
      expect(bolt.getMpCost()).toBeGreaterThan(0);
      game.characters.mp.set(bolt.getMpCost() - 1);

      expect(service.canUseMateria(bolt)).toBe(false);
      service.useMateria(bolt);

      expect(game.characters.mp()).toBe(bolt.getMpCost() - 1);
      expect(battle.enemies.hp()).toBe(hp);
    });

    it('can cure outside a battle', () => {
      const restore = materia(MateriaRef.Restore);
      game.characters.mp.set(game.characters.mpMax());
      game.characters.hp.set(1);

      service.useMateria(restore);

      expect(game.characters.hp()).toBeGreaterThan(1);
      expect(game.characters.mp()).toBe(
        game.characters.mpMax() - restore.getMpCost(),
      );
    });
  });

  describe('useItem', () => {
    it('consumes one item and applies its effect', () => {
      const [potion] = game.items.list;
      expect(potion.nbr).toBe(2);
      game.characters.hp.set(1);

      expect(service.canUseItem(potion)).toBe(true);
      service.useItem(potion);

      expect(potion.nbr).toBe(1);
      expect(game.items.list).toContain(potion);
      expect(game.characters.hp()).toBeGreaterThan(1);
    });

    it('removes the item from the stock when the last one is used', () => {
      const [potion] = game.items.list;
      potion.nbr = 1;
      game.characters.hp.set(1);

      service.useItem(potion);

      expect(game.items.list).not.toContain(potion);
    });

    it('does nothing when the item cannot be used', () => {
      const [potion] = game.items.list;
      game.characters.hp.set(game.characters.hpMax());

      expect(service.canUseItem(potion)).toBe(false);
      expect(() => service.useItem(potion)).not.toThrow();
      expect(potion.nbr).toBe(2);
    });

    it('does not end the battle', () => {
      const battle = startBattle();
      const [potion] = game.items.list;
      game.characters.hp.set(1);

      service.useItem(potion);

      expect(service.battle()).toBe(battle);
    });
  });
});
