import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { Difficulty } from '@shared/interfaces/difficulty';
import { LangService } from '@shared/services/lang.service';
import { PlayerService } from '@shared/services/player.service';

@Component({
  selector: 'app-view-config',
  imports: [UiLayoutDefaultComponent, TranslatePipe, FormsModule],
  templateUrl: './view-config.component.html',
})
export class ViewConfigComponent {
  difficulty: Difficulty;
  language: string;

  constructor(
    private playerService: PlayerService,
    private langService: LangService,
  ) {
    this.difficulty = this.playerService.difficulty;
    this.language = this.playerService.language;
  }

  changeDifficulty() {
    this.playerService.difficulty = this.difficulty;
  }

  changeLanguage() {
    this.playerService.language = this.language;
    this.langService.useLang(this.playerService.language);
  }
}
