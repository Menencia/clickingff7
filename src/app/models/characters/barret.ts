import { Character } from '../character';
import { CharacterRef } from '../refs/characters';
import { GatlingGun } from '../weapons/gun-arms/gatling-gun';

export class Barret extends Character {
  ref = CharacterRef.Barret;
  name = 'Barret Wallace';
  image = '/assets/images/characters/barret.jpg';
  weaponType = 'gun-arm';
  weapon = new GatlingGun();
  hpBase = 5;
  mpBase = 1;
  xpBase = 2;
  notA = [3];
}
