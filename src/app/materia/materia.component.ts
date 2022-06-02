import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Materia } from '../models/materia';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.scss']
})
export class MateriaComponent {

  list: Materia[] = [];
  nbrEquipped = 0;
  maxMaterias = 0;

  constructor(public gameService: GameService) {
    this.list = this.gameService.materias.list;
    this.nbrEquipped = this.gameService.materias.getEquipped().length;
    this.maxMaterias = this.gameService.getMaxMaterias();
  }

  canEquip(materia: Materia): boolean {
    return !materia.equipped && this.nbrEquipped < this.maxMaterias;
  }

  equip(materia: Materia): void {
    materia.equipped = true;

    this.gameService.refreshCharacters();
  }

  unequip(materia: Materia): void {
    materia.equipped = false;

    this.gameService.refreshCharacters();
  }

}
