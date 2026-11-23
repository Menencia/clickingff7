import { Component, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { ItDisplayHits } from '../../../core/interfaces/it-display-hits';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  host: { class: 'block' },
})
export class ProgressBarComponent {
  readonly progress = input(0);

  readonly style = input('progress-neutral');

  readonly text = input('');

  readonly hits = input<Observable<ItDisplayHits>>(EMPTY);

  readonly arrHits = signal<ItDisplayHits[]>([]);

  constructor() {
    // Follow the latest stream given to the input, dropping the previous one.
    toObservable(this.hits)
      .pipe(
        switchMap((hits) => hits),
        takeUntilDestroyed(),
      )
      .subscribe((hits) => {
        this.arrHits.update((arr) => [hits, ...arr]);
      });
  }

  onAnimationEvent() {
    this.arrHits.update((arr) => arr.slice(0, -1));
  }
}
