import { Battle } from './battle';
import { ItemRef } from './refs/items';
import { ItemSave } from './save';
import { Team } from './team';

export const MAX_ITEMS = 2;

export interface ItemJson {
  ref: ItemRef;
  effect: string;
  price: number;
  zoneAvailable: number;
}

export class Item {
  constructor(
    public readonly data: Readonly<ItemJson>,
    public nbr = 1,
    public equipped = false,
  ) {}

  available(zoneLlevelMax: number): boolean {
    return zoneLlevelMax >= this.data.zoneAvailable;
  }

  canUse(team: Team): boolean {
    const effects = this.data.effect.split(';').map((effect) => effect.trim());
    const lastEffect = effects.at(-1) ?? '';
    if (lastEffect.startsWith('heal')) {
      return team.hp() < team.hpMax;
    }
    if (lastEffect.startsWith('increaseMp')) {
      return team.mp() < team.mpMax;
    }
    throw new Error(`Skill unknown: ${this.data.effect}`);
  }

  async use(_battle: Battle) {
    // const effects = convertEffects(this.data.effect.split(';'));
    // await executeSkill(battle, effects);
    // battle.nextTurn();
  }

  /**
   * Returns the price of the item
   */
  getPrice(): number {
    return this.data.price;
  }

  /**
   * Returns the sell price of the item
   */
  getSellPrice(): number {
    return this.data.price / 2;
  }

  /**
   * Returns the number of owned
   */
  inStock(items: Item[]): number {
    let sum = 0;
    items.forEach((i) => {
      if (i.data.ref === this.data.ref) {
        sum += i.nbr;
      }
    });
    return sum;
  }

  /**
   * Save materia data
   */
  export(): ItemSave {
    const { nbr, equipped } = this;
    return { ref: this.data.ref, nbr, equipped };
  }
}
