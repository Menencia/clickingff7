import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss']
})
export class MateriaComponent {

  constructor(public game: GameService) {}

}
