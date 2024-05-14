import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from 'src/app/core/services/game.service';
import { Materia } from 'src/app/models/materia';
import { MateriaIconComponent } from 'src/app/shared/ui/materia-icon/materia-icon.component';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-materia',
  standalone: true,
  imports: [
    UiLayoutDefaultComponent,
    FontAwesomeModule,
    TranslateModule,
    NgFor,
    NgIf,
    MateriaIconComponent,
  ],
  templateUrl: './view-materia.component.html',
  styleUrls: ['./view-materia.component.scss'],
})
export class ViewMateriaComponent {
  faXmark = faXmark;

  faPlus = faPlus;

  list: Materia[] = [];

  maxMaterias = 0;

  constructor(private gameService: GameService) {
    this.list = this.gameService.materias.list;
    this.maxMaterias = this.gameService.team.getMaxMaterias();
  }

  getNbrEquipped(): number {
    return this.gameService.materias.getEquipped().length;
  }

  canEquip(materia: Materia): boolean {
    return !materia.equipped && this.getNbrEquipped() < this.maxMaterias;
  }

  equip(materia: Materia): void {
    materia.equipped = true;

    this.gameService.team.refresh();
  }

  unequip(materia: Materia): void {
    materia.equipped = false;

    this.gameService.team.refresh();
  }
}
