import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { Character } from '@shared/models/character';
import { Team } from '@shared/models/team';
import { PlayerService } from '@shared/services/player.service';

@Component({
  selector: 'app-characters-panel',
  standalone: true,
  imports: [ProgressBarComponent, TranslateModule],
  templateUrl: './characters-panel.component.html',
  styleUrl: './characters-panel.component.scss',
})
export class CharactersPanelComponent {
  @Input() team: Team = new Team();

  constructor(private playerService: PlayerService) {}

  public getLine(character: Character): string {
    const { levelMax } = this.playerService.zones;
    return `Line ${levelMax} ${character.data.ref}`;
  }

  public round(value: number): number {
    return Math.round(value);
  }
}
