import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-equip',
  templateUrl: './equip.component.html',
  styleUrls: ['./equip.component.scss']
})
export class EquipComponent {

  constructor(public game: GameService, public router: Router) {
    // Redirection
    if (!this.game.loaded) {
      this.router.navigateByUrl('game');
    }
  }

}
