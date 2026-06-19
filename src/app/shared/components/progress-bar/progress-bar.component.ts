import { Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ItDisplayHits } from '@shared/interfaces/it-display-hits';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  Math = Math;

  id = input('');

  progress = input(0);

  text = input('');

  name = input('');

  hits = input(new Subject<ItDisplayHits>());

  public arrHits = signal<ItDisplayHits[]>([]);

  private time?: ReturnType<typeof setTimeout>;

  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.hits().subscribe((hits) => {
      this.arrHits.update((arrHits) => {
        arrHits.unshift(hits);
        return arrHits;
      });
      setTimeout(() => {
        hits.context.complete();
        this.arrHits.set([]);
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.time);
    this.sub?.unsubscribe();
  }
}
