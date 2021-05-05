import { Character } from '../character';
import { CharacterRef } from '../refs/characters';

export class Tifa extends Character {

  ref = CharacterRef.Tifa;
  name = 'Tifa Lockhart';
  image = '/assets/images/characters/tifa.jpg';
  weaponType = 'knuckle';
  hpBase = 2;
  mpBase = 2;
  xpBase = 3;
  notA = [3];

}
