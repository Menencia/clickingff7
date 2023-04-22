import { Enemy } from '../../enemy';

export class ArkDragon extends Enemy {

  name = 'Ark Dragon';
  image = '/assets/images/enemies/zone8/ark-dragon.png';
  baseHpMax = 4;
  baseHits = 4;
  baseXp = 3;
  baseAp = 3;
  baseGils = 1;
  override weakness = ['fire'];
  override resistance = ['earth'];

}
