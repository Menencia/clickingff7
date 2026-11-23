import { Difficulty } from './difficulty';
import { Enemy, EnemyJson } from './enemy';
import { EnemyRef } from './refs/enemy';

function makeEnemy(data: Partial<EnemyJson> = {}): Enemy {
  return new Enemy({
    ref: EnemyRef.Aps,
    image: 'aps',
    hp: 3,
    hits: 3,
    xp: 3,
    ap: 3,
    gils: 3,
    ...data,
  });
}

describe('Enemy', () => {
  describe('toLevel', () => {
    it('computes stats from the level sum in normal difficulty', () => {
      const e = makeEnemy();
      e.toLevel(10, Difficulty.Normal);
      expect(e.level).toBe(4);
      expect(e.hpMax).toBe(250);
      expect(e.hits).toBe(10);
      expect(e.xp).toBe(50);
      expect(e.ap).toBe(20);
      expect(e.gils).toBe(40);
    });

    it('lowers the level sum by 20% in easy difficulty', () => {
      const e = makeEnemy();
      e.toLevel(10, Difficulty.Easy); // level sum 8
      expect(e.level).toBe(3);
      expect(e.hpMax).toBe(200);
      expect(e.hits).toBe(8);
      expect(e.xp).toBe(40);
      expect(e.ap).toBe(16);
      expect(e.gils).toBe(38);
    });

    it('raises the level sum by 20% in hard difficulty', () => {
      const e = makeEnemy();
      e.toLevel(10, Difficulty.Hard); // level sum 12
      expect(e.level).toBe(4);
      expect(e.hpMax).toBe(300);
      expect(e.hits).toBe(12);
      expect(e.xp).toBe(60);
      expect(e.ap).toBe(24);
      expect(e.gils).toBe(42);
    });

    it('rounds the adjusted level sum up', () => {
      const e = makeEnemy();
      e.toLevel(7, Difficulty.Hard); // 8.4 -> 9
      expect(e.hits).toBe(9);
      expect(e.level).toBe(3);
    });

    it('applies the stat factor to each base stat', () => {
      const e = makeEnemy({ hp: 5, hits: 1 });
      e.toLevel(10, Difficulty.Normal);
      expect(e.hpMax).toBe(300); // 1.2 * 25 * 10
      expect(e.hits).toBe(8); // 0.8 * 10
    });
  });
});
