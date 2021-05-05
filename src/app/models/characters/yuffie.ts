import { Character } from '../character';
import { CharacterRef } from '../refs/characters';

export class Yuffie extends Character {

  ref = CharacterRef.Yuffie;
  name = 'Yuffie Kisaragi';
  image = '/assets/images/characters/yuffie.jpg';
  weaponType = 'shuriken';
  hpBase = 1;
  mpBase = 4;
  xpBase = 4;
  notA = [];

}
