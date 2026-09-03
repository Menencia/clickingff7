import { BehaviorSubject } from 'rxjs';
import { Characters } from './units/characters';
import { Enemies } from './units/enemies';

export enum BattleState {
  Started,
  Ended,
}

export class Battle {
  timer!: ReturnType<typeof setTimeout>;

  state = new BehaviorSubject(BattleState.Started);

  victory = false;

  constructor(
    public readonly characters: Characters,
    public readonly enemies: Enemies,
  ) {
    // this.start();
  }

  start(): void {
    this.timer = setTimeout(() => {
      this.enemies.getAttackSkill().use(this);

      if (this.characters.isAlive()) {
        this.start();
      } else {
        this.end(false);
      }
    }, 1000);
  }

  /**
   * Stop fighting
   */
  stop(): void {
    clearTimeout(this.timer);
  }

  /**
   * Characters stop attacking and wait for next fight
   */
  end(victory: boolean): void {
    this.stop();
    this.victory = victory;
    this.state.next(BattleState.Ended);
    this.state.complete();
  }
}
