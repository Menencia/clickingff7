import { Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../../../core/services/game.service';
import { Character } from '../../../../models/character';
import { Characters } from '../../../../models/units/characters';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';
import { percent } from '../../../../shared/utils/math.utils';

@Component({
  selector: 'app-characters-panel',
  imports: [ProgressBarComponent, TranslatePipe],
  templateUrl: './characters-panel.component.html',
  styleUrl: './characters-panel.component.scss',
})
export class CharactersPanelComponent {
  private gameService = inject(GameService);

  readonly characters = input<Characters>(new Characters());

  readonly hpPercent = computed(() =>
    percent(this.characters().hp(), this.characters().hpMax()),
  );

  readonly mpPercent = computed(() =>
    percent(this.characters().mp(), this.characters().mpMax()),
  );

  readonly limitPercent = computed(() =>
    percent(this.characters().limit(), this.characters().limitMax()),
  );

  public getLine(character: Character): string {
    const { levelMax } = this.gameService.zones;
    return `Line ${levelMax} ${character.ref}`;
  }
}
