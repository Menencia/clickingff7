import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Difficulty, GameService } from '../../core/services/game.service';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-config',
  imports: [UiLayoutDefaultComponent, TranslatePipe, FormsModule],
  templateUrl: './view-config.component.html',
  styleUrls: ['./view-config.component.scss'],
})
export class ViewConfigComponent {
  difficulty: Difficulty;

  language: string;

  constructor(
    private gameService: GameService,
    private translateService: TranslateService,
  ) {
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
