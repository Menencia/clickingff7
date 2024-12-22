import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { Enemies } from '@shared/models/units/enemies';

@Component({
  selector: 'app-enemies-panel',
  standalone: true,
  imports: [ProgressBarComponent, TranslateModule],
  templateUrl: './enemies-panel.component.html',
  styleUrl: './enemies-panel.component.scss',
})
export class EnemiesPanelComponent {
  @Input() enemies: Enemies = new Enemies();

  public round(value: number): number {
    return Math.round(value);
  }
}
