import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-phs',
  templateUrl: './phs.component.html',
  styleUrls: ['./phs.component.scss']
})
export class PHSComponent {

  constructor(public game: GameService) {}

}
