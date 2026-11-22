import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable } from 'rxjs';
import { ItDisplayHits } from '../../../core/interfaces/it-display-hits';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  host: { class: 'block' },
})
export class ProgressBarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly progress = input(0);

  readonly style = input('progress-neutral');

  readonly text = input('');

  readonly hits = input<Observable<ItDisplayHits>>(EMPTY);

  readonly arrHits = signal<ItDisplayHits[]>([]);

  ngOnInit() {
    this.hits()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((hits) => {
        this.arrHits.update((arr) => [hits, ...arr]);
      });
  }

  onAnimationEvent() {
    this.arrHits.update((arr) => arr.slice(0, -1));
  }
}
