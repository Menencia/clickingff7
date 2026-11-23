import { computed, signal } from '@angular/core';
import { ItActionAttack } from '../actions/action';
import { Attack } from '../actions/attack';
import { Character } from '../character';
import { CharactersSave } from '../save';
import { Units } from '../units';
import { Weapon } from '../weapon';

// maximum characters in the team
export const MAX_TEAM = 3;

/** Power of a normal attack of the team */
export const ATTACK_POWER = 100;

/** Power of the team Limit */
export const LIMIT_POWER = 500;

export class Characters extends Units {
  protected readonly resistanceDivisor = 10;

  list: Character[] = [];

  /** in-team characters, as of the last refresh() */
  readonly team = signal<Character[]>([]);

  /** character last picked in the menus, see select() */
  private readonly picked = signal<Character | undefined>(undefined);

  /**
   * Character shown in the menus: the picked one while it is in the team,
   * otherwise the first team member (undefined if the team is empty)
   */
  readonly selected = computed(() => {
    const team = this.team();
    const picked = this.picked();
    return picked && team.includes(picked) ? picked : team[0];
  });

  readonly hpMax = computed(() =>
    this.team().reduce((sum, c) => sum + c.getHpMax(), 0),
  );

  readonly mpMax = computed(() =>
    this.team().reduce((sum, c) => sum + c.getMpMax(), 0),
  );

  readonly limitMax = computed(() => (2 * this.hpMax()) / 3);

  readonly hits = computed(() =>
    this.team().reduce((sum, c) => sum + c.getHits(), 0),
  );

  readonly levelMax = computed(() =>
    this.team().reduce((max, c) => Math.max(max, c.level), 0),
  );

  readonly levelSum = computed(() =>
    this.team().reduce((sum, c) => sum + c.level, 0),
  );

  /** available characters out of the team, as of the last refresh() */
  readonly backup = computed(() => {
    const team = this.team();
    return this.list.filter((c) => !c.isNotAvailable && !team.includes(c));
  });

  /** materia slots: sum of the team's weapon slots */
  readonly maxMaterias = computed(() =>
    this.team().reduce((sum, c) => sum + (c.weapon?.maxMaterias ?? 0), 0),
  );

  readonly mp = signal(0);

  readonly limit = signal(0);

  /**
   * Empties the collection in place and resets the team gauges, for a new
   * game. The team stays empty until the next refresh().
   */
  clear(): void {
    this.list.length = 0;
    this.team.set([]);
    this.picked.set(undefined);
    this.hp.set(0);
    this.mp.set(0);
    this.limit.set(0);
  }

  /**
   *
   */
  addHp(value: number): void {
    this.hp.update((hp) => Math.min(hp + value, this.hpMax()));
    this.hitEvents.next({ hits: value, heal: true });
  }

  /**
   *
   */
  addMp(value: number): void {
    this.mp.update((mp) => Math.min(mp + value, this.mpMax()));
  }

  /**
   * Add a character
   */
  add(character: Character, inTeam: boolean): void {
    character.inTeam = inTeam;
    this.list.push(character);
  }

  /**
   * Returns the in-team characters
   */
  getTeam(): Character[] {
    return this.list.filter((e) => e.inTeam && !e.isNotAvailable);
  }

  /**
   * Returns true if the team has room for another character
   */
  canJoin(): boolean {
    return this.getTeam().length < MAX_TEAM;
  }

  /**
   * A backup character joins the team. Does nothing if the team is full or
   * the character is unavailable.
   */
  join(character: Character): void {
    if (character.inTeam || character.isNotAvailable || !this.canJoin()) {
      return;
    }
    character.inTeam = true;
    this.refresh();
  }

  /**
   * Returns true if a character can leave the team (at least one stays)
   */
  canLeave(): boolean {
    return this.getTeam().length > 1;
  }

  /**
   * A character leaves the team. Does nothing if it is the last one.
   */
  leave(character: Character): void {
    if (!character.inTeam || !this.canLeave()) {
      return;
    }
    character.inTeam = false;
    this.refresh();
  }

  /*
   * Refresh characters stats: recomputes the team and clamps HP, MP and limit
   */
  refresh(): void {
    this.team.set(this.getTeam());

    this.hp.update((hp) => Math.min(hp, this.hpMax()));
    this.mp.update((mp) => Math.min(mp, this.mpMax()));
    this.limit.update((limit) => Math.min(limit, this.limitMax()));
  }

  /**
   * Remove characters from the team if not available
   */
  available(zonelevelMax: number): void {
    this.list.forEach((c) => {
      if (c.notAvailable(zonelevelMax)) {
        c.isNotAvailable = true;
        c.inTeam = false;
      } else {
        c.isNotAvailable = false;
      }
    });
  }

  /**
   * Picks a character in the menus (see selected)
   */
  select(character: Character): void {
    this.picked.set(character);
  }

  /**
   * Normal attack of the team (power 100), whatever the Limit gauge
   */
  getAttackSkill(): ItActionAttack {
    return new Attack(this.hits(), ATTACK_POWER);
  }

  /**
   * Limit of the team: an attack 5 times stronger, usable when the gauge is
   * full. It doesn't empty the gauge: the caller does.
   */
  getLimitSkill(): ItActionAttack {
    return new Attack(this.hits(), LIMIT_POWER);
  }

  /**
   * Characters are under attack
   */
  getAttacked(baseHits: number, context: ItActionAttack): void {
    const hits = this.applyAffinities(baseHits, context.elements);

    this.hp.update((hp) => Math.max(hp - hits, 0));
    this.hitEvents.next({ hits });

    this.limit.update((limit) => Math.min(limit + hits, this.limitMax()));
  }

  isAlive(): boolean {
    return this.hp() > 0;
  }

  /**
   * Returns if it is possible to execute a limit (powerful attack)
   */
  canLimit(): boolean {
    return this.limit() === this.limitMax();
  }

  /**
   * Points each character to the owned weapon of the same ref, so that
   * equipping and selling act on the player's stock.
   */
  linkWeapons(owned: Weapon[]): void {
    this.list.forEach((c) => {
      const weapon = owned.find((w) => w.ref === c.weapon.ref);
      if (weapon) {
        c.setWeapon(weapon);
      }
    });
  }

  /**
   * Returns data for export
   */
  export(): CharactersSave {
    const res: CharactersSave = {
      hp: this.hp(),
      mp: this.mp(),
      limit: this.limit(),
      list: [],
    };

    res.list = [];
    this.list.forEach((c) => {
      res.list.push(c.export());
    });

    return res;
  }
}
