/* eslint-disable prettier/prettier */
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ItDisplayHits } from '@shared/interfaces/it-display-hits';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  Math = Math;

  @Input() id = '';

  @Input() progress = 0;

  @Input() text = '';

  @Input() name = '';

  @Input() hits = new Subject<ItDisplayHits>();

  public arrHits: ItDisplayHits[] = [];

  public progressBg = 0;

  private time!: ReturnType<typeof setTimeout>;

  private sub!: Subscription;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.progressBg = this.progress;
    this.sub = this.hits.subscribe((hits) => {
      setTimeout(() => {
        this.arrHits.unshift(hits);
        this.cdr.detectChanges();
      }, 0);

      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.progressBg = this.progress;
      }, 300);
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.time);
    this.sub.unsubscribe();
  }

  doneAnimation(id: string) {
    const found = this.arrHits.find((hits) => hits.id === id);
    if (found) {
      found.context.complete();
      this.arrHits = this.arrHits.filter((hits) => hits !== found);
    }
  }
}
