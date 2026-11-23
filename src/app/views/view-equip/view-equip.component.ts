import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { Character } from '../../models/character';
import { Weapon } from '../../models/weapon';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';
import { WeaponIconComponent } from '../../shared/ui/weapon-icon/weapon-icon.component';

@Component({
  selector: 'app-view-equip',
  imports: [UiLayoutDefaultComponent, TranslatePipe, WeaponIconComponent],
  templateUrl: './view-equip.component.html',
  styleUrls: ['./view-equip.component.scss'],
})
export class ViewEquipComponent {
  private gameService = inject(GameService);

  readonly team = this.gameService.characters.team;

  readonly selected = this.gameService.characters.selected;

  /** owned weapons of the selected character's type */
  readonly weapons = computed(() => {
    const selected = this.selected();
    return selected ? this.gameService.weapons.getAllWeapons(selected) : [];
  });

  canEquipWeapon(weapon: Weapon): boolean {
    const selected = this.selected();
    return !!selected && this.gameService.canEquipWeapon(selected, weapon);
  }

  equipWeapon(weapon: Weapon): void {
    const selected = this.selected();
    if (selected) {
      this.gameService.equipWeapon(selected, weapon);
    }
  }

  selectCharacter(character: Character): void {
    this.gameService.characters.select(character);
  }
}
