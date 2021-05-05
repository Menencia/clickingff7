import { Character } from '../character';
import { CharacterRef } from '../refs/characters';

export class Cloud extends Character {

  ref = CharacterRef.Cloud;
  name = 'Cloud Strife';
  image = '/assets/images/characters/cloud.jpg';
  weaponType = 'broadsword';
  hpBase = 3;
  mpBase = 3;
  xpBase = 3;
  notA = [];

}
