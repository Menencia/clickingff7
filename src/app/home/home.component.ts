import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <p>
      <button type="button" class="btn btn-outline-primary" (click)="newSave()">New game</button>
    </p>
    <div *ngIf="saves.length > 0">
      Saves :
      <ul class="list-group list-group-flush">
        <li class="list-group-item" *ngFor="let save of saves">
          <button class="btn btn-link" (click)="loadSave(save)">{{save}}</button>
          <button class="btn btn-outline-danger" (click)="deleteSave(save)">
            <fa-icon [icon]="['fas', 'times']"></fa-icon>
          </button>
        </li>
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
    this.refreshGames();
  }

  /**
   * Refresh games from localstorage
   */
  refreshGames() {
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

  /**
   * Delete save
   * @param save save
   */
  deleteSave(save) {
    this.game.delete(save);
    this.refreshGames();
  }

}
