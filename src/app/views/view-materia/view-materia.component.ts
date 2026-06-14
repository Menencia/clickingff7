import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MateriaIconComponent } from '@shared/components/materia-icon/materia-icon.component';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { Materia } from '@shared/models/materia';
import { PlayerService } from '@shared/services/player.service';
import { LucideAngularModule, MinusIcon, PlusIcon } from 'lucide-angular';

@Component({
  selector: 'app-view-materia',
  imports: [
    UiLayoutDefaultComponent,
    TranslateModule,
    MateriaIconComponent,
    LucideAngularModule,
  ],
  templateUrl: './view-materia.component.html',
})
export class ViewMateriaComponent {
  list: Materia[] = [];

  maxMaterias = 0;

  readonly PlusIcon = PlusIcon;
  readonly MinusIcon = MinusIcon;

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

  equip(materia: Materia) {
    materia.equipped = true;

    this.playerService.team.refresh();
  }

  unequip(materia: Materia) {
    materia.equipped = false;

    this.playerService.team.refresh();
  }
}
