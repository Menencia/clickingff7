import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Difficulty, GameService } from '../services/game.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {

  difficulty: Difficulty;
  language: string;

  constructor(private gameService: GameService,
              private translateService: TranslateService) {
    this.difficulty = this.gameService.difficulty;
    this.language = this.gameService.language;
  }

  changeDifficulty(): void {
    this.gameService.difficulty = this.difficulty;
  }

  changeLanguage(): void {
    this.gameService.language = this.language;
    this.translateService.use(this.gameService.language);
  }

}
