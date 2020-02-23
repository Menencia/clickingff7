import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-characters',
  template: `
    <ul class="list-group">
      <li *ngFor="let character of characters" class="list-group-item">
        <app-character-icon [unit]="character" (click)="goUnit(character)"></app-character-icon>
      </li>
    </ul>
  `,
  styles: []
})
export class CharactersComponent implements OnInit {

  public characters;

  constructor(
    public game: GameService,
    public router: Router
  ) { }

  ngOnInit() {
    this.characters = this.game.game.characters;
  }

  /**
   * Go to unit profile
   */
  goUnit(unit) {
    this.router.navigateByUrl('/unit/' + unit.id);
  }

}
