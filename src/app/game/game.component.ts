import { Component, ViewEncapsulation } from '@angular/core';
import { GameService } from '../game.service';
import { Attack } from '../models/attack';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  /**
   * Init
   */
  constructor(public game: GameService) { }

  /**
   * Explore for fight
   */
  fightRandom(): void {
    if (!this.game.battle.isBattle) {
      this.game.battle.startRandom();
    }
  }

  /**
   * Explore for fight
   */
  fightBoss(): void {
    if (this.game.battle.canFightBoss()) {
      this.game.battle.startBoss();
    }
  }

  /**
   * Attack manually enemy
   */
  attack(): void {
    if (this.game.characters.canAttack()) {
      const pwr = this.game.characters.getHits();
      this.game.enemies.getAttacked(new Attack(pwr));
    }
  }

  /**
   * Escape fight
   */
  escape(): void {
    if (this.game.characters.canEscape()) {
      this.game.characters.escape();
    }
  }

}
