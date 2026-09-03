import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Enemies } from '../../../../models/units/enemies';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';

@Component({
  selector: 'app-enemies-panel',
  imports: [ProgressBarComponent, TranslatePipe],
  templateUrl: './enemies-panel.component.html',
  styleUrl: './enemies-panel.component.scss',
})
export class EnemiesPanelComponent {
  @Input() enemies: Enemies = new Enemies();

  public round(value: number): number {
    return Math.round(value);
  }
}
