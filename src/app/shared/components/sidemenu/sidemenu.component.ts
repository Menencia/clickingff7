import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../../core/services/game.service';
import { PHS_UNLOCK_ZONE } from '../../utils/game.utils';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent {
  private gameService = inject(GameService);

  horizontal = input(false);

  displayNextZone() {
    return this.gameService.zones.isNextZone();
  }

  displayPhs() {
    return this.gameService.zones.levelMax >= PHS_UNLOCK_ZONE;
  }
}
