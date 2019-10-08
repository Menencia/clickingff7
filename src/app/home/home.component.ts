import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  template: `
    <p>
      <button (click)="newSave()">New game</button>
    </p>
    <p>
      Saves
    </p>
    <div *ngFor="let save of saves">
      {{save.number}}
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {

  saves: [];

  constructor(
    public game: GameService,
    public location: Location
  ) { }

  ngOnInit() {
  }

  /**
   * Start a new game
   */
  newSave() {
    this.game.newGame();
    this.location.go('/dashboard');
  }

}
