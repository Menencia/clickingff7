import { Component } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { Materia } from 'src/app/models/materia';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-materia',
  templateUrl: './view-materia.component.html',
  styleUrls: ['./view-materia.component.scss']
})
export class ViewMateriaComponent {

  faXmark = faXmark;
  faPlus = faPlus;
  list: Materia[] = [];
  maxMaterias = 0;

  constructor(private gameService: GameService) {
    this.list = this.gameService.materias.list;
    this.maxMaterias = this.gameService.characters.getMaxMaterias();
  }

  getNbrEquipped(): number {
    return this.gameService.materias.getEquipped().length;
  }

  canEquip(materia: Materia): boolean {
    return !materia.equipped && this.getNbrEquipped() < this.maxMaterias;
  }

  equip(materia: Materia): void {
    materia.equipped = true;

    this.gameService.characters.refresh();
  }

  unequip(materia: Materia): void {
    materia.equipped = false;

    this.gameService.characters.refresh();
  }

}
