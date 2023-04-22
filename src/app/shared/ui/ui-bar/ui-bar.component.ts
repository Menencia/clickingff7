import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-bar',
  templateUrl: './ui-bar.component.html',
  styleUrls: ['./ui-bar.component.scss']
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
