import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>dashboard</h1>

    <div *ngIf="game.isConnected()">Game is on</div>

    <button (click)="exitGame()">Back to home</button>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {

  constructor(
    public game: GameService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Quit the current game
   */
  exitGame() {
    this.game.quit();
    this.router.navigateByUrl('/home');
  }

}
