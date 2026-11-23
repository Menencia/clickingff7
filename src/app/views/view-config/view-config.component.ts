import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { DIFFICULTIES, Difficulty } from '../../models/difficulty';
import { LANGUAGES } from '../../models/language';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-config',
  imports: [UiLayoutDefaultComponent, TranslatePipe],
  templateUrl: './view-config.component.html',
  styleUrls: ['./view-config.component.scss'],
})
export class ViewConfigComponent {
  private gameService = inject(GameService);
  private translateService = inject(TranslateService);

  protected readonly difficulties = DIFFICULTIES;

  protected readonly languages = LANGUAGES;

  difficulty: Difficulty;

  language: string;

  constructor() {
    this.difficulty = this.gameService.difficulty;
    this.language = this.gameService.language;
  }

  changeDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
    this.gameService.difficulty = difficulty;
  }

  changeLanguage(language: string): void {
    this.language = language;
    this.gameService.language = language;
    this.translateService.use(language);
  }
}
