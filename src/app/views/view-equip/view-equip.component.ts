import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from 'src/app/core/services/game.service';
import { Character } from 'src/app/models/character';
import { Team } from 'src/app/models/team';
import { Weapon } from 'src/app/models/weapon';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';
import { WeaponIconComponent } from 'src/app/shared/ui/weapon-icon/weapon-icon.component';

@Component({
  selector: 'app-view-equip',
  standalone: true,
  imports: [
    UiLayoutDefaultComponent,
    TranslateModule,
    WeaponIconComponent,
    ButtonComponent,
  ],
  templateUrl: './view-equip.component.html',
  styleUrls: ['./view-equip.component.scss'],
})
export class ViewEquipComponent {
  selected: Character;

  team: Team;

  weapons: Weapon[] = [];

  constructor(private gameService: GameService) {
    this.team = this.gameService.team;
    const [first] = this.team.list;
    this.selected = first;
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

    this.gameService.team.refresh();
  }

  selectCharacter(character: Character): void {
    this.selected = character;
    this.weapons = this.gameService.weapons.getAllWeapons(character);
  }
}
