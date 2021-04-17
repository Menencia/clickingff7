import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { MAX_ITEMS } from '../models/item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {

  MAX_ITEMS = MAX_ITEMS;

  constructor(public game: GameService) {}

}
