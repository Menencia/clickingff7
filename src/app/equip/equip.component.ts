import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-equip',
  templateUrl: './equip.component.html',
  styleUrls: ['./equip.component.scss']
})
export class EquipComponent {

  constructor(public game: GameService) {}

}
