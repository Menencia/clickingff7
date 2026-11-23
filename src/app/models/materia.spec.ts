import { MateriaJson } from './materia';
import { AttackMateria } from './materias/attack-materia';
import { CureMateria } from './materias/cure-materia';
import { MateriaRef } from './refs/materias';

function json(data: Partial<MateriaJson> = {}): MateriaJson {
  return {
    ref: MateriaRef.Fire,
    type: 'attack',
    color: 'green',
    price: 0,
    ap: 3,
    pwr: 10,
    zoneAvailable: 1,
    ...data,
  };
}

function makeAttack(data: Partial<MateriaJson> = {}): AttackMateria {
  return new AttackMateria({ ...json(data), elements: ['fire'] });
}

function makeCure(data: Partial<MateriaJson> = {}): CureMateria {
  return new CureMateria(json({ ref: MateriaRef.Restore, ...data }));
}

describe('Materia', () => {
  describe('getApMax', () => {
    it('scales with level and the AP stat', () => {
      const m = makeAttack();
      expect(m.getApMax()).toBe(60);
      m.level = 3;
      expect(m.getApMax()).toBe(180);
      expect(makeAttack({ ap: 5 }).getApMax()).toBe(72);
    });
  });

  describe('apProgress', () => {
    it('returns the rounded percentage of AP toward the next level', () => {
      const m = makeAttack();
      expect(m.apProgress()).toBe(0);
      m.ap = Math.floor(m.getApMax() / 3);
      expect(m.apProgress()).toBe(Math.round((m.ap / m.getApMax()) * 100));
    });
  });

  describe('isOwned', () => {
    it('is true only when a materia with the same ref is in the list', () => {
      const fire = makeAttack();
      expect(fire.isOwned([])).toBe(false);
      expect(fire.isOwned([makeCure()])).toBe(false);
      expect(fire.isOwned([makeCure(), makeAttack()])).toBe(true);
    });
  });

  describe('setAp', () => {
    it('accumulates AP without leveling below the threshold', () => {
      const m = makeAttack();
      m.setAp(59);
      expect(m.level).toBe(1);
      expect(m.ap).toBe(59);
    });

    it('can gain several levels at once and keeps the remainder', () => {
      const m = makeAttack();
      // 60 (lv1 -> 2) + 120 (lv2 -> 3) = 180, remainder 20
      m.setAp(200);
      expect(m.level).toBe(3);
      expect(m.ap).toBe(20);
    });

    it('stops leveling at level 100 but keeps accumulating AP', () => {
      const m = makeAttack();
      m.level = 100;
      m.setAp(1_000_000);
      expect(m.level).toBe(100);
      expect(m.ap).toBe(1_000_000);
    });

    it('never goes past level 100', () => {
      const m = makeAttack();
      m.level = 99;
      m.setAp(1_000_000);
      expect(m.level).toBe(100);
    });
  });

  describe('AttackMateria MP cost', () => {
    it.each([
      { pwr: 10, level: 1, cost: 0 },
      { pwr: 49, level: 1, cost: 0 },
      { pwr: 50, level: 1, cost: 1 },
      { pwr: 49, level: 2, cost: 1 },
      { pwr: 100, level: 1, cost: 2 },
    ])('costs $cost MP at power $pwr, level $level', ({ pwr, level, cost }) => {
      const m = makeAttack({ pwr });
      m.level = level;
      expect(m.getPwr()).toBe(pwr + level - 1);
      expect(m.getMpCost()).toBe(cost);
    });
  });

  describe('CureMateria MP cost', () => {
    it.each([
      { pwr: 10, level: 1, cost: 0 },
      { pwr: 19, level: 1, cost: 0 },
      { pwr: 20, level: 1, cost: 1 },
      { pwr: 19, level: 2, cost: 1 },
      { pwr: 40, level: 1, cost: 2 },
    ])('costs $cost MP at power $pwr, level $level', ({ pwr, level, cost }) => {
      const m = makeCure({ pwr });
      m.level = level;
      expect(m.getPwr()).toBe(pwr + level - 1);
      expect(m.getMpCost()).toBe(cost);
    });
  });
});
