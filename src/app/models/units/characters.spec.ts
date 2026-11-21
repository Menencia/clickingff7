import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { Attack } from '../actions/attack';
import { Character } from '../character';
import { CharacterRef } from '../refs/characters';
import { WeaponRef } from '../refs/weapons';
import { Weapon } from '../weapon';
import { Characters, MAX_TEAM } from './characters';

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

// a team of one level-10 character whose total hits are {hits}
function teamWithHits(hits: number): Characters {
  const team = new Characters();
  team.add(makeCharacter(10, hits), true);
  team.refresh();
  return team;
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
      expect(characters.hpMax()).toBe(40 + 80);
      expect(characters.mpMax()).toBe(6 + 12);
      expect(characters.hits()).toBe(2 + 8);
      expect(characters.levelMax()).toBe(4);
      expect(characters.levelSum()).toBe(6);
      expect(characters.limitMax()).toBe(80);
    });

    it('ignores unavailable characters', () => {
      characters.list[1].isNotAvailable = true;
      characters.refresh();
      expect(characters.hpMax()).toBe(40);
      expect(characters.levelMax()).toBe(2);
    });

    it('caps current HP, MP and limit to their new max', () => {
      characters.hp.set(1000);
      characters.mp.set(1000);
      characters.limit.set(1000);
      characters.refresh();
      expect(characters.hp()).toBe(120);
      expect(characters.mp()).toBe(18);
      expect(characters.limit()).toBe(80);
    });

    it('does not raise current HP, MP and limit', () => {
      characters.hp.set(10);
      characters.mp.set(2);
      characters.limit.set(5);
      characters.refresh();
      expect(characters.hp()).toBe(10);
      expect(characters.mp()).toBe(2);
      expect(characters.limit()).toBe(5);
    });

    it('keeps team stats until the next refresh, then follows level ups', () => {
      const [first] = characters.list;
      first.setLevel(6);
      expect(characters.hpMax()).toBe(40 + 80);
      expect(characters.team().length).toBe(2);

      characters.refresh();
      expect(characters.hpMax()).toBe(120 + 80);
      expect(characters.levelMax()).toBe(6);
      expect(characters.limitMax()).toBe(((120 + 80) * 2) / 3);
    });

    it('publishes a new team on each refresh', () => {
      const before = characters.team();
      characters.refresh();
      expect(characters.team()).not.toBe(before);
      expect(characters.team()).toEqual(before);
    });

    it('has empty stats before the first refresh', () => {
      const empty = new Characters();
      empty.add(makeCharacter(2), true);
      expect(empty.hpMax()).toBe(0);
      expect(empty.levelMax()).toBe(0);
    });
  });

  describe('join / leave', () => {
    it('a backup character joins the team and the stats are recomputed', () => {
      const backup = characters.getBackup()[0];
      expect(characters.canJoin()).toBe(true);

      characters.join(backup);

      expect(backup.inTeam).toBe(true);
      expect(characters.team()).toContain(backup);
      expect(characters.hpMax()).toBe(40 + 80 + backup.getHpMax());
    });

    it(`cannot join a team of ${MAX_TEAM}`, () => {
      characters.join(characters.getBackup()[0]);
      const extra = makeCharacter(1);
      characters.add(extra, false);

      expect(characters.canJoin()).toBe(false);
      characters.join(extra);

      expect(extra.inTeam).toBe(false);
      expect(characters.team()).toHaveLength(MAX_TEAM);
    });

    it('an unavailable character cannot join', () => {
      const backup = characters.getBackup()[0];
      backup.isNotAvailable = true;

      characters.join(backup);

      expect(backup.inTeam).toBe(false);
    });

    it('a character leaves the team, clamping HP and MP', () => {
      characters.hp.set(characters.hpMax());
      characters.mp.set(characters.mpMax());
      const [first, second] = characters.getTeam();

      characters.leave(second);

      expect(second.inTeam).toBe(false);
      expect(characters.team()).toEqual([first]);
      expect(characters.hp()).toBe(40);
      expect(characters.mp()).toBe(6);
    });

    it('the last character cannot leave the team', () => {
      const [first, second] = characters.getTeam();
      characters.leave(second);

      expect(characters.canLeave()).toBe(false);
      characters.leave(first);

      expect(first.inTeam).toBe(true);
      expect(characters.team()).toEqual([first]);
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
      expect(characters.limit()).toBe(30);
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
      expect(characters.limit()).toBe(80);
      expect(characters.canLimit()).toBe(true);
    });
  });

  describe('isAlive', () => {
    it('resets the limit gauge when the team is dead', () => {
      characters.limit.set(50);
      characters.hp.set(0);
      expect(characters.isAlive()).toBe(false);
      expect(characters.limit()).toBe(0);
    });

    it('returns true while HP is above 0', () => {
      characters.hp.set(1);
      expect(characters.isAlive()).toBe(true);
    });
  });

  describe('getAttackSkill', () => {
    it('returns a normal attack (power 100) when the limit is not full', () => {
      characters.limit.set(10);
      const attack = characters.getAttackSkill() as Attack;
      expect(attack.baseHits).toBe(10);
      expect(attack.pwr).toBe(100);
      expect(characters.limit()).toBe(10);
    });

    it('returns a limit (power 500) and empties the gauge when full', () => {
      characters.limit.set(characters.limitMax());
      const attack = characters.getAttackSkill() as Attack;
      expect(attack.pwr).toBe(500);
      expect(characters.limit()).toBe(0);
    });

    it('deals 5 times the damage of a normal attack with a limit', () => {
      // random(a, b) = floor(0.5 * (b - a + 1) + a): middle of the range,
      // and random(0, 100) = 50, so no critical hit.
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      characters = teamWithHits(100);

      const normal = characters.getAttackSkill() as Attack;
      characters.limit.set(characters.limitMax());
      const limit = characters.getAttackSkill() as Attack;

      expect(normal.calculateHits()).toBe(100);
      expect(limit.calculateHits()).toBe(500);
    });

    it('doubles damage on a critical hit', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.5) // damage roll
        .mockReturnValueOnce(0); // critical roll: random(0, 100) = 0 <= 10
      characters = teamWithHits(100);

      const attack = characters.getAttackSkill() as Attack;
      expect(attack.calculateHits()).toBe(200);
      expect(attack.critical).toBe(true);
    });

    it('stays within ±10% of the base damage', () => {
      characters = teamWithHits(100);
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
