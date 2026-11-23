import { Context } from '../context';
import { ItemJson } from '../item';
import { ItemRef } from '../refs/items';
import { HpPotion } from './hp-potion';
import { MpPotion } from './mp-potion';

function json(data: Partial<ItemJson> = {}): ItemJson {
  return {
    ref: ItemRef.Potion,
    type: 'hp-potion',
    price: 0,
    pwr: 0.33,
    zoneAvailable: 1,
    ...data,
  };
}

function makeContext(
  stats: { hp?: number; hpMax?: number; mp?: number; mpMax?: number } = {},
) {
  const { hp = 0, hpMax = 0, mp = 0, mpMax = 0 } = stats;
  const characters = {
    hp: () => hp,
    hpMax: () => hpMax,
    mp: () => mp,
    mpMax: () => mpMax,
    addHp: vi.fn(),
    addMp: vi.fn(),
  };
  const context = { characters, battle: undefined } as unknown as Context;
  return { context, characters };
}

describe('Potions', () => {
  describe('HpPotion', () => {
    it.each([
      // ⌈0.33 × 100⌉ = 33, ⌈0.33 × 101⌉ = ⌈33.33⌉ = 34
      { pwr: 0.33, hpMax: 100, amount: 33 },
      { pwr: 0.33, hpMax: 101, amount: 34 },
      { pwr: 0.66, hpMax: 1000, amount: 660 },
      // small values are rounded up, never to 0
      { pwr: 0.33, hpMax: 1, amount: 1 },
    ])(
      'restores $amount HP with power $pwr and $hpMax max HP',
      ({ pwr, hpMax, amount }) => {
        const { context, characters } = makeContext({ hpMax });
        new HpPotion(json({ pwr })).use(context);
        expect(characters.addHp).toHaveBeenCalledWith(amount);
        expect(characters.addMp).not.toHaveBeenCalled();
      },
    );

    it('is usable only when HP are not full', () => {
      const potion = new HpPotion(json());
      expect(potion.canUse(makeContext({ hp: 99, hpMax: 100 }).context)).toBe(
        true,
      );
      expect(potion.canUse(makeContext({ hp: 100, hpMax: 100 }).context)).toBe(
        false,
      );
    });
  });

  describe('MpPotion', () => {
    const ether = json({ ref: ItemRef.Ether, type: 'mp-potion' });

    it.each([
      { pwr: 0.33, mpMax: 100, amount: 33 },
      { pwr: 0.33, mpMax: 10, amount: 4 },
      { pwr: 0.66, mpMax: 50, amount: 33 },
      { pwr: 0.33, mpMax: 1, amount: 1 },
    ])(
      'restores $amount MP with power $pwr and $mpMax max MP',
      ({ pwr, mpMax, amount }) => {
        const { context, characters } = makeContext({ mpMax });
        new MpPotion({ ...ether, pwr }).use(context);
        expect(characters.addMp).toHaveBeenCalledWith(amount);
        expect(characters.addHp).not.toHaveBeenCalled();
      },
    );

    it('is usable only when MP are not full', () => {
      const potion = new MpPotion(ether);
      expect(potion.canUse(makeContext({ mp: 9, mpMax: 10 }).context)).toBe(
        true,
      );
      expect(potion.canUse(makeContext({ mp: 10, mpMax: 10 }).context)).toBe(
        false,
      );
    });
  });
});
