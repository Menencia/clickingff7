import { Character } from '../character';
import { CharacterRef } from '../refs/characters';
import { GuardStick } from '../weapons/staves/guard-stick';

export class Aerith extends Character {

  ref = CharacterRef.Aerith;
  name = 'Aerith Gainsborough';
  image = '/assets/images/characters/aerith.jpg';
  weaponType = 'stave';
  weapon = new GuardStick();
  hpBase = 1;
  mpBase = 5;
  xpBase = 2;
  notA = [4, 5];

}
