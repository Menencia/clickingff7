import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prepare-fight',
  template: `
    <h1>Prepare fight</h1>

    <button (click)="fight()">Fight</button>
  `,
  styles: []
})
export class PrepareFightComponent implements OnInit {

  constructor(
    public game: GameService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  fight() {
    this.router.navigateByUrl('/fight');
  }

}
