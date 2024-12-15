import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from 'src/app/core/services/player.service';
import { Character } from 'src/app/models/character';
import { Team } from 'src/app/models/team';
import { ProgressBarComponent } from 'src/app/shared/ui/progress-bar/progress-bar.component';

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
