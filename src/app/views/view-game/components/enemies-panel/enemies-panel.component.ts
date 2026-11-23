import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Enemies } from '../../../../models/units/enemies';
import { RadialGaugeComponent } from '../../../../shared/ui/radial-gauge/radial-gauge.component';
import { percent } from '../../../../shared/utils/math.utils';

@Component({
  selector: 'app-enemies-panel',
  imports: [RadialGaugeComponent, TranslatePipe],
  templateUrl: './enemies-panel.component.html',
  styleUrl: './enemies-panel.component.scss',
})
export class EnemiesPanelComponent {
  readonly enemies = input<Enemies>(new Enemies());

  readonly hpPercent = computed(() =>
    percent(this.enemies().hp(), this.enemies().hpMax()),
  );
}
