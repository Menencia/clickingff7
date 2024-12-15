import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from 'src/app/core/services/player.service';
import { Character } from 'src/app/models/character';
import { Team } from 'src/app/models/team';
import { Weapon } from 'src/app/models/weapon';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';
import { WeaponIconComponent } from 'src/app/shared/ui/weapon-icon/weapon-icon.component';

@Component({
  selector: 'app-view-equip',
  standalone: true,
  imports: [UiLayoutDefaultComponent, TranslateModule, WeaponIconComponent, ButtonComponent],
  templateUrl: './view-equip.component.html',
  styleUrls: ['./view-equip.component.scss'],
})
export class ViewEquipComponent {
  selected: Character;

  team: Team;

  weapons: Weapon[] = [];

  constructor(private playerService: PlayerService) {
    this.team = this.playerService.team;
    const [first] = this.team.list;
    this.selected = first;
    this.weapons = this.playerService.weapons.getAllWeapons(this.selected);
  }

  canEquipWeapon(weapon: Weapon): boolean {
    return !this.playerService.characters.isWeaponEquipped(weapon);
  }

  equipWeapon(newWeapon: Weapon): void {
    this.selected.weapon = newWeapon;
    this.playerService.team.refresh();
  }

  selectCharacter(character: Character): void {
    this.selected = character;
    this.weapons = this.playerService.weapons.getAllWeapons(character);
  }
}
