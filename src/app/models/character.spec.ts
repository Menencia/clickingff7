import { Character, CharacterData } from './character';
import { CharacterRef } from './refs/characters';
import { WeaponRef } from './refs/weapons';
import { Weapon } from './weapon';

function makeWeapon(hits = 10): Weapon {
  return new Weapon({
    ref: WeaponRef.BusterSword,
    type: 'broadsword',
    hits,
    price: 0,
    maxMaterias: 1,
    zoneAvailable: 1,
  });
}

function makeCharacter(data: Partial<CharacterData> = {}): Character {
  return new Character({
    ref: CharacterRef.Cloud,
    image: 'cloud',
    weaponType: 'broadsword',
    weapon: makeWeapon(),
    hp: 3,
    mp: 3,
    xp: 3,
    ...data,
  });
}

describe('Character', () => {
  describe('stats', () => {
    it('scales HP, MP and XP max linearly with level for neutral stats (3)', () => {
      const c = makeCharacter().setLevel(4);
      expect(c.getHpMax()).toBe(80);
      expect(c.getMpMax()).toBe(12);
      expect(c.getXpMax()).toBe(400);
    });

    it('applies +10% per stat point above 3 to HP and MP', () => {
      const c = makeCharacter({ hp: 5, mp: 5 }).setLevel(1);
      expect(c.getHpMax()).toBe(24);
      expect(c.getMpMax()).toBe(4); // ceil(3.6)
    });

    it('applies -10% per stat point below 3 to HP and MP', () => {
      const c = makeCharacter({ hp: 1, mp: 1 }).setLevel(1);
      expect(c.getHpMax()).toBe(16);
      expect(c.getMpMax()).toBe(3); // ceil(2.4)
    });

    it('inverts the XP stat: a higher stat requires less XP', () => {
      expect(makeCharacter({ xp: 5 }).getXpMax()).toBe(80);
      expect(makeCharacter({ xp: 1 }).getXpMax()).toBe(120);
    });

    it('computes hits from level and weapon', () => {
      const c = makeCharacter({ weapon: makeWeapon(20) }).setLevel(5);
      expect(c.getHits()).toBe(10);
    });
  });

  describe('setXp', () => {
    it('accumulates XP without leveling below the threshold', () => {
      const c = makeCharacter();
      c.setXp(99);
      expect(c.level).toBe(1);
      expect(c.xp).toBe(99);
    });

    it('levels up exactly at the threshold', () => {
      const c = makeCharacter();
      c.setXp(100);
      expect(c.level).toBe(2);
      expect(c.xp).toBe(0);
    });

    it('can gain several levels at once and keeps the remainder', () => {
      const c = makeCharacter();
      // 100 (lv1 -> 2) + 200 (lv2 -> 3) = 300, remainder 50
      c.setXp(350);
      expect(c.level).toBe(3);
      expect(c.xp).toBe(50);
    });

    it('ignores XP and resets it to 0 at level 100', () => {
      const c = makeCharacter().setLevel(100);
      c.xp = 10;
      c.setXp(500);
      expect(c.level).toBe(100);
      expect(c.xp).toBe(0);
    });

    it('never goes past level 100', () => {
      const c = makeCharacter().setLevel(99);
      c.setXp(100_000);
      expect(c.level).toBe(100);
    });
  });
});
