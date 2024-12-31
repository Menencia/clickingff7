import { ActionTarget } from '@shared/interfaces/action-target';
import { BehaviorSubject } from 'rxjs';

import { Team } from './team';
import { Units } from './units';
import { Enemies } from './units/enemies';

export enum BattleState {
  Started,
  NextTurn,
  Ended,
}

export class Battle {
  currentTurn = 1;

  currentPlayer: Units;

  state = new BehaviorSubject(BattleState.Started);

  actionOngoing = false;

  victory = false;

  constructor(
    public readonly team: Team,
    public readonly enemies: Enemies,
  ) {
    // TODO: determine randomly? who's the first to play
    this.currentPlayer = this.team;
  }

  getSelf(): Units {
    return this.currentPlayer === this.team ? this.team : this.enemies;
  }

  getOpponent(): Units {
    return this.currentPlayer === this.team ? this.enemies : this.team;
  }

  isPlayerTurn(): boolean {
    return this.currentPlayer === this.team;
  }

  /** Returns target for action */
  getTarget(target: ActionTarget): Units {
    switch (target) {
      case ActionTarget.SELF:
        return this.getSelf();
      case ActionTarget.OPPONENT:
        return this.getOpponent();
      default:
        throw new Error(`Unknown target: ${target}`);
    }
  }

  /** Finish the current turn and launch the next one */
  public async nextTurn(): Promise<void> {
    if (!this.enemies.isAlive()) {
      this.end(true);
    } else if (!this.team.isAlive()) {
      this.end(false);
    } else {
      this.currentPlayer = this.getOpponent();
      this.currentTurn += 1;
      this.state.next(BattleState.NextTurn);
    }
  }

  getCurrentTurn(): number {
    return Math.ceil(this.currentTurn / 2);
  }

  /**
   * Characters stop attacking and wait for next fight
   */
  end(victory: boolean): void {
    this.victory = victory;
    this.state.next(BattleState.Ended);
    this.state.complete();
  }
}
