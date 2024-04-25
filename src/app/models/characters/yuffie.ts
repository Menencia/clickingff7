import { Character } from '../character';
import { CharacterRef } from '../refs/characters';
import { FPtShuriken } from '../weapons/shurikens/fpt-shuriken';

export class Yuffie extends Character {
  ref = CharacterRef.Yuffie;
  name = 'Yuffie Kisaragi';
  image = '/assets/images/characters/yuffie.jpg';
  weaponType = 'shuriken';
  weapon = new FPtShuriken();
  hpBase = 1;
  mpBase = 4;
  xpBase = 4;
  notA = [];
}
