import { Component } from '@angular/core';
import { BattleService } from '../services/battle.service';
import { EnemiesService } from '../services/enemies.service';
import { GameService } from '../services/game.service';
import { Attack } from '../models/attack';
import { Character } from '../models/character';
import { Item } from '../models/item';
import { Materia } from '../models/materia';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  /** Send Math to html */
  Math = Math;

  /**
   * Init
   */
  constructor(public gameService: GameService,
              public battleService: BattleService,
              public enemiesService: EnemiesService) { }

  getLine(character: Character): string {
    const levelMax = this.gameService.zones.levelMax;
    return 'Line ' + levelMax + ' ' + character.ref;
  }

  /**
   * Explore for fight
   */
  fightRandom(): void {
    if (!this.battleService.isBattle) {
      this.battleService.startRandom();
    }
  }

  /**
   * Explore for fight
   */
  fightBoss(): void {
    if (this.battleService.canFightBoss()) {
      this.battleService.startBoss();
    }
  }

  /**
   * Attack manually enemy
   */
  attack(): void {
    if (this.battleService.isBattle) {
      const pwr = this.gameService.characters.getHits();
      const hits = this.enemiesService.getAttacked(new Attack(pwr));
      this.gameService.characters.displayHits(hits);

      if (!this.enemiesService.isAlive()) {
        this.battleService.end(true);
      }
    }
  }

  /**
   * Escape fight
   */
  escape(): void {
    if (this.battleService.isBattle) {
      this.battleService.end(false);
    }
  }

  canUseMateria(materia: Materia): boolean {
    return materia.canUse(this.battleService);
  }

  useMateria(materia: Materia): void {
    // cost
    if (this.canUseMateria(materia)) {
      this.gameService.characters.mp -= materia.getMpCost();
    } else {
      throw new Error('CANNOT USE');
    }

    // do action
    materia.use(this.battleService);
  }

  canUseItem(item: Item): boolean {
    return item.canUse(this.battleService);
  }

  useItem(item: Item): void {
    // cost
    if (this.canUseItem(item)) {
      if (item.nbr > 1) {
        item.nbr--;
      } else {
        this.gameService.items.list = this.gameService.items.list.filter(e => e !== item);
      }
    } else {
      throw new Error('CANNOT USE');
    }

    // do action
    item.use(this.battleService);
  }

}
