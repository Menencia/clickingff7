import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from 'src/app/core/services/game.service';
import { Character } from 'src/app/models/character';
import { Characters } from 'src/app/models/units/characters';
import { UiBarComponent } from 'src/app/shared/ui/ui-bar/ui-bar.component';

@Component({
  selector: 'app-characters-panel',
  standalone: true,
  imports: [UiBarComponent, TranslateModule, NgFor],
  templateUrl: './characters-panel.component.html',
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
