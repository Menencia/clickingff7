import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Difficulty, GameService } from '../../core/services/game.service';
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

  protected readonly difficulties = [
    { value: Difficulty.Easy, label: 'Easy' },
    { value: Difficulty.Normal, label: 'Normal' },
    { value: Difficulty.Hard, label: 'Hard' },
  ];

  protected readonly languages = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
  ];

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
