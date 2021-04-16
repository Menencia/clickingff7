import { GameService } from '../game.service';
import { MAX_FIGHTS } from './zone';

export class Battle {

  game: GameService;
  isBattle: boolean;

  constructor(game: GameService) {
    this.game = game;
    this.isBattle = false;
  }

  /**
   * Characters start auto-attacking
   */
  startRandom(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      this.game.enemies.fightRandom();
      this.game.enemies.refresh();
      this.game.enemies.autoFighting();
    }
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.game.zones.current();
    return (!this.isBattle && zone.nbFights >= MAX_FIGHTS && !zone.completed);
  }

  /**
   * Characters start auto-attacking
   */
  startBoss(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      this.game.enemies.fightBoss();
      this.game.enemies.refresh();
      this.game.enemies.autoFighting();
    }
  }

  /**
   * Characters stop attacking and wait for next fight
   */
  end(victory: boolean): void {
    this.isBattle = false;

    this.game.enemies.stopFighting();

    const enemies = this.game.enemies.list;
    const characters = this.game.characters.getTeam();
    const materias = this.game.materias.getEquipped();

    for (const enemy of enemies) {

      // Rewards if victory
      if (victory) {
        this.game.gils += enemy.gilsReward();

        if (enemy.boss && this.game.zones.level + 1 > this.game.zones.levelMax) {
          // Complete zone
          this.game.zones.complete();
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

        this.game.zones.current().nbFights++;
      }
    }

    this.game.enemies.remove();
    this.game.enemies.refresh();
    this.game.characters.refresh();
  }

}
