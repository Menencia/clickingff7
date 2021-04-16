import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss']
})
export class MateriaComponent {

  constructor(public game: GameService, public router: Router) {
    // Redirection
    if (!this.game.loaded) {
      this.router.navigateByUrl('game');
    }
  }

}
