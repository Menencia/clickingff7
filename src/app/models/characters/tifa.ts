import { Character } from '../character';
import { CharacterRef } from '../refs/characters';
import { LeatherGlove } from '../weapons/knuckles/leather-glove';

export class Tifa extends Character {
  ref = CharacterRef.Tifa;

  name = 'Tifa Lockhart';

  image = '/assets/images/characters/tifa.jpg';

  weaponType = 'knuckle';

  weapon = new LeatherGlove();

  hpBase = 2;

  mpBase = 2;

  xpBase = 3;

  notA = [3];
}
