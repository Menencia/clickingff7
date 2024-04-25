import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BattleService } from './core/services/battle.service';
import { GameService } from './core/services/game.service';
import { UiFooterComponent } from './shared/ui/ui-footer/ui-footer.component';
import { UiNavbarComponent } from './shared/ui/ui-navbar/ui-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UiFooterComponent, UiNavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public gameService: GameService,
    public battleService: BattleService,
  ) {}
}
