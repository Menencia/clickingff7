import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LangService } from 'src/app/core/services/lang.service';
import { PlayerService } from 'src/app/core/services/player.service';
import { Difficulty } from 'src/app/shared/interfaces/difficulty';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-config',
  standalone: true,
  imports: [UiLayoutDefaultComponent, TranslateModule, FormsModule],
  templateUrl: './view-config.component.html',
  styleUrls: ['./view-config.component.scss'],
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

  changeDifficulty(): void {
    this.playerService.difficulty = this.difficulty;
  }

  changeLanguage(): void {
    this.playerService.language = this.language;
    this.langService.useLang(this.playerService.language);
  }
}
