import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaveService } from '../save.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-unit',
  template: `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">Units</li>
        <li class="breadcrumb-item active" aria-current="page">{{unit.name}}</li>
      </ol>
    </nav>
    <dl class="row">
      <dt class="col-sm-3">Name</dt>
      <dd class="col-sm-9">{{unit.name}}</dd>
      <dt class="col-sm-3">Vie</dt>
      <dd class="col-sm-9">{{unit.hp}}</dd>
      <dt class="col-sm-3">Attaque</dt>
      <dd class="col-sm-9">{{unit.att}}</dd>
      <dt class="col-sm-3">Défense</dt>
      <dd class="col-sm-9">{{unit.def}}</dd>
      <dt class="col-sm-3">Taux de critique</dt>
      <dd class="col-sm-9">{{unit.cc}}%</dd>
      <dt class="col-sm-3">Précision</dt>
      <dd class="col-sm-9">{{unit.prec}}</dd>
      <dt class="col-sm-3">Esquive</dt>
      <dd class="col-sm-9">{{unit.eva}}</dd>
      <dt class="col-sm-3">Vitesse</dt>
      <dd class="col-sm-9">{{unit.speed}}</dd>
      <dt class="col-sm-3">Récupération</dt>
      <dd class="col-sm-9">{{unit.regen}}HP/s</dd>
      <dt class="col-sm-3">Résistance magique</dt>
      <dd class="col-sm-9">{{unit.magicRes}}%</dd>
      <dt class="col-sm-3">Résistance physique</dt>
      <dd class="col-sm-9">{{unit.physicRes}}%</dd>
      <dt class="col-sm-3">Vol de vie</dt>
      <dd class="col-sm-9">{{unit.lifeSteal}}</dd>
    </dl>
    LV {{unit.lvl}} LV {{unit.lvl}} LV {{unit.lvl}} LV {{unit.lvl}} +
    <i class="fas fa-coins"></i>{{save.gils}} / {{gilsRequired}}
    <i class="fas fa-angle-double-down"></i>{{save.exp}} / {{expRequired}}
    <button type="button" class="btn btn-primary" [disabled]="!canLevelUp()" (click)="levelUp()">Nv. supérieur</button>
  `,
  styles: []
})
export class UnitComponent implements OnInit {

  public unit;
  public gilsRequired;
  public expRequired;

  constructor(
    private route: ActivatedRoute,
    public save: SaveService,
    public game: GameService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const characters = this.save.characters;
      this.unit = characters.find(elt => elt.id === params.id);
      this.gilsRequired = this.unit.lvl * 5;
      this.expRequired = this.unit.lvl * 10;
    });
  }

  canLevelUp() {
    let res = false;
    if (this.save.gils >= this.gilsRequired && this.save.exp >= this.expRequired) {
      res = true;
    }
    return res;
  }

  levelUp() {
    this.save.gils -= this.gilsRequired;
    this.save.exp -= this.expRequired;
    this.unit.lvl += 1;
    this.game.register();
  }

}
