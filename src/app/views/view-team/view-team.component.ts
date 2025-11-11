import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { Character } from '@shared/models/character';
import { Team } from '@shared/models/team';
import { MAX_TEAM } from '@shared/models/units/characters';
import { PlayerService } from '@shared/services/player.service';

@Component({
    selector: 'app-view-team',
    imports: [UiLayoutDefaultComponent, TranslateModule],
    templateUrl: './view-team.component.html',
    styleUrls: ['./view-team.component.scss']
})
export class ViewTeamComponent {
  team: Team;

  characters: Character[];

  constructor(private playerService: PlayerService) {
    this.team = this.playerService.team;
    this.characters = this.playerService.characters.list;
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
    return this.playerService.zones.levelMax >= 5;
  }
}
