import { signal } from '@angular/core';
import { ItDisplayHits } from '@shared/interfaces/it-display-hits';
import { Subject } from 'rxjs';
import { Skill } from './skill';

export abstract class Units {
  arrHits: number[] = [];

  hp = signal(0);

  // based on defense
  hpMax = 0;

  mp = signal(0);

  // based on spirit
  mpMax = 0;

  limit = signal(0);

  // based on strengh+magic
  limitMax = 0;

  level = signal(1);

  xp = signal(0);

  // used to physical attacks
  strengh = 0;

  // used by magic attacks
  magic = 0;

  // used to block physical power
  defense = 0;

  // used to block magic power
  spirit = 0;

  // evade, critial hits
  luck = 0;

  // plays more in battle
  speed = 0;

  attack = 0;

  attackFromEquipment = 0;

  defenseFromEquipment = 0;

  vitality = 0;

  luckFromEquipment = 0;

  speedFromEquipment = 0;

  critHitRate = 0;

  critHitDamage = 0;

  source = {
    hp: new Subject<ItDisplayHits>(), // health points
  };

  weakness: string[] = [];
  resistance: string[] = [];

  abstract addHp(hp: number, context: Skill): void;
  abstract getAttackRawEffects(): string[];
  abstract isAlive(): boolean;

  /**
   * Returns true if the enemy has this type in weakness
   */
  hasWeakness(types: string[]): boolean {
    return this.weakness.filter((x) => types.includes(x)).length > 0;
  }

  /**
   * Returns true if the enemy has this type in weakness
   */
  hasResistance(types: string[]): boolean {
    return this.resistance.filter((x) => types.includes(x)).length > 0;
  }
}
