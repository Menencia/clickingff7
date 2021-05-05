import { Character } from '../character';
import { CharacterRef } from '../refs/characters';

export class Barret extends Character {

  ref = CharacterRef.Barret;
  name = 'Barret Wallace';
  image = '/assets/images/characters/barret.jpg';
  weaponType = 'gun-arm';
  hpBase = 5;
  mpBase = 1;
  xpBase = 2;
  notA = [3];

}
