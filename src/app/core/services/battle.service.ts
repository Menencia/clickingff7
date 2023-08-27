import { Injectable } from '@angular/core';
import { Characters } from 'src/app/models/characters';
import { Enemies } from 'src/app/models/enemies';
import { GameService } from './game.service';
import { MAX_FIGHTS } from 'src/app/models/zone';
import { AttackEnemy } from 'src/app/models/action-subs/attack-enemy';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  public characters: Characters;
  public enemies: Enemies;
  public isBattle = false;
  public isPlayerTurn = false;

  constructor(private gameService: GameService) {
    this.characters = this.gameService.characters;
    this.enemies = new Enemies();
  }

  /** Starts a basic battle */
  startRandom(): void {
    if (!this.isBattle) {
      this.isBattle = true;
      // TODO: determine randomly? who's the forst to move
      this.isPlayerTurn = true;

      const levelSum = this.gameService.characters.levelSum;
      const zone = this.gameService.zones.current();
      this.enemies.fightRandom(levelSum, zone, this.gameService.difficulty);
      this.enemies.refresh();
    }
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.gameService.zones.current();
    return (!this.isBattle && zone.nbFights >= MAX_FIGHTS && !zone.completed);
  }

  /** Starts a boss battle */
  startBoss(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      const zone = this.gameService.zones.current();
      const nbCharacters = this.gameService.characters.getTeam().length;
      this.enemies.fightBoss(zone, nbCharacters, this.gameService.difficulty);
      this.enemies.refresh();
    }
  }

  /** Executes an enemy attack */
  private attackWithEnemy(): void {
    // TODO: choose randomly an enemy skill
    const action = new AttackEnemy(this.enemies.getHits(), 100);

    action.use(this);

    action._complete.subscribe(() => {
      this.nextTurn();
    });
  }

  /** Finish the current turn and launch the next one */
  public nextTurn(): void {
    if (!this.enemies.isAlive()) {
      this.end(true);
    } else if (!this.gameService.characters.isAlive()) {
      this.end(false);
    } else {
      this.isPlayerTurn = !this.isPlayerTurn;
      if (!this.isPlayerTurn) {
        this.attackWithEnemy();
      }
    }
  }

  /**
   * Characters stop attacking and wait for next fight
   */
  end(victory: boolean): void {
    this.isBattle = false;
    this.isPlayerTurn = false;

    const enemies = this.enemies.list;
    const characters = this.gameService.characters.getTeam();
    const materias = this.gameService.materias.getEquipped();

    for (const enemy of enemies) {

      // Rewards if victory
      if (victory) {
        this.gameService.gils += enemy.gilsReward();

        if (enemy.boss && this.gameService.zones.level + 1 > this.gameService.zones.levelMax) {
          // Complete zone
          this.gameService.zones.complete();
        }

        // XP for characters
        const xp = enemy.xpReward();
        for (const character of characters) {
          character.setXp(xp);
        }

        // AP for materias
        const ap = enemy.apReward();
        for (const materia of materias) {
          materia.setAp(ap);
        }

        this.gameService.zones.current().nbFights++;
      }
    }

    this.enemies.remove();
    this.enemies.refresh();
    this.gameService.characters.refresh();
  }

}
