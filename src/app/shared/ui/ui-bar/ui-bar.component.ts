import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

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
export class UiBarComponent {

  Math = Math;

  @Input() id: string = '';
  @Input() progress: number = 0;
  @Input() text: string = '';
  @Input() name: string = '';
  @Input() hits: number[] = [];

  constructor() { }

  onAnimationEvent($event: any) {
    this.hits.pop();
  }

}
