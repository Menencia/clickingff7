import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveService } from '../save.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>dashboard</h1>

    <div *ngIf="game.isConnected()">Game infos</div>

    <ul>
      <li>saveKey: {{save.key}}</li>
      <li>rank: {{save.rank}}</li>
      <li>characters: {{save.characters.length}}</li>
    </ul>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {

  constructor(
    public save: SaveService,
    public game: GameService,
    public router: Router
  ) { }

  ngOnInit() {
  }

}
