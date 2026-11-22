import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent {
  private gameService = inject(GameService);

  displayNextZone() {
    return this.gameService.zones.isNextZone();
  }

  displayPhs() {
    return this.gameService.zones.isPhsUnlocked();
  }
}
