import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';
import { MAX_ITEMS } from '../models/item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {

  MAX_ITEMS = MAX_ITEMS;

  constructor(public game: GameService, public router: Router) {
    // Redirection
    if (!this.game.loaded) {
      this.router.navigateByUrl('game');
    }
  }

}
