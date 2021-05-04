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
import { HeliGunner } from '../enemies/zone6/heli-gunner';
import { HundredGunner } from '../enemies/zone6/hundred-gunner';
import { MotorBall } from '../enemies/zone6/motor-ball';
import { Rufus } from '../enemies/zone6/rufus';
import { Zenene } from '../enemies/zone6/zenene';
import { Elfadunk } from '../enemies/zone7/elfadunk';
import { KalmFang } from '../enemies/zone7/kalm-fang';
import { Levrikon } from '../enemies/zone7/levrikon';
import { Mandragora } from '../enemies/zone7/mandragora';
import { MidgarZolom } from '../enemies/zone7/midgar-zolom';
import { ArkDragon } from '../enemies/zone8/ark-dragon';
import { Castanets } from '../enemies/zone8/castanets';
import { Crawler } from '../enemies/zone8/crawler';
import { Madouge } from '../enemies/zone8/madouge';
import { MysteryNinja } from '../enemies/zone8/mystery-ninja';
import { Enemy } from '../enemy';

export enum EnemyRef {
  AeroCombatant = 'AeroCombatant',
  AirBuster = 'AirBuster',
  Aps = 'Aps',
  ArkDragon = 'ArkDragon',
  BloodTaste = 'BloodTaste',
  Castanets = 'Castanets',
  Crawler = 'Crawler',
  Deenglow = 'Deenglow',
  Eligor = 'Eligor',
  Elfadunk = 'Elfadunk',
  FirstRay = 'FirstRay',
  Grunt = 'Grunt',
  GuardHound = 'GuardHound',
  GuardScorpion = 'GuardScorpion',
  HedgehogPie = 'HedgehogPie',
  HeliGunner = 'HeliGunner',
  HellHouse = 'HellHouse',
  HundredGunner = 'HundredGunner',
  KalmFang = 'KalmFang',
  Levrikon = 'Levrikon',
  Madouge = 'Madouge',
  Mandragora = 'Mandragora',
  MidgarZolom = 'MidgarZolom',
  MightyGrunt = 'MightyGrunt',
  MotorBall = 'MotorBall',
  MP = 'MP',
  MysteryNinja = 'MysteryNinja',
  ProtoMachinegun = 'ProtoMachinegun',
  Reno = 'Reno',
  Rufus = 'Rufus',
  SampleH0512 = 'SampleH0512',
  Smogger = 'Smogger',
  Soldier3rd = 'Soldier3rd',
  SpecialCombatant = 'SpecialCombatant',
  Sweeper = 'Sweeper',
  SwordDance = 'SwordDance',
  VargidPolice = 'VargidPolice',
  Vice = 'Vice',
  WholeEater = 'WholeEater',
  Zenene = 'Zenene',
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
      case EnemyRef.ArkDragon:
        enemy = new ArkDragon(game);
        break;
      case EnemyRef.BloodTaste:
        enemy = new BloodTaste(game);
        break;
      case EnemyRef.Castanets:
        enemy = new Castanets(game);
        break;
      case EnemyRef.Crawler:
        enemy = new Crawler(game);
        break;
      case EnemyRef.Deenglow:
        enemy = new Deenglow(game);
        break;
      case EnemyRef.Eligor:
        enemy = new Eligor(game);
        break;
      case EnemyRef.Elfadunk:
        enemy = new Elfadunk(game);
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
      case EnemyRef.HeliGunner:
        enemy = new HeliGunner(game);
        break;
      case EnemyRef.HellHouse:
        enemy = new HellHouse(game);
        break;
      case EnemyRef.HundredGunner:
        enemy = new HundredGunner(game);
        break;
      case EnemyRef.KalmFang:
        enemy = new KalmFang(game);
        break;
      case EnemyRef.Levrikon:
        enemy = new Levrikon(game);
        break;
      case EnemyRef.Madouge:
        enemy = new Madouge(game);
        break;
      case EnemyRef.Mandragora:
        enemy = new Mandragora(game);
        break;
      case EnemyRef.MidgarZolom:
        enemy = new MidgarZolom(game);
        break;
      case EnemyRef.MightyGrunt:
        enemy = new MightyGrunt(game);
        break;
      case EnemyRef.MotorBall:
        enemy = new MotorBall(game);
        break;
      case EnemyRef.MP:
        enemy = new Mp(game);
        break;
      case EnemyRef.MysteryNinja:
        enemy = new MysteryNinja(game);
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
      case EnemyRef.Rufus:
        enemy = new Rufus(game);
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
      case EnemyRef.Zenene:
        enemy = new Zenene(game);
        break;
      default:
        throw new Error('Enemy not found');
    }
    return enemy;
  }

}
