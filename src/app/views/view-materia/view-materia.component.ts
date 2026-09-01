import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { Materia } from '../../models/materia';
import { MateriaIconComponent } from '../../shared/ui/materia-icon/materia-icon.component';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-materia',
  imports: [
    UiLayoutDefaultComponent,
    FontAwesomeModule,
    TranslateModule,
    MateriaIconComponent,
  ],
  templateUrl: './view-materia.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./view-materia.component.scss'],
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
