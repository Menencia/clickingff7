import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Materia } from '@shared/models/materia';
import { PlayerService } from '@shared/services/player.service';
import { MateriaIconComponent } from 'src/app/shared/ui/materia-icon/materia-icon.component';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-materia',
  standalone: true,
  imports: [UiLayoutDefaultComponent, TranslateModule, MateriaIconComponent],
  templateUrl: './view-materia.component.html',
  styleUrls: ['./view-materia.component.scss'],
})
export class ViewMateriaComponent {
  list: Materia[] = [];

  maxMaterias = 0;

  constructor(private playerService: PlayerService) {
    this.list = this.playerService.materias.list;
    this.maxMaterias = this.playerService.team.getMaxMaterias();
  }

  getNbrEquipped(): number {
    return this.playerService.materias.getEquipped().length;
  }

  canEquip(materia: Materia): boolean {
    return !materia.equipped && this.getNbrEquipped() < this.maxMaterias;
  }

  equip(materia: Materia): void {
    materia.equipped = true;

    this.playerService.team.refresh();
  }

  unequip(materia: Materia): void {
    materia.equipped = false;

    this.playerService.team.refresh();
  }
}
