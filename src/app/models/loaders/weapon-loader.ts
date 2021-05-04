import { GameService } from 'src/app/game.service';
import { Weapon } from '../weapon';
import { BusterSword } from '../weapons/broadswords/buster-sword';
import { MythrilSaber } from '../weapons/broadswords/mythril-saber';
import { AssaultGun } from '../weapons/gun-arms/assault-gun';
import { CannonBall } from '../weapons/gun-arms/cannon-ball';
import { GatlingGun } from '../weapons/gun-arms/gatling-gun';
import { MythrilClip } from '../weapons/headdresses/mythril-clip';
import { LeatherGlove } from '../weapons/knuckles/leather-glove';
import { MetalKnuckle } from '../weapons/knuckles/metal-knuckle';
import { MythrilClaw } from '../weapons/knuckles/mythril-claw';
import { FullMetalStaff } from '../weapons/staves/full-metal-staff';
import { GuardStick } from '../weapons/staves/guard-stick';
import { MythrilRod } from '../weapons/staves/mythril-rod';

export enum WeaponRef {
  AssaultGun = 'AssaultGun',
  BusterSword = 'BusterSword',
  CannonBall = 'CannonBall',
  FullMetalStaff = 'FullMetalStaff',
  GatlingGun = 'GatlingGun',
  GuardStick = 'GuardStick',
  LeatherGlove = 'LeatherGlove',
  MetalKnuckle = 'MetalKnuckle',
  MythrilClaw = 'MythrilClaw',
  MythrilClip = 'MythrilClip',
  MythrilRod = 'MythrilRod',
  MythrilSaber = 'MythrilSaber',
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
      case WeaponRef.CannonBall:
        weapon = new CannonBall(game);
        break;
      case WeaponRef.FullMetalStaff:
        weapon = new FullMetalStaff(game);
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
      case WeaponRef.MythrilClaw:
        weapon = new MythrilClaw(game);
        break;
      case WeaponRef.MythrilClip:
        weapon = new MythrilClip(game);
        break;
      case WeaponRef.MythrilRod:
        weapon = new MythrilRod(game);
        break;
      case WeaponRef.MythrilSaber:
        weapon = new MythrilSaber(game);
        break;
      default:
        throw new Error('Weapon not found');
    }
    return weapon;
  }

}
