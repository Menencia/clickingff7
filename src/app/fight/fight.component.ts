import { Component, OnInit } from '@angular/core';
import { BattleService } from '../battle.service';
import { BattleUnit } from '../battle-unit';

@Component({
  selector: 'app-fight',
  template: `
    <div class="team">
      <div class="unit" *ngFor="let unit of team">
        {{ unit.unit.name }} Lv.{{ unit.unit.lvl }} HP{{unit.hp}}
      </div>
    </div>
    <div class="enemies">
      <div class="unit" *ngFor="let unit of enemies">
        {{ unit.name }} Lv.{{ unit.lvl }} HP{{unit.hp}}
      </div>
    </div>
    <div></div>
  `,
  styles: []
})
export class FightComponent implements OnInit {

  team;
  enemies;

  timer;
  pause;

  constructor(public battle: BattleService) { }

  ngOnInit() {
    this.team = [];
    for (const unit of this.battle.team) {
      this.team.push(new BattleUnit(unit, this));
    }
    this.enemies = [];
    for (const unit of this.battle.enemies) {
      this.enemies.push(new BattleUnit(unit, this));
    }

    this.play();
  }

  /**
   * Launch the battle
   */
  play() {
    this.pause = false;
    for (const unit of this.team) {
      unit.action();
    }
    for (const unit of this.enemies) {
      unit.action();
    }
    if (this.isBattleEnded()) {
      console.log('battle ended');
      return;
    }
    setTimeout(() => {
      this.play();
    }, 2000);
  }

  /**
   * Returns true if battle is ended
   */
  isBattleEnded() {
    let sumEnemiesHp = 0;
    for (const unit of this.enemies) {
      sumEnemiesHp += unit.hp;
    }
    return sumEnemiesHp === 0;
  }

}
