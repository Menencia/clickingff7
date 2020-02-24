import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveService } from '../save.service';

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
    public save: SaveService,
    public router: Router
  ) { }

  ngOnInit() {
    this.characters = this.save.characters;
  }

  /**
   * Go to unit profile
   */
  goUnit(unit) {
    this.router.navigateByUrl('/unit/' + unit.id);
  }

}
