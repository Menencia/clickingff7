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
import { Bottomswell } from '../enemies/zone9/bottomswell';
import { Capparwire } from '../enemies/zone9/capparwire';
import { Formula } from '../enemies/zone9/formula';
import { HellRider } from '../enemies/zone9/hell-rider';
import { Zemzelett } from '../enemies/zone9/zemzelett';
import { Enemy } from '../enemy';
import { EnemyRef } from '../refs/enemy';

export class EnemyLoader {
  /**
   *
   */
  static build(ref: string): Enemy {
    let enemy;
    switch (ref) {
      case EnemyRef.AeroCombatant:
        enemy = new AeroCombatant();
        break;
      case EnemyRef.AirBuster:
        enemy = new AirBuster();
        break;
      case EnemyRef.Aps:
        enemy = new Aps();
        break;
      case EnemyRef.ArkDragon:
        enemy = new ArkDragon();
        break;
      case EnemyRef.BloodTaste:
        enemy = new BloodTaste();
        break;
      case EnemyRef.Bottomswell:
        enemy = new Bottomswell();
        break;
      case EnemyRef.Capparwire:
        enemy = new Capparwire();
        break;
      case EnemyRef.Castanets:
        enemy = new Castanets();
        break;
      case EnemyRef.Crawler:
        enemy = new Crawler();
        break;
      case EnemyRef.Deenglow:
        enemy = new Deenglow();
        break;
      case EnemyRef.Eligor:
        enemy = new Eligor();
        break;
      case EnemyRef.Elfadunk:
        enemy = new Elfadunk();
        break;
      case EnemyRef.FirstRay:
        enemy = new FirstRay();
        break;
      case EnemyRef.Formula:
        enemy = new Formula();
        break;
      case EnemyRef.Grunt:
        enemy = new Grunt();
        break;
      case EnemyRef.GuardHound:
        enemy = new GuardHound();
        break;
      case EnemyRef.GuardScorpion:
        enemy = new GuardScorpion();
        break;
      case EnemyRef.HedgehogPie:
        enemy = new HedgehogPie();
        break;
      case EnemyRef.HeliGunner:
        enemy = new HeliGunner();
        break;
      case EnemyRef.HellHouse:
        enemy = new HellHouse();
        break;
      case EnemyRef.HellRider:
        enemy = new HellRider();
        break;
      case EnemyRef.HundredGunner:
        enemy = new HundredGunner();
        break;
      case EnemyRef.KalmFang:
        enemy = new KalmFang();
        break;
      case EnemyRef.Levrikon:
        enemy = new Levrikon();
        break;
      case EnemyRef.Madouge:
        enemy = new Madouge();
        break;
      case EnemyRef.Mandragora:
        enemy = new Mandragora();
        break;
      case EnemyRef.MidgarZolom:
        enemy = new MidgarZolom();
        break;
      case EnemyRef.MightyGrunt:
        enemy = new MightyGrunt();
        break;
      case EnemyRef.MotorBall:
        enemy = new MotorBall();
        break;
      case EnemyRef.MP:
        enemy = new Mp();
        break;
      case EnemyRef.MysteryNinja:
        enemy = new MysteryNinja();
        break;
      case EnemyRef.ProtoMachinegun:
        enemy = new ProtoMachinegun();
        break;
      case EnemyRef.Smogger:
        enemy = new Smogger();
        break;
      case EnemyRef.Reno:
        enemy = new Reno();
        break;
      case EnemyRef.Rufus:
        enemy = new Rufus();
        break;
      case EnemyRef.SampleH0512:
        enemy = new SampleH0512();
        break;
      case EnemyRef.SpecialCombatant:
        enemy = new SpecialCombatant();
        break;
      case EnemyRef.Soldier3rd:
        enemy = new Soldier3rd();
        break;
      case EnemyRef.Sweeper:
        enemy = new Sweeper();
        break;
      case EnemyRef.SwordDance:
        enemy = new SwordDance();
        break;
      case EnemyRef.VargidPolice:
        enemy = new VargidPolice();
        break;
      case EnemyRef.Vice:
        enemy = new Vice();
        break;
      case EnemyRef.WholeEater:
        enemy = new WholeEater();
        break;
      case EnemyRef.Zemzelett:
        enemy = new Zemzelett();
        break;
      case EnemyRef.Zenene:
        enemy = new Zenene();
        break;
      default:
        throw new Error('Enemy not found');
    }
    return enemy;
  }
}
