import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clickingff7';

  constructor(
    public game: GameService,
    public router: Router
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
    // if (!Game.battle.isBattle) {
    //   $location.path("/game");

    //   $http({method: 'GET', url: 'help/' + Game.language + '.json'}).
    //     success(function (data, status, headers, config) {
    //       var intro = introJs();
    //       intro.setOptions(data);
    //       intro.start();
    //     }).
    //     error(function (data, status, headers, config) {
    //       // called asynchronously if an error occurs
    //       // or server returns response with an error status.
    //     });
    // }
  }
}
