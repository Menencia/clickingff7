import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {

  constructor(public game: GameService, public router: Router, public translate: TranslateService) {
    // Redirection
    if (!this.game.loaded) {
      this.router.navigateByUrl('game');
    }
  }

  changeLanguage(): void {
    this.translate.use(this.game.language);
  }

}
