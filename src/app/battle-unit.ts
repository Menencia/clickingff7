import { BattleService } from './battle.service';
import { Unit } from './unit';

export class BattleUnit {

  // current hp
  hp: number;

  constructor(public unit: Unit, public bs: BattleService) {
    this.hp = this.unit.hp;
  }

  action() {
    this.unit.action(this.bs);
  }
}
