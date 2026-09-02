import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./view-equip.component.scss'],
})
export class ViewEquipComponent {
  selected: Character;

  team: Character[];

  weapons: Weapon[] = [];

  constructor(private gameService: GameService) {
    this.team = this.gameService.characters.getTeam();
    this.selected = this.gameService.characters.selected;
    const found = this.team.find((character) => character === this.selected);
    if (!found) {
      const [first] = this.team;
      this.selected = first;
    }
    this.weapons = this.gameService.weapons.getAllWeapons(this.selected);
  }

  canEquipWeapon(weapon: Weapon): boolean {
    return !weapon.equipped;
  }

  equipWeapon(newWeapon: Weapon): void {
    // find current equipped weapon
    const currentWeapon = this.gameService.weapons.list.find(
      (weapon: Weapon) => {
        return weapon.type === newWeapon.type && weapon.equipped;
      },
    );

    if (currentWeapon) {
      currentWeapon.equipped = false;
    }

    // mark both weapon and character as equipped
    newWeapon.equipped = true;
    this.selected.weapon = newWeapon;

    this.gameService.characters.refresh();
  }

  selectCharacter(character: Character): void {
    this.gameService.characters.select(character);
    this.selected = character;
    this.weapons = this.gameService.weapons.getAllWeapons(character);
  }
}
