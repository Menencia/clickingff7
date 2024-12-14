import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from 'src/app/core/services/game.service';
import { Character } from 'src/app/models/character';
import { Team } from 'src/app/models/team';
import { MAX_TEAM } from 'src/app/models/units/characters';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-team',
  standalone: true,
  imports: [UiLayoutDefaultComponent, TranslateModule],
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.scss'],
})
export class ViewTeamComponent {
  team: Team;

  characters: Character[];

  constructor(private gameService: GameService) {
    this.team = this.gameService.team;
    this.characters = this.gameService.characters.list;
  }

  inTeam(character: Character): boolean {
    return !!this.team.list.find((c) => c.data.ref === character.data.ref);
  }

  canJoinTeam(): boolean {
    return this.canEditTeam() && this.team.list.length < MAX_TEAM;
  }

  /**
   * Character joins the team
   */
  joinTeam(character: Character): void {
    if (this.canJoinTeam()) {
      this.team.join(character);
      this.team.refresh();
    }
  }

  /**
   * Returns true if the character can leave the team
   */
  canLeaveTeam(): boolean {
    return this.canEditTeam() && this.team.list.length > 1;
  }

  /**
   * Character leaves the team
   */
  leaveTeam(character: Character): void {
    if (this.canLeaveTeam()) {
      this.team.leave(character);
      this.team.refresh();
    }
  }

  /** Returns true if team can be modified */
  private canEditTeam(): boolean {
    return this.gameService.zones.levelMax >= 5;
  }
}
