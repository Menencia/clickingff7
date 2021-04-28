import { GameService } from 'src/app/game.service';
import { Weapon } from '../weapon';
import { BusterSword } from '../weapons/broadswords/buster-sword';
import { GatlingGun } from '../weapons/gun-arms/gatling-gun';
import { LeatherGlove } from '../weapons/knuckles/leather-glove';

export enum WeaponRef {
  BusterSword = 'BusterSword',
  GatlingGun = 'GatlingGun',
  LeatherGlove = 'LeatherGlove'
}

export class WeaponLoader {

  /**
   *
   */
  static build(ref: string, game: GameService): Weapon {
    let weapon;
    switch (ref) {
      case WeaponRef.BusterSword:
        weapon = new BusterSword(game);
        break;
      case WeaponRef.GatlingGun:
        weapon = new GatlingGun(game);
        break;
      case WeaponRef.LeatherGlove:
        weapon = new LeatherGlove(game);
        break;
      default:
        throw new Error('Weapon not found');
    }
    return weapon;
  }

}
