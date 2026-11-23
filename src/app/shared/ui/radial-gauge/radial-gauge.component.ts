import { Component, computed, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { ItDisplayHits } from '../../../models/units';

/**
 * Circular gauge. Its size comes from the host classes (e.g. `size-12`) and
 * the projected content (label or portrait) is centered inside the ring.
 */
@Component({
  selector: 'app-radial-gauge',
  imports: [],
  templateUrl: './radial-gauge.component.html',
  styleUrl: './radial-gauge.component.scss',
  host: {
    class: 'relative inline-grid place-items-center',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'progress()',
    '[attr.aria-label]': 'label() || null',
  },
})
export class RadialGaugeComponent {
  /** Filled part, from 0 to 100 */
  readonly progress = input(0);

  /** Text color class of the filled ring (e.g. `text-success`) */
  readonly color = input('text-neutral');

  /** Ring thickness, in units of a 36-unit wide gauge */
  readonly thickness = input(3);

  /** Accessible label (the ring has no visible text of its own) */
  readonly label = input('');

  readonly hits = input<Observable<ItDisplayHits>>(EMPTY);

  readonly arrHits = signal<ItDisplayHits[]>([]);

  readonly radius = computed(() => 18 - this.thickness() / 2);

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
