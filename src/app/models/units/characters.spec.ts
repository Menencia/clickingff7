import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { Attack } from '../actions/attack';
import { Character } from '../character';
import { CharacterRef } from '../refs/characters';
import { WeaponRef } from '../refs/weapons';
import { Weapon } from '../weapon';
import { Characters } from './characters';

function makeCharacter(level: number, weaponHits = 10): Character {
  const weapon = new Weapon({
    ref: WeaponRef.BusterSword,
    type: 'broadsword',
    hits: weaponHits,
    price: 0,
    maxMaterias: 1,
    zoneAvailable: 1,
  });
  return new Character({
    ref: CharacterRef.Cloud,
    image: 'cloud',
    weaponType: 'broadsword',
    weapon,
    hp: 3,
    mp: 3,
    xp: 3,
  }).setLevel(level);
}

function attackOf(type: string[]): ItActionAttack {
  return { type, use: () => {} };
}

describe('Characters', () => {
  let characters: Characters;

  beforeEach(() => {
    characters = new Characters();
    characters.add(makeCharacter(2, 10), true);
    characters.add(makeCharacter(4, 20), true);
    characters.add(makeCharacter(50, 100), false); // backup, ignored
    characters.refresh();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('refresh', () => {
    it('sums team stats and ignores backup characters', () => {
      expect(characters.hpMax).toBe(40 + 80);
      expect(characters.mpMax).toBe(6 + 12);
      expect(characters.hits).toBe(2 + 8);
      expect(characters.levelMax).toBe(4);
      expect(characters.levelSum).toBe(6);
      expect(characters.limitMax).toBe(80);
    });

    it('ignores unavailable characters', () => {
      characters.list[1].isNotAvailable = true;
      characters.refresh();
      expect(characters.hpMax).toBe(40);
      expect(characters.levelMax).toBe(2);
    });

    it('caps current HP, MP and limit to their new max', () => {
      characters.hp.set(1000);
      characters.mp = 1000;
      characters.limit = 1000;
      characters.refresh();
      expect(characters.hp()).toBe(120);
      expect(characters.mp).toBe(18);
      expect(characters.limit).toBe(80);
    });

    it('does not raise current HP, MP and limit', () => {
      characters.hp.set(10);
      characters.mp = 2;
      characters.limit = 5;
      characters.refresh();
      expect(characters.hp()).toBe(10);
      expect(characters.mp).toBe(2);
      expect(characters.limit).toBe(5);
    });
  });

  describe('getAttacked', () => {
    beforeEach(() => {
      characters.hp.set(120);
    });

    it('removes HP, fills the limit gauge and emits the hits', () => {
      const emitted: ItDisplayHits[] = [];
      characters.source.hp.subscribe((h) => emitted.push(h));

      characters.getAttacked(30, attackOf([]));

      expect(characters.hp()).toBe(90);
      expect(characters.limit).toBe(30);
      expect(emitted).toEqual([{ hits: 30 }]);
    });

    it('triples damage on weakness', () => {
      characters.weakness = ['fire'];
      characters.getAttacked(10, attackOf(['fire']));
      expect(characters.hp()).toBe(90);
    });

    it('divides damage by 10 (rounded down) on resistance', () => {
      characters.resistance = ['fire'];
      characters.getAttacked(25, attackOf(['fire']));
      expect(characters.hp()).toBe(118);
    });

    it('applies weakness then resistance when both match', () => {
      characters.weakness = ['fire'];
      characters.resistance = ['fire'];
      characters.getAttacked(25, attackOf(['fire'])); // 75 -> 7
      expect(characters.hp()).toBe(113);
    });

    it('does not go below 0 HP', () => {
      characters.getAttacked(500, attackOf([]));
      expect(characters.hp()).toBe(0);
      expect(characters.isAlive()).toBe(false);
    });

    it('caps the limit gauge to its max', () => {
      characters.getAttacked(100, attackOf([]));
      expect(characters.limit).toBe(80);
      expect(characters.canLimit()).toBe(true);
    });
  });

  describe('isAlive', () => {
    it('resets the limit gauge when the team is dead', () => {
      characters.limit = 50;
      characters.hp.set(0);
      expect(characters.isAlive()).toBe(false);
      expect(characters.limit).toBe(0);
    });

    it('returns true while HP is above 0', () => {
      characters.hp.set(1);
      expect(characters.isAlive()).toBe(true);
    });
  });

  describe('getAttackSkill', () => {
    it('returns a normal attack (power 100) when the limit is not full', () => {
      characters.limit = 10;
      const attack = characters.getAttackSkill() as Attack;
      expect(attack.baseHits).toBe(10);
      expect(attack.pwr).toBe(100);
      expect(characters.limit).toBe(10);
    });

    it('returns a limit (power 500) and empties the gauge when full', () => {
      characters.limit = characters.limitMax;
      const attack = characters.getAttackSkill() as Attack;
      expect(attack.pwr).toBe(500);
      expect(characters.limit).toBe(0);
    });

    it('deals 5 times the damage of a normal attack with a limit', () => {
      // random(a, b) = floor(0.5 * (b - a + 1) + a): middle of the range,
      // and random(0, 100) = 50, so no critical hit.
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      characters.hits = 100;

      const normal = characters.getAttackSkill() as Attack;
      characters.limit = characters.limitMax;
      const limit = characters.getAttackSkill() as Attack;

      expect(normal.calculateHits()).toBe(100);
      expect(limit.calculateHits()).toBe(500);
    });

    it('doubles damage on a critical hit', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.5) // damage roll
        .mockReturnValueOnce(0); // critical roll: random(0, 100) = 0 <= 10
      characters.hits = 100;

      const attack = characters.getAttackSkill() as Attack;
      expect(attack.calculateHits()).toBe(200);
      expect(attack.critical).toBe(true);
    });

    it('stays within ±10% of the base damage', () => {
      characters.hits = 100;
      const attack = characters.getAttackSkill() as Attack;

      vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.99);
      expect(attack.calculateHits()).toBe(90);

      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.9999)
        .mockReturnValueOnce(0.99);
      expect(attack.calculateHits()).toBe(110);
    });
  });
});
