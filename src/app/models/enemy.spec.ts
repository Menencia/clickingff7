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
      e.toLevel(10, 2);
      expect(e.level).toBe(4);
      expect(e.getHpMax()).toBe(250);
      expect(e.getHits()).toBe(10);
      expect(e.xpReward()).toBe(50);
      expect(e.apReward()).toBe(20);
      expect(e.gilsReward()).toBe(40);
    });

    it('lowers the level sum by 20% in easy difficulty', () => {
      const e = makeEnemy();
      e.toLevel(10, 1); // level sum 8
      expect(e.level).toBe(3);
      expect(e.getHpMax()).toBe(200);
      expect(e.getHits()).toBe(8);
      expect(e.xpReward()).toBe(40);
      expect(e.apReward()).toBe(16);
      expect(e.gilsReward()).toBe(38);
    });

    it('raises the level sum by 20% in hard difficulty', () => {
      const e = makeEnemy();
      e.toLevel(10, 3); // level sum 12
      expect(e.level).toBe(4);
      expect(e.getHpMax()).toBe(300);
      expect(e.getHits()).toBe(12);
      expect(e.xpReward()).toBe(60);
      expect(e.apReward()).toBe(24);
      expect(e.gilsReward()).toBe(42);
    });

    it('rounds the adjusted level sum up', () => {
      const e = makeEnemy();
      e.toLevel(7, 3); // 8.4 -> 9
      expect(e.getHits()).toBe(9);
      expect(e.level).toBe(3);
    });

    it('applies the stat factor to each base stat', () => {
      const e = makeEnemy({ hp: 5, hits: 1 });
      e.toLevel(10, 2);
      expect(e.getHpMax()).toBe(300); // 1.2 * 25 * 10
      expect(e.getHits()).toBe(8); // 0.8 * 10
    });
  });
});
