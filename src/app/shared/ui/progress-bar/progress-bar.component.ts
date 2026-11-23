import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  host: { class: 'block' },
})
export class ProgressBarComponent {
  readonly progress = input(0);

  readonly style = input('progress-neutral');

  readonly text = input('');
}
