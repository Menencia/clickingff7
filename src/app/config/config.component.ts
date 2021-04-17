import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {

  constructor(public game: GameService, public translate: TranslateService) {}

  changeLanguage(): void {
    this.translate.use(this.game.language);
  }

}
