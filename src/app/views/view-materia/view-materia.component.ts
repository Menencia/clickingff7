import { Component } from '@angular/core';
import { LucidePlus, LucideX } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { Materia } from '../../models/materia';
import { MateriaIconComponent } from '../../shared/ui/materia-icon/materia-icon.component';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-materia',
  imports: [
    UiLayoutDefaultComponent,
    TranslatePipe,
    MateriaIconComponent,
    LucidePlus,
    LucideX,
  ],
  templateUrl: './view-materia.component.html',
  styleUrls: ['./view-materia.component.scss'],
})
export class ViewMateriaComponent {
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
