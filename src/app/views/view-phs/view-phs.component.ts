import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { Character } from '../../models/character';
import { MAX_TEAM } from '../../models/units/characters';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-phs',
  imports: [UiLayoutDefaultComponent, TranslatePipe],
  templateUrl: './view-phs.component.html',
  styleUrls: ['./view-phs.component.scss'],
})
export class ViewPhsComponent {
  team: Character[];

  backup: Character[];

  constructor(private gameService: GameService) {
    this.team = this.gameService.characters.getTeam();
    this.backup = this.gameService.characters.getBackup();
  }

  canJoinTeam(): boolean {
    return this.gameService.characters.getTeam().length < MAX_TEAM;
  }

  /**
   * Character joins the team
   */
  joinTeam(character: Character): void {
    character.inTeam = true;
    this.refresh();
  }

  /**
   * Returns true if the character can leave the team
   */
  canLeaveTeam(): boolean {
    return this.gameService.characters.getTeam().length > 1;
  }

  /**
   * Character leaves the team
   */
  leaveTeam(character: Character): void {
    character.inTeam = false;
    this.refresh();
  }

  private refresh(): void {
    this.gameService.characters.refresh();
    this.team = this.gameService.characters.getTeam();
    this.backup = this.gameService.characters.getBackup();
  }
}
