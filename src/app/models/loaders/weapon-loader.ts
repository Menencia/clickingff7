import { WeaponRef } from '../refs/weapons';
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
import { FPtShuriken } from '../weapons/shurikens/fpt-shuriken';
import { FullMetalStaff } from '../weapons/staves/full-metal-staff';
import { GuardStick } from '../weapons/staves/guard-stick';
import { MythrilRod } from '../weapons/staves/mythril-rod';

export class WeaponLoader {
  /**
   *
   */
  static build(ref: WeaponRef): Weapon {
    let weapon;
    switch (ref) {
      case WeaponRef.AssaultGun:
        weapon = new AssaultGun();
        break;
      case WeaponRef.BusterSword:
        weapon = new BusterSword();
        break;
      case WeaponRef.CannonBall:
        weapon = new CannonBall();
        break;
      case WeaponRef.FPtShuriken:
        weapon = new FPtShuriken();
        break;
      case WeaponRef.FullMetalStaff:
        weapon = new FullMetalStaff();
        break;
      case WeaponRef.GatlingGun:
        weapon = new GatlingGun();
        break;
      case WeaponRef.GuardStick:
        weapon = new GuardStick();
        break;
      case WeaponRef.LeatherGlove:
        weapon = new LeatherGlove();
        break;
      case WeaponRef.MetalKnuckle:
        weapon = new MetalKnuckle();
        break;
      case WeaponRef.MythrilClaw:
        weapon = new MythrilClaw();
        break;
      case WeaponRef.MythrilClip:
        weapon = new MythrilClip();
        break;
      case WeaponRef.MythrilRod:
        weapon = new MythrilRod();
        break;
      case WeaponRef.MythrilSaber:
        weapon = new MythrilSaber();
        break;
      default:
        throw new Error('Weapon not found');
    }
    return weapon;
  }
}
