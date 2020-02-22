import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <p>
      <button type="button" class="btn btn-outline-primary" (click)="newSave()">New game</button>
    </p>
    <div>
      Saves :
      <ul>
        <li *ngFor="let save of saves" (click)="loadSave(save)">{{save}}</li>
      </ul>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {

  saves;

  constructor(
    public game: GameService,
    public router: Router
  ) { }

  ngOnInit() {
    this.saves = this.game.getGames();
  }

  /**
   * Start a new game
   */
  newSave() {
    this.game.newGame();
    this.router.navigateByUrl('/dashboard');
  }

  /**
   * Load a game
   */
  loadSave(save) {
    this.game.load(save);
    this.router.navigateByUrl('/dashboard');
  }

}
