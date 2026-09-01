import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../../../core/services/game.service';
import { Character } from '../../../../models/character';
import { Characters } from '../../../../models/units/characters';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';

@Component({
  selector: 'app-characters-panel',
  imports: [ProgressBarComponent, TranslatePipe],
  templateUrl: './characters-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './characters-panel.component.scss',
})
export class CharactersPanelComponent {
  @Input() characters: Characters = new Characters();

  constructor(private gameService: GameService) {}

  public getLine(character: Character): string {
    const { levelMax } = this.gameService.zones;
    return `Line ${levelMax} ${character.ref}`;
  }

  public round(value: number): number {
    return Math.round(value);
  }
}
