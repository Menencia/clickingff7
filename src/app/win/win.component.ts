import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-win',
  template: `
    <p>
      VICTOIRE
    </p>
    <div class="p-3">
      Diamants: {{diamonds}}<br />
      Gils: {{gils}}<br />
      Exp: {{exp}}
    </div>
    <button (click)="goNext()">Continue</button>
  `,
  styles: []
})
export class WinComponent implements OnInit {

  // rewards;
  diamonds;
  gils;
  exp;

  constructor(
    public router: Router,
    public game: GameService
  ) { }

  ngOnInit() {
    this.diamonds = 100;
    this.gils = 300;
    this.exp = 150;
    // rewards
    this.game.game.diamonds += this.diamonds;
    this.game.game.gils += this.gils;
    this.game.game.exp += this.exp;
    // progress in story
    let {chapter, part} = this.game.game.story;
    part++;
    if (part > 40) {
      chapter++;
      part = 1;
    }
    this.game.game.story = {chapter, part};
    this.game.save();
  }

  goNext() {
    this.router.navigateByUrl('/story');
  }

}
