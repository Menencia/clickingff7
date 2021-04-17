import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  constructor(public game: GameService) { }

}
