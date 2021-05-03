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
import { AeroCombatant } from '../enemies/zone4/aero-combatant';
import { Deenglow } from '../enemies/zone4/deenglow';
import { Eligor } from '../enemies/zone4/eligor';
import { GuardHound } from '../enemies/zone4/guard-hound';
import { Reno } from '../enemies/zone4/reno';
import { MightyGrunt } from '../enemies/zone5/mighty-grunt';
import { SampleH0512 } from '../enemies/zone5/sample-h0512';
import { Soldier3rd } from '../enemies/zone5/soldier3rd';
import { SwordDance } from '../enemies/zone5/sword-dance';
import { VargidPolice } from '../enemies/zone5/vargid-police';
import { Enemy } from '../enemy';

export enum EnemyRef {
  AeroCombatant = 'AeroCombatant',
  AirBuster = 'AirBuster',
  Aps = 'Aps',
  BloodTaste = 'BloodTaste',
  Deenglow = 'Deenglow',
  Eligor = 'Eligor',
  FirstRay = 'FirstRay',
  Grunt = 'Grunt',
  GuardHound = 'GuardHound',
  GuardScorpion = 'GuardScorpion',
  HedgehogPie = 'HedgehogPie',
  HellHouse = 'HellHouse',
  MightyGrunt = 'MightyGrunt',
  MP = 'MP',
  ProtoMachinegun = 'ProtoMachinegun',
  Reno = 'Reno',
  SampleH0512 = 'SampleH0512',
  Smogger = 'Smogger',
  Soldier3rd = 'Soldier3rd',
  SpecialCombatant = 'SpecialCombatant',
  Sweeper = 'Sweeper',
  SwordDance = 'SwordDance',
  VargidPolice = 'VargidPolice',
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
      case EnemyRef.AeroCombatant:
        enemy = new AeroCombatant(game);
        break;
      case EnemyRef.AirBuster:
        enemy = new AirBuster(game);
        break;
      case EnemyRef.Aps:
        enemy = new Aps(game);
        break;
      case EnemyRef.BloodTaste:
        enemy = new BloodTaste(game);
        break;
      case EnemyRef.Deenglow:
        enemy = new Deenglow(game);
        break;
      case EnemyRef.Eligor:
        enemy = new Eligor(game);
        break;
      case EnemyRef.FirstRay:
        enemy = new FirstRay(game);
        break;
      case EnemyRef.Grunt:
        enemy = new Grunt(game);
        break;
      case EnemyRef.GuardHound:
        enemy = new GuardHound(game);
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
      case EnemyRef.MightyGrunt:
        enemy = new MightyGrunt(game);
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
      case EnemyRef.Reno:
        enemy = new Reno(game);
        break;
      case EnemyRef.SampleH0512:
        enemy = new SampleH0512(game);
        break;
      case EnemyRef.SpecialCombatant:
        enemy = new SpecialCombatant(game);
        break;
      case EnemyRef.Soldier3rd:
        enemy = new Soldier3rd(game);
        break;
      case EnemyRef.Sweeper:
        enemy = new Sweeper(game);
        break;
      case EnemyRef.SwordDance:
        enemy = new SwordDance(game);
        break;
      case EnemyRef.VargidPolice:
        enemy = new VargidPolice(game);
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
