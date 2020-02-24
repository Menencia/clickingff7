import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveService } from '../save.service';

@Component({
  selector: 'app-story',
  template: `
    <h1>Story</h1>
    <div>Chapter: {{save.story.chapter}}</div>
    <div>Part: {{save.story.part}}</div>
    <button (click)="prepareFight()">Fight</button>
  `,
  styles: []
})
export class StoryComponent implements OnInit {

  constructor(
    public save: SaveService,
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
