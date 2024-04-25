import { Component } from '@angular/core';
import { BattleService } from 'src/app/core/services/battle.service';
import { GameService } from 'src/app/core/services/game.service';
import { Character } from 'src/app/models/character';
import { Characters } from 'src/app/models/units/characters';
import { Enemies } from 'src/app/models/units/enemies';

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.scss'],
})
export class ViewGameComponent {
  public characters: Characters;
  public enemies: Enemies;

  constructor(
    private gameService: GameService,
    private battleService: BattleService,
  ) {
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
