import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>dashboard</h1>

    <div *ngIf="game.isConnected()">Game infos</div>

    <ul>
      <li>saveKey: {{game.game.saveKey}}</li>
      <li>rank: {{game.game.rank}}</li>
      <li>characters: {{game.game.characters.length}}</li>
    </ul>
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

}
