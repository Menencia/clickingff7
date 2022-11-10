import { Component } from '@angular/core'
import { GameService } from '../services/game.service'
import { Character } from '../models/character'
import { Characters } from '../models/characters'
import { Enemies } from '../models/enemies'
import { BattleService } from '../services/battle.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  public characters: Characters
  public enemies: Enemies

  /**
   * Init
   */
  constructor(private gameService: GameService,
              private battleService: BattleService) {
    this.characters = this.gameService.characters
    this.enemies = this.battleService.enemies
  }

  public getLine(character: Character): string {
    const levelMax = this.gameService.zones.levelMax
    return 'Line ' + levelMax + ' ' + character.ref
  }

  public round(value: number): number {
    return Math.round(value)
  }

}
