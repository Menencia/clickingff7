import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { Enemies } from '@shared/models/units/enemies';

@Component({
  selector: 'app-enemies-panel',
  imports: [ProgressBarComponent, TranslateModule],
  templateUrl: './enemies-panel.component.html',
})
export class EnemiesPanelComponent {
  enemies = input<Enemies | undefined>(undefined);

  round(value: number): number {
    return Math.round(value);
  }
}
