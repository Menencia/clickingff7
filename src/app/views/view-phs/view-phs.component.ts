import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from 'src/app/core/services/game.service';
import { Character } from 'src/app/models/character';
import { Team } from 'src/app/models/team';
import { MAX_TEAM } from 'src/app/models/units/characters';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-phs',
  standalone: true,
  imports: [UiLayoutDefaultComponent, TranslateModule, NgFor, NgIf],
  templateUrl: './view-phs.component.html',
  styleUrls: ['./view-phs.component.scss'],
})
export class ViewPhsComponent {
  team: Team;

  characters: Character[];

  constructor(private gameService: GameService) {
    this.team = this.gameService.team;
    this.characters = this.gameService.characters.list;
  }

  inTeam(character: Character): boolean {
    return !!this.team.list.find((c) => c.ref === character.ref);
  }

  canJoinTeam(): boolean {
    return this.team.list.length < MAX_TEAM;
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
    return this.team.list.length > 1;
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
}
