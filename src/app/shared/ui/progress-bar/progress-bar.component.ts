import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ItDisplayHits } from '../../../core/interfaces/it-display-hits';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
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
    this.hits.subscribe((hits) => {
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
