import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { Character } from '../../models/character';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-phs',
  imports: [UiLayoutDefaultComponent, TranslatePipe],
  templateUrl: './view-phs.component.html',
  styleUrls: ['./view-phs.component.scss'],
})
export class ViewPhsComponent {
  private gameService = inject(GameService);

  readonly team = this.gameService.characters.team;

  readonly backup = this.gameService.characters.backup;

  canJoinTeam(): boolean {
    return this.gameService.characters.canJoin();
  }

  joinTeam(character: Character): void {
    this.gameService.characters.join(character);
  }

  canLeaveTeam(): boolean {
    return this.gameService.characters.canLeave();
  }

  leaveTeam(character: Character): void {
    this.gameService.leaveTeam(character);
  }
}
