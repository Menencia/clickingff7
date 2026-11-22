import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { Enemy, EnemyJson } from '../enemy';
import { EnemyRef } from '../refs/enemy';
import { Enemies } from './enemies';

function makeEnemy(data: Partial<EnemyJson> = {}): Enemy {
  const enemy = new Enemy({
    ref: Object.values(EnemyRef)[0],
    image: 'enemy',
    hp: 3,
    hits: 3,
    xp: 3,
    ap: 3,
    gils: 3,
    ...data,
  });
  enemy.toLevel(3, 2); // stat 3: 75 HP, 3 hits
  return enemy;
}

function attackOf(type: string[]): ItActionAttack {
  return { type, use: () => {} };
}

describe('Enemies', () => {
  let enemies: Enemies;

  beforeEach(() => {
    enemies = new Enemies();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('refresh', () => {
    it('sums HP and hits and restores HP to the max', () => {
      enemies.list = [makeEnemy(), makeEnemy({ hp: 4, hits: 5 })];
      enemies.hp.set(1);

      enemies.refresh();

      // hp 4: 1.1 * 25 * 3 = 82.5 -> 83; hits 5: 1.2 * 3 = 3.6 -> 4
      expect(enemies.hpMax()).toBe(75 + 83);
      expect(enemies.hp()).toBe(75 + 83);
      expect(enemies.hits).toBe(3 + 4);
    });

    it('merges weaknesses and resistances without duplicates', () => {
      enemies.list = [
        makeEnemy({ weakness: ['fire', 'bolt'], resistance: ['ice'] }),
        makeEnemy({ weakness: ['bolt', 'wind'] }),
        makeEnemy({ resistance: ['ice', 'earth'] }),
      ];

      enemies.refresh();

      expect(enemies.weakness).toEqual(['fire', 'bolt', 'wind']);
      expect(enemies.resistance).toEqual(['ice', 'earth']);
    });

    it('resets the previous group', () => {
      enemies.list = [makeEnemy({ weakness: ['fire'], resistance: ['ice'] })];
      enemies.refresh();

      enemies.list = [makeEnemy()];
      enemies.refresh();

      expect(enemies.weakness).toEqual([]);
      expect(enemies.resistance).toEqual([]);
      expect(enemies.hpMax()).toBe(75);
      expect(enemies.hits).toBe(3);
    });

    it('empties the group when the list is empty', () => {
      enemies.refresh();
      expect(enemies.hpMax()).toBe(0);
      expect(enemies.isAlive()).toBe(false);
    });
  });

  describe('getAttacked', () => {
    beforeEach(() => {
      enemies.hp.set(100);
    });

    it('removes HP and emits the hits', () => {
      const emitted: ItDisplayHits[] = [];
      enemies.source.hp.subscribe((h) => emitted.push(h));

      enemies.getAttacked(30, attackOf([]));

      expect(enemies.hp()).toBe(70);
      expect(emitted).toEqual([{ hits: 30 }]);
    });

    it('ignores elements the group is not weak to or resistant to', () => {
      enemies.weakness = ['fire'];
      enemies.resistance = ['ice'];
      enemies.getAttacked(10, attackOf(['bolt']));
      expect(enemies.hp()).toBe(90);
    });

    it('triples damage on weakness', () => {
      enemies.weakness = ['fire'];
      const emitted: ItDisplayHits[] = [];
      enemies.source.hp.subscribe((h) => emitted.push(h));

      enemies.getAttacked(10, attackOf(['bolt', 'fire']));

      expect(enemies.hp()).toBe(70);
      expect(emitted).toEqual([{ hits: 30 }]);
    });

    it('divides damage by 3 (rounded down) on resistance', () => {
      enemies.resistance = ['fire'];
      enemies.getAttacked(10, attackOf(['fire']));
      expect(enemies.hp()).toBe(97);
    });

    it('applies weakness then resistance when both match', () => {
      enemies.weakness = ['fire'];
      enemies.resistance = ['fire'];
      enemies.getAttacked(10, attackOf(['fire'])); // 30 -> 10
      expect(enemies.hp()).toBe(90);
    });

    it('does not go below 0 HP', () => {
      enemies.getAttacked(500, attackOf([]));
      expect(enemies.hp()).toBe(0);
      expect(enemies.isAlive()).toBe(false);
    });
  });

  describe('getHits', () => {
    it('applies the variance to the total hits', () => {
      enemies.hits = 100;
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const min = enemies.getHits();
      vi.spyOn(Math, 'random').mockReturnValue(0.999999);
      const max = enemies.getHits();

      expect(min).toBeLessThan(100);
      expect(max).toBeGreaterThan(100);
    });
  });

  describe('getAttackSkill', () => {
    it('attacks the characters with the rolled hits and no element', () => {
      enemies.hits = 50;
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const getAttacked = vi.fn();
      const skill = enemies.getAttackSkill();

      skill.use({ characters: { getAttacked } } as never);

      expect(skill.type).toEqual([]);
      expect(getAttacked).toHaveBeenCalledWith(50, skill);
    });
  });
});
