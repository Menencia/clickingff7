import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {

  constructor(public game: GameService) {}

  changeSection(s: string): void {
    this.game.shop.section = s;
  }

  changeType(t: string): void {
    this.game.shop.type = t;
  }

}
