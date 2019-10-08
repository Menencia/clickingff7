import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story',
  template: `
    <h1>Story</h1>
    <div>Chapter: {{game.game.story.chapter}}</div>
    <div>Part: {{game.game.story.part}}</div>
    <button (click)="prepareFight()">Fight</button>
  `,
  styles: []
})
export class StoryComponent implements OnInit {

  constructor(
    public game: GameService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Go to fight preparation
   */
  prepareFight() {
    this.router.navigateByUrl('/prepareFight');
  }

}
