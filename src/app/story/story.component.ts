import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-story',
  template: `
    <h1>Story</h1>
    <div>Chapter: {{game.game.story.chapter}}</div>
    <div>Part: {{game.game.story.part}}</div>
  `,
  styles: []
})
export class StoryComponent implements OnInit {

  constructor(public game: GameService) { }

  ngOnInit() {
  }

}
