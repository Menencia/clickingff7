import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
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
export class BarComponent implements OnInit {

  Math = Math;

  @Input('progress') progress: number = 0;
  @Input('text') text: string = '';
  @Input('bgCurrent') bgCurrent: string = '';
  @Input('bgMax') bgMax: string = '';
  @Input('hits') hits: number[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  onAnimationEvent($event: any) {
    this.hits.pop();
  }

}
