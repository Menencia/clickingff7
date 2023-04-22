import { Component } from '@angular/core';
import { Character } from 'src/app/models/character';
import { Characters } from 'src/app/models/characters';
import { Enemies } from 'src/app/models/enemies';
import { BattleService } from 'src/app/services/battle.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.scss']
})
export class ViewGameComponent {

  public characters: Characters;
  public enemies: Enemies;

  /**
   * Init
   */
  constructor(private gameService: GameService,
              private battleService: BattleService) {
    this.characters = this.gameService.characters;
    this.enemies = this.battleService.enemies;
  }

  public getLine(character: Character): string {
    const levelMax = this.gameService.zones.levelMax;
    return 'Line ' + levelMax + ' ' + character.ref;
  }

  public round(value: number): number {
    return Math.round(value);
  }

}