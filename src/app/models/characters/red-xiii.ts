import { Character } from '../character';
import { CharacterRef } from '../refs/characters';
import { MythrilClip } from '../weapons/headdresses/mythril-clip';

export class RedXIII extends Character {

  ref = CharacterRef.RedXIII;
  name = 'Red XIII';
  image = '/assets/images/characters/redxiii.jpg';
  weaponType = 'headdresse';
  weapon = new MythrilClip();
  hpBase = 2;
  mpBase = 4;
  xpBase = 4;
  notA = [];

}
