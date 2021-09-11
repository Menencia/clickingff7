import { Component, Input, OnInit } from '@angular/core';
import { GameService } from 'src/app/game.service';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  Math = Math;

  @Input('progress') progress: number = 0;
  @Input('text') text: string = '';
  @Input('bgCurrent') bgCurrent: string = '';
  @Input('bgMax') bgMax: string = '';

  constructor(public game: GameService) { }

  ngOnInit(): void {
  }

}
