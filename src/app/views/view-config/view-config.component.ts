import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { LangService } from '@shared/services/lang.service';
import { PlayerService } from '@shared/services/player.service';
import { ThemeService } from '@shared/services/theme.service';
import { Difficulty } from 'src/app/shared/interfaces/difficulty';

@Component({
  selector: 'app-view-config',
  imports: [UiLayoutDefaultComponent, TranslateModule, FormsModule],
  templateUrl: './view-config.component.html',
})
export class ViewConfigComponent {
  difficulty: Difficulty;
  language: string;
  theme: string;

  constructor(
    private playerService: PlayerService,
    private langService: LangService,
    private themeService: ThemeService,
  ) {
    this.difficulty = this.playerService.difficulty;
    this.language = this.playerService.language;
    this.theme = this.themeService.theme ?? 'browser';
  }

  changeDifficulty() {
    this.playerService.difficulty = this.difficulty;
  }

  changeLanguage() {
    this.playerService.language = this.language;
    this.langService.useLang(this.playerService.language);
  }

  changeTheme() {
    if (this.theme === 'browser') {
      this.themeService.applyTheme(undefined);
    } else {
      this.themeService.applyTheme(this.theme);
    }
  }
}
