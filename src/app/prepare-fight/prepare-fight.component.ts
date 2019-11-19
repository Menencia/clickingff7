import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { Unit } from '../unit';
import { BattleService } from '../battle.service';
import { HttpClient } from '@angular/common/http';
import { BuilderService } from '../builder.service';

@Component({
  selector: 'app-prepare-fight',
  template: `
    <h1>Prepare fight</h1>

    <div class="container">
      <div class="row">
        <div class="col-sm team">
          <div class="unit" *ngFor="let unit of team" (click)="removeFromTeam(unit)">
            {{ unit.name }} Lv.{{ unit.lvl }}
          </div>
        </div>
        <div class="col-sm enemies">
          <div class="unit" *ngFor="let unit of enemies">
            {{ unit.name }} Lv.{{ unit.lvl }}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="units">
          <div class="unit" *ngFor="let unit of units" (click)="addToTeam(unit)">
            {{ unit.name }} Lv.{{ unit.lvl }}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm text-center">
          <button (click)="fight()" class="btn btn-primary" [disabled]="team.length === 0">
            Fight
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .team {
      display: inline-block;
    }
    .enemies {
      display: inline-block;
    }
  `]
})
export class PrepareFightComponent implements OnInit {

  team;
  enemies;
  units;

  constructor(
    public battle: BattleService,
    public game: GameService,
    public router: Router,
    public http: HttpClient,
    public builder: BuilderService
  ) { }

  ngOnInit() {
    this.team = [];
    this.enemies = [];
    this.http.get('assets/enemies.json')
      .subscribe(data => {
        const progress = this.game.game.getProgress();
        if (progress in data) {
          for (const unitInfos of data[progress]) {
            const unit = this.builder.buildUnit(unitInfos);
            this.enemies.push(
              unit
            );
          }
        }
      });
    this.units = this.game.game.characters;
  }

  /**
   * Add unit to team
   * @param unit unit to add
   */
  addToTeam(unit: Unit) {
    const found = this.team.find((u: Unit) => {
      return u.name === unit.name;
    });
    const full = this.team.length === 5;
    if (!found && !full) {
      this.team.push(unit);
    }
  }

  /**
   * Remove unit from team
   * @param unit unit to remove
   */
  removeFromTeam(unit: Unit) {
    const foundIndex = this.team.findIndex((u: Unit) => {
      return u.name === unit.name;
    });
    if (foundIndex >= 0) {
      this.team.splice(foundIndex, 1);
    }
  }

  fight() {
    this.battle.team = this.team;
    this.battle.enemies = this.enemies;
    this.router.navigateByUrl('/fight');
  }

}
