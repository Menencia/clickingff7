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

  constructor(public gameService: GameService,
              public translateService: TranslateService) {
    this.difficulty = this.gameService.difficulty;
    this.language = this.gameService.language;
  }

  changeLanguage(): void {
    this.translateService.use(this.gameService.language);
  }

}
