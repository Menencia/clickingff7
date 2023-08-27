import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ItDisplayHits } from 'src/app/core/interfaces/it-display-hits';

@Component({
  selector: 'app-ui-bar',
  templateUrl: './ui-bar.component.html',
  styleUrls: ['./ui-bar.component.scss'],
  animations: [
    trigger('animation', [
      transition(':enter', [
        style({opacity: 1, top: -20}),
        animate('1s',
          style({opacity: 0, top: -40}))
      ])
    ])
  ]
})
export class UiBarComponent implements OnInit {

  Math = Math;

  @Input() id = '';
  @Input() progress = 0;
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

  onAnimationEvent($event: any) {
    const hits = this.arrHits.pop();
    if (!!hits) {
      hits.context.complete();
    }
  }

}
