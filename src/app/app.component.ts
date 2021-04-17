import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from './game.service';
import { HttpClient } from '@angular/common/http';
import * as introJs from 'intro.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clickingff7';

  constructor(
    public game: GameService,
    public router: Router,
    public http: HttpClient
  ) {}

  /**
   * Go to the game
   */
  goGame(): void {
    this.router.navigateByUrl('game');
  }

  /**
   * Go to the map
   */
  goMap(): void {
    if (!this.game.battle.isBattle) {
      this.router.navigateByUrl('map');
    }
  }

  /**
   * Go to the shop
   */
  goShop(): void {
    if (!this.game.battle.isBattle) {
      this.router.navigateByUrl('shop');
    }
  }

  /**
   * Go to the items
   */
  goItems(): void {
    if (!this.game.battle.isBattle) {
      this.router.navigateByUrl('items');
    }
  }

  /**
   * Go to the weapons
   */
  goEquip(): void {
    if (!this.game.battle.isBattle) {
      this.router.navigateByUrl('equip');
    }
  }

  /**
   * Go to the materias
   */
  goMateria(): void {
    if (!this.game.battle.isBattle) {
      this.router.navigateByUrl('materia');
    }
  }

  /**
   * Go to the game configuration
   */
  goConfig(): void {
    if (!this.game.battle.isBattle) {
      this.router.navigateByUrl('config');
    }
  }

  /**
   * Go to the PHS
   */
  goPHS(): void {
    if (!this.game.battle.isBattle && this.game.zones.levelMax >= 5) {
      this.router.navigateByUrl('phs');
    }
  }

  /**
   * Save the game
   */
  goSave(): void {
    if (!this.game.battle.isBattle) {
      this.router.navigateByUrl('save');
    }
  }

  // Show help
  help(): void {
    if (!this.game.battle.isBattle) {
      this.router.navigateByUrl('game');

      this.http.get('/assets/help/' + this.game.language + '.json')
        .subscribe((data) => {
          const intro = introJs();
          intro.setOptions(data);
          intro.start();
        });
    }
  }
}
