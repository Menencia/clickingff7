import { GameService } from 'src/app/game.service';
import { Weapon } from '../weapon';
import { BusterSword } from '../weapons/broadswords/buster-sword';
import { GatlingGun } from '../weapons/gun-arms/gatling-gun';

export enum WeaponRef {
  BusterSword = 'BusterSword',
  GatlingGun = 'GatlingGun',
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
      default:
        throw new Error('Weapon not found');
    }
    return weapon;
  }

}
