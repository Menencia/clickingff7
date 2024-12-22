import { Injectable } from '@angular/core';
import { Team } from '@shared/models/team';
import { Units } from '@shared/models/units';
import { Enemies } from '@shared/models/units/enemies';
import { MAX_FIGHTS } from '@shared/models/zone';
import { ActionTarget } from 'src/app/shared/interfaces/action-target';

import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public team: Team;

  public enemies: Enemies;

  public isBattle = false;

  public isPlayerTurn = false;

  public actionOngoing = false;

  constructor(private playerService: PlayerService) {
    this.team = this.playerService.team;
    this.enemies = new Enemies();
  }

  /** Returns target for action */
  getTarget(target: ActionTarget): Units {
    switch (target) {
      case ActionTarget.SELF:
        if (this.isBattle) {
          return this.isPlayerTurn ? this.team : this.enemies;
        }
        return this.team;
      case ActionTarget.OPPONENT:
        return this.isPlayerTurn ? this.enemies : this.team;
      default:
        throw new Error(`Unknown target: ${target}`);
    }
  }

  /** Starts a basic battle */
  startRandom(): void {
    if (!this.isBattle) {
      this.isBattle = true;
      // TODO: determine randomly? who's the forst to move
      this.isPlayerTurn = true;

      const zone = this.playerService.zones.current();
      this.enemies.fightRandom(zone, this.playerService.difficulty);
    }
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.playerService.zones.current();
    return !this.isBattle && zone.nbFights >= MAX_FIGHTS && !zone.completed;
  }

  /** Starts a boss battle */
  startBoss(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      const zone = this.playerService.zones.current();
      this.enemies.fightBoss(zone, this.playerService.difficulty);
    }
  }

  /** Executes an enemy attack */
  private async attackWithEnemy(): Promise<void> {
    // TODO: choose randomly an enemy skill
    await this.enemies.useAttackSkill(this);
  }

  /** Finish the current turn and launch the next one */
  public async nextTurn(): Promise<void> {
    if (!this.enemies.isAlive()) {
      this.end(true);
    } else if (!this.team.isAlive()) {
      this.end(false);
    } else {
      this.isPlayerTurn = !this.isPlayerTurn;
      if (!this.isPlayerTurn) {
        await this.attackWithEnemy();
      }
    }
  }

  /**
   * Characters stop attacking and wait for next fight
   */
  end(victory: boolean): void {
    this.isBattle = false;
    this.isPlayerTurn = false;

    // Rewards if victory
    if (victory) {
      this.playerService.gils += this.enemies.rewardGils;

      if (this.enemies.boss && this.playerService.zones.level + 1 > this.playerService.zones.levelMax) {
        // Complete zone
        this.playerService.zones.complete();
      }

      // XP for characters
      this.team.setXp(this.enemies.rewardXp);

      // AP for materias
      const ap = this.enemies.rewardAp;
      const materias = this.playerService.materias.getEquipped();
      materias.forEach((materia) => {
        materia.setAp(ap);
      });

      this.playerService.zones.current().nbFights += 1;
    }

    this.enemies.remove();
    this.playerService.team.refresh();
  }
}
