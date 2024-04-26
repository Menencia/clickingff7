import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Enemies } from 'src/app/models/units/enemies';
import { ProgressBarComponent } from 'src/app/shared/ui/progress-bar/progress-bar.component';

@Component({
  selector: 'app-enemies-panel',
  standalone: true,
  imports: [ProgressBarComponent, TranslateModule, NgFor, NgIf],
  templateUrl: './enemies-panel.component.html',
  styleUrl: './enemies-panel.component.scss',
})
export class EnemiesPanelComponent {
  @Input() enemies: Enemies = new Enemies();

  public round(value: number): number {
    return Math.round(value);
  }
}
