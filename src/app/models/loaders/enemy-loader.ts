import { GameService } from 'src/app/game.service';
import { FirstRay } from '../enemies/zone1/first-ray';
import { Grunt } from '../enemies/zone1/grunt';
import { GuardScorpion } from '../enemies/zone1/guard-scorpion';
import { Mp } from '../enemies/zone1/mp';
import { Sweeper } from '../enemies/zone1/sweeper';
import { Enemy } from '../enemy';

export enum EnemyRef {
  FirstRay = 'FirstRay',
  MP = 'MP',
  Grunt = 'Grunt',
  Sweeper = 'Sweeper',
  GuardScorpion = 'GuardScorpion',
}

export class EnemyLoader {

  /**
   *
   */
  static build(ref: string, game: GameService): Enemy {
    let enemy;
    switch (ref) {
      case EnemyRef.FirstRay:
        enemy = new FirstRay(game);
        break;
      case EnemyRef.MP:
        enemy = new Mp(game);
        break;
      case EnemyRef.Grunt:
        enemy = new Grunt(game);
        break;
      case EnemyRef.Sweeper:
        enemy = new Sweeper(game);
        break;
      case EnemyRef.GuardScorpion:
        enemy = new GuardScorpion(game);
        break;
      default:
        throw new Error('Enemy not found');
    }
    return enemy;
  }

}
