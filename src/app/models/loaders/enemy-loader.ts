import { GameService } from 'src/app/game.service';
import { FirstRay } from '../enemies/zone1/first-ray';
import { GuardScorpion } from '../enemies/zone1/guard-scorpion';
import { Enemy } from '../enemy';

export enum EnemyRef {
  FirstRay = 'FirstRay',
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
      case EnemyRef.GuardScorpion:
        enemy = new GuardScorpion(game);
        break;
      default:
        throw new Error('Enemy not found');
    }
    return enemy;
  }

}
