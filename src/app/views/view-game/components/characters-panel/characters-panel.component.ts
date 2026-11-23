import { Component, computed, input } from '@angular/core';
import { Characters } from '../../../../models/units/characters';
import { RadialGaugeComponent } from '../../../../shared/ui/radial-gauge/radial-gauge.component';
import { percent } from '../../../../shared/utils/math.utils';

@Component({
  selector: 'app-characters-panel',
  imports: [RadialGaugeComponent],
  templateUrl: './characters-panel.component.html',
  styleUrl: './characters-panel.component.scss',
})
export class CharactersPanelComponent {
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
}
