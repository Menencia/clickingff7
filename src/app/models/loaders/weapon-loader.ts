import { GameService } from 'src/app/game.service';
import { Weapon } from '../weapon';
import { BusterSword } from '../weapons/broadswords/buster-sword';
import { AssaultGun } from '../weapons/gun-arms/assault-gun';
import { GatlingGun } from '../weapons/gun-arms/gatling-gun';
import { LeatherGlove } from '../weapons/knuckles/leather-glove';
import { MetalKnuckle } from '../weapons/knuckles/metal-knuckle';
import { GuardStick } from '../weapons/staves/guard-stick';
import { MythrilRod } from '../weapons/staves/mythril-rod';

export enum WeaponRef {
  AssaultGun = 'AssaultGun',
  BusterSword = 'BusterSword',
  GatlingGun = 'GatlingGun',
  GuardStick = 'GuardStick',
  LeatherGlove = 'LeatherGlove',
  MetalKnuckle = 'MetalKnuckle',
  MythrilRod = 'MythrilRod',
}

export class WeaponLoader {

  /**
   *
   */
  static build(ref: string, game: GameService): Weapon {
    let weapon;
    switch (ref) {
      case WeaponRef.AssaultGun:
        weapon = new AssaultGun(game);
        break;
      case WeaponRef.BusterSword:
        weapon = new BusterSword(game);
        break;
      case WeaponRef.GatlingGun:
        weapon = new GatlingGun(game);
        break;
      case WeaponRef.GuardStick:
        weapon = new GuardStick(game);
        break;
      case WeaponRef.LeatherGlove:
        weapon = new LeatherGlove(game);
        break;
      case WeaponRef.MetalKnuckle:
        weapon = new MetalKnuckle(game);
        break;
      case WeaponRef.MythrilRod:
        weapon = new MythrilRod(game);
        break;
      default:
        throw new Error('Weapon not found');
    }
    return weapon;
  }

}
