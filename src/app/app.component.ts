import { Component } from '@angular/core';
import { GameService } from './core/services/game.service';
import { BattleService } from './core/services/battle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public gameService: GameService,
    public battleService: BattleService
  ) { }
}
