import { GameService } from 'src/app/game.service';
import { FirstRay } from '../enemies/zone1/first-ray';
import { Grunt } from '../enemies/zone1/grunt';
import { GuardScorpion } from '../enemies/zone1/guard-scorpion';
import { Mp } from '../enemies/zone1/mp';
import { Sweeper } from '../enemies/zone1/sweeper';
import { AirBuster } from '../enemies/zone2/air-buster';
import { BloodTaste } from '../enemies/zone2/blood-taste';
import { ProtoMachinegun } from '../enemies/zone2/proto-machinegun';
import { Smogger } from '../enemies/zone2/smogger';
import { SpecialCombatant } from '../enemies/zone2/special-combatant';
import { Aps } from '../enemies/zone3/aps';
import { HedgehogPie } from '../enemies/zone3/hedgehog-pie';
import { HellHouse } from '../enemies/zone3/hell-house';
import { Vice } from '../enemies/zone3/vice';
import { WholeEater } from '../enemies/zone3/whole-eater';
import { Enemy } from '../enemy';

export enum EnemyRef {
  AirBuster = 'AirBuster',
  Aps = 'Aps',
  BloodTaste = 'BloodTaste',
  FirstRay = 'FirstRay',
  Grunt = 'Grunt',
  GuardScorpion = 'GuardScorpion',
  HedgehogPie = 'HedgehogPie',
  HellHouse = 'HellHouse',
  MP = 'MP',
  ProtoMachinegun = 'ProtoMachinegun',
  Smogger = 'Smogger',
  SpecialCombatant = 'SpecialCombatant',
  Sweeper = 'Sweeper',
  Vice = 'Vice',
  WholeEater = 'WholeEater',
}

export class EnemyLoader {

  /**
   *
   */
  static build(ref: string, game: GameService): Enemy {
    let enemy;
    switch (ref) {
      case EnemyRef.AirBuster:
        enemy = new AirBuster(game);
        break;
      case EnemyRef.Aps:
        enemy = new Aps(game);
        break;
      case EnemyRef.BloodTaste:
        enemy = new BloodTaste(game);
        break;
      case EnemyRef.FirstRay:
        enemy = new FirstRay(game);
        break;
      case EnemyRef.Grunt:
        enemy = new Grunt(game);
        break;
      case EnemyRef.GuardScorpion:
        enemy = new GuardScorpion(game);
        break;
      case EnemyRef.HedgehogPie:
        enemy = new HedgehogPie(game);
        break;
      case EnemyRef.HellHouse:
        enemy = new HellHouse(game);
        break;
      case EnemyRef.MP:
        enemy = new Mp(game);
        break;
      case EnemyRef.ProtoMachinegun:
        enemy = new ProtoMachinegun(game);
        break;
      case EnemyRef.Smogger:
        enemy = new Smogger(game);
        break;
      case EnemyRef.SpecialCombatant:
        enemy = new SpecialCombatant(game);
        break;
      case EnemyRef.Sweeper:
        enemy = new Sweeper(game);
        break;
      case EnemyRef.Vice:
        enemy = new Vice(game);
        break;
      case EnemyRef.WholeEater:
        enemy = new WholeEater(game);
        break;
      default:
        throw new Error('Enemy not found');
    }
    return enemy;
  }

}
