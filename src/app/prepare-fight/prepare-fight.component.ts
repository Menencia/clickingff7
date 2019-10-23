import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { Unit } from '../unit';
import { Game } from '../game';
import { FirstRay } from '../units/enemies/first-ray';
import { BattleService } from '../battle.service';

@Component({
  selector: 'app-prepare-fight',
  template: `
    <h1>Prepare fight</h1>

    <div class="team">
      <div class="unit" *ngFor="let unit of team">
        {{ unit.name }} Lv.{{ unit.lvl }}
      </div>
    </div>
    <div class="enemies">
      <div class="unit" *ngFor="let unit of enemies">
        {{ unit.name }} Lv.{{ unit.lvl }}
      </div>
    </div>

    <div class="units">
      <div class="unit" *ngFor="let unit of units" (click)="addToTeam(unit)">
        {{ unit.name }} Lv.{{ unit.lvl }}
      </div>
    </div>

    <button (click)="fight()">Fight</button>
  `,
  styles: []
})
export class PrepareFightComponent implements OnInit {

  team;
  enemies;
  units;

  constructor(
    public battle: BattleService,
    public game: GameService,
    public router: Router
  ) { }

  ngOnInit() {
    this.team = [];
    this.enemies = [
      new FirstRay()
    ];
    this.units = this.game.game.characters;
  }

  /**
   * Add unit to team
   * @param unit unit to add
   */
  addToTeam(unit: Unit) {
    this.team.push(unit);
  }

  fight() {
    this.battle.team = this.team;
    this.battle.enemies = this.enemies;
    this.router.navigateByUrl('/fight');
  }

}
