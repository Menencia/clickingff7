import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveService } from '../save.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-win',
  template: `
    <p>
      VICTOIRE
    </p>
    <div class="p-3">
      <i class="far fa-gem"></i> {{gems}}<br />
      <i class="fas fa-coins"></i> {{gils}}<br />
      <i class="fas fa-angle-double-down"></i> {{exp}}
    </div>
    <button (click)="goNext()">Continue</button>
  `,
  styles: []
})
export class WinComponent implements OnInit {

  // rewards;
  gems;
  gils;
  exp;

  constructor(
    public router: Router,
    public save: SaveService,
    public game: GameService
  ) { }

  ngOnInit() {
    this.gems = 100;
    this.gils = 300;
    this.exp = 150;
    // rewards
    this.save.gems += this.gems;
    this.save.gils += this.gils;
    this.save.exp += this.exp;
    // progress in story
    let {chapter, part} = this.save.story;
    part++;
    if (part > 40) {
      chapter++;
      part = 1;
    }
    this.save.story = {chapter, part};
    this.game.register();
  }

  goNext() {
    this.router.navigateByUrl('/story');
  }

}
