import { Unit } from '../unit';
import { BattleService } from '../battle.service';

export class Cloud extends Unit {

  constructor() {
    super();

    this.name = 'Cloud';
    this.image = '/assets/units/cloud.jpg';
    this.rarity = 2; // Rare
    this.element = 3; // Thunder
    this.type = 1;

    this.hp = 1100;
    this.att = 800;
    this.def = 700;
  }

  action(bs: BattleService) {
    // select first enemy
    const enemy = bs.enemies[0];
    // remove static 5 damages
    enemy.hp -= 100;
  }

}
