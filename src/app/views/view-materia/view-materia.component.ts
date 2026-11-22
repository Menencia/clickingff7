import { Component, inject } from '@angular/core';
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
  private gameService = inject(GameService);

  list: Materia[] = [];

  readonly maxMaterias = this.gameService.characters.maxMaterias;

  constructor() {
    this.list = this.gameService.materias.list;
  }

  getNbrEquipped(): number {
    return this.gameService.materias.getEquipped().length;
  }

  canEquip(materia: Materia): boolean {
    return this.gameService.materias.canEquip(materia, this.maxMaterias());
  }

  equip(materia: Materia): void {
    this.gameService.materias.equip(materia, this.maxMaterias());
  }

  unequip(materia: Materia): void {
    this.gameService.materias.unequip(materia);
  }
}
