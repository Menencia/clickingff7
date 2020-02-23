import { Unit } from 'src/app/unit';

export class FirstRay extends Unit {

  constructor() {
    super();

    this.name = '1st Ray';
    this.image = '/assets/units/first-ray.png';
    this.rarity = 1; // Rare
    this.element = 3; // Thunder
    this.type = 1;

    this.hp = 300;
    this.att = 110;
    this.def = 70;
  }

}
