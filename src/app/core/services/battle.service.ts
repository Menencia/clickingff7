import { Injectable } from '@angular/core';
import { Team } from 'src/app/models/team';
import { Enemies } from 'src/app/models/units/enemies';
import { MAX_FIGHTS } from 'src/app/models/zone';

import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public team: Team;

  public enemies: Enemies;

  public isBattle = false;

  public timer!: ReturnType<typeof setTimeout>;

  constructor(private playerService: PlayerService) {
    this.team = this.playerService.team;
    this.enemies = new Enemies();
  }

  /**
   * Characters start auto-attacking
   */
  startRandom(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      const zone = this.playerService.zones.current();
      this.enemies.fightRandom(zone, this.playerService.difficulty);
      this.startFighting();
    }
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.playerService.zones.current();
    return !this.isBattle && zone.nbFights >= MAX_FIGHTS && !zone.completed;
  }

  /**
   * Characters start auto-attacking
   */
  startBoss(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      const zone = this.playerService.zones.current();
      this.enemies.fightBoss(zone, this.playerService.difficulty);
      this.startFighting();
    }
  }

  startFighting(): void {
    this.timer = setTimeout(() => {
      this.enemies.getAttackSkill().use(this);

      if (this.team.isAlive()) {
        this.startFighting();
      } else {
        this.end(false);
      }
    }, 1000);
  }

  /**
   * Stop fighting
   */
  stopFighting(): void {
    clearTimeout(this.timer);
  }

  /**
   * Characters stop attacking and wait for next fight
   */
  end(victory: boolean): void {
    this.isBattle = false;

    this.stopFighting();

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
