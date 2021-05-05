import { Character } from '../character';
import { CharacterRef } from '../refs/characters';

export class Aerith extends Character {

  ref = CharacterRef.Aerith;
  name = 'Aerith Gainsborough';
  image = '/assets/images/characters/aerith.jpg';
  weaponType = 'stave';
  hpBase = 1;
  mpBase = 5;
  xpBase = 2;
  notA = [4, 5];

}
