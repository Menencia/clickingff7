import { Injectable, signal } from '@angular/core';
import { Battle, BattleState } from '@shared/models/battle';
import { convertEffects } from '@shared/models/effect-converter';
import { executeSkill } from '@shared/models/effect-executor';
import { Team } from '@shared/models/team';
import { Enemies } from '@shared/models/units/enemies';
import { MAX_FIGHTS } from '@shared/models/zone';

import { PlayerService } from './player.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public team: Team;

  public battle = signal<Battle | undefined>(undefined);

  constructor(
    private playerService: PlayerService,
    private store: StoreService,
  ) {
    this.team = this.playerService.team;
  }

  /** Starts a basic battle */
  startRandom(): void {
    if (this.battle()) {
      throw new Error('Battle is already ongoing');
    }

    // get random enemy
    const zone = this.playerService.zones.current();
    const enemyRef = zone.getRandomEnemyRef();
    const enemies = new Enemies([this.store.getEnemy(enemyRef)]);

    // set level of enemy
    const zoneLevel = zone.data.level;
    const teamLevel = this.playerService.team.level;
    enemies.level = Math.min(teamLevel, 5 * (zoneLevel - 1) + 3);
    enemies.refresh();

    // new battle
    const battle = new Battle(this.playerService.team, enemies);

    // watch battle state
    battle.state.subscribe(async (state) => {
      if (state === BattleState.NextTurn) {
        // enemies turn
        if (!battle.isPlayerTurn()) {
          const effects = convertEffects(enemies.getAttackRawEffects());
          await executeSkill(battle, effects);
          battle.nextTurn();
        }
      }
      if (state === BattleState.Ended) {
        // rewards on victory
        if (battle.victory) {
          this.onTeamVictory(battle);
        }
        // clean battle
        this.battle.set(undefined);
      }
    });

    this.battle.set(battle);
  }

  /** team gains exp
   * materias gain ap
   * player gains gils
   * zone can be completed */
  private onTeamVictory(battle: Battle) {
    this.playerService.gils += battle.enemies.rewardGils;

    if (battle.enemies.boss && this.playerService.zones.level + 1 > this.playerService.zones.levelMax) {
      // Complete zone
      this.playerService.zones.complete();
    }

    // XP for characters
    this.team.setXp(battle.enemies.rewardXp);

    // AP for materias
    const ap = battle.enemies.rewardAp;
    const materias = this.playerService.materias.getEquipped();
    materias.forEach((materia) => {
      materia.setAp(ap);
    });

    this.playerService.zones.current().nbFights += 1;

    this.playerService.team.refresh();
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.playerService.zones.current();
    return !this.battle() && zone.nbFights >= MAX_FIGHTS && !zone.completed;
  }

  /** Starts a boss battle */
  startBoss(): void {
    // if (!this.isBattle) {
    //   this.isBattle = true;
    //   const zone = this.playerService.zones.current();
    //   this.enemies.fightBoss(zone, this.playerService.difficulty);
    // }
  }

  canPlay(): boolean {
    const battle = this.battle();
    return !!battle && battle.isPlayerTurn() && !battle.actionOngoing;
  }
}
