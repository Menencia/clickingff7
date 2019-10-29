import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-win',
  template: `
    <p>
      win works!
    </p>
    <button (click)="goNext()">Continue</button>
  `,
  styles: []
})
export class WinComponent implements OnInit {

  constructor(
    public router: Router,
    public game: GameService
  ) { }

  ngOnInit() {
  }

  goNext() {
    // progress in story
    let {chapter, part} = this.game.game.story;
    part++;
    if (part > 40) {
      chapter++;
      part = 1;
    }
    this.game.game.story = {chapter, part};
    this.game.save();

    this.router.navigateByUrl('/story');
  }

}
