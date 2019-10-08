export class Unit {

  name: string;
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
}
