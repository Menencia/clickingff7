import * as uuid from 'uuid';
import { BattleService } from './battle.service';

export class Unit {

  id: string;
  name: string;
  image: string;
  lvl: number;

  // normal, rare, elite, legendary, mythic
  rarity: number;

  // ice/water, fire/earth, wind, thunder
  element: number;

  // force, agility, intelligence
  type: number;

  // main attributes
  hp: number;
  att: number;
  def: number;

  // secondary attributes
  cc: number;
  prec: number;
  eva: number;
  speed: number;
  regen: number;
  magicRes: number;
  physicRes: number;
  lifeSteal: number;

  constructor() {
    this.id = uuid.v4();
    this.lvl = 1;
    this.cc = 0.05;
    this.prec = 50;
    this.eva = 50;
    this.speed = 0.5;
    this.regen = 0;
    this.magicRes = 0;
    this.physicRes = 0;
    this.lifeSteal = 0;
  }

  action(bs: BattleService): void {}
}
