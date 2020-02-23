import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-characters',
  template: `
    <ul class="list-group">
      <li *ngFor="let character of characters">
        {{character.name}}
      </li>
    </ul>
  `,
  styles: []
})
export class CharactersComponent implements OnInit {

  public characters;

  constructor(
    public game: GameService
  ) { }

  ngOnInit() {
    this.characters = this.game.game.characters;
  }

}
