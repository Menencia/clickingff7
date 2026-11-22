import { computed, signal } from '@angular/core';
import { ItActionAttack } from '../../core/interfaces/it-action-attack';
import { ItDisplayHits } from '../../core/interfaces/it-display-hits';
import { Attack } from '../actions/attack';
import { Character } from '../character';
import { CharactersSave } from '../save';
import { Units } from '../units';

// maximum characters in the team
export const MAX_TEAM = 3;

export class Characters extends Units {
  protected readonly resistanceDivisor = 10;

  list: Character[] = [];

  selected!: Character;

  /** in-team characters, as of the last refresh() */
  readonly team = signal<Character[]>([]);

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
   *
   */
  addHp(value: number): void {
    this.hp.update((hp) => Math.min(hp + value, this.hpMax()));
    this.source.hp.next({ hits: value } as ItDisplayHits);
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
   * Select a character in menus
   */
  select(character: null | Character = null): void {
    this.selected = character || this.getTeam()[0];
  }

  /**
   * Team attack: a Limit (power 500) when the gauge is full, otherwise a normal
   * attack (power 100). Does not consume the gauge.
   */
  getAttackSkill(): ItActionAttack {
    const pwr = this.canLimit() ? 500 : 100;
    return new Attack(this.hits(), pwr);
  }

  /**
   * Characters are under attack
   */
  getAttacked(baseHits: number, context: ItActionAttack): void {
    const hits = this.applyAffinities(baseHits, context.type);

    this.hp.update((hp) => Math.max(hp - hits, 0));
    this.source.hp.next({ hits } as ItDisplayHits);

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
