import { Component, DestroyRef, Input, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { ItDisplayHits } from '../../../core/interfaces/it-display-hits';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  Math = Math;

  @Input() id = '';

  @Input() progress = 0;

  @Input() style = 'progress-neutral';

  @Input() text = '';

  @Input() name = '';

  @Input() hits = new Subject<ItDisplayHits>();

  public arrHits: ItDisplayHits[] = [];

  public progressBg = 0;

  private time!: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.progressBg = this.progress;
    this.destroyRef.onDestroy(() => clearTimeout(this.time));
    this.hits.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((hits) => {
      this.arrHits.unshift(hits);

      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.progressBg = this.progress;
      }, 300);
    });
  }

  onAnimationEvent() {
    this.arrHits.pop();
  }
}
