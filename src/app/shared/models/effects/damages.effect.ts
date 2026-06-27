import { ActionType } from '@shared/interfaces/action-type';
import { Effect } from '../effect';
import { Team } from '../team';
import { Units } from '../units';
import { Enemies } from '../units/enemies';

export interface DamagesEffectContext {
  type: ActionType;
  elements: string[];
}

export class DamagesEffect extends Effect {
  constructor(
    public source: Units,
    public target: Units,
    public context: DamagesEffectContext = {
      type: ActionType.PHYSIC,
      elements: [],
    },
  ) {
    super();
  }

  async execute(): Promise<void> {
    let hits = 3; // todo

    // weakness
    if (this.source.hasWeakness(this.context.elements)) {
      hits *= 3;
    }

    // resistance
    if (this.source.hasResistance(this.context.elements)) {
      hits = Math.floor(hits / 3);
    }

    this.target.hp.update((hp) => Math.max(hp - hits, 0));
    this.target.source.hp.next({
      hits,
      context: this,
    });

    if (this.target instanceof Team) {
      this.target.limit.update((limit) =>
        Math.min(limit + hits, this.target.limitMax),
      );
    }

    if (this.target instanceof Enemies) {
      this.target.stagger.update((stagger) =>
        Math.min((this.target as Enemies).staggerMax, stagger + hits * 2),
      );
    }

    return super.returnPromise();
  }
}
