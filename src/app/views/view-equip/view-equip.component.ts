import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { WeaponIconComponent } from '@shared/components/weapon-icon/weapon-icon.component';
import { Character } from '@shared/models/character';
import { Team } from '@shared/models/team';
import { Weapon } from '@shared/models/weapon';
import { PlayerService } from '@shared/services/player.service';

@Component({
    selector: 'app-view-equip',
    imports: [UiLayoutDefaultComponent, TranslateModule, WeaponIconComponent, ButtonComponent],
    templateUrl: './view-equip.component.html',
    styleUrls: ['./view-equip.component.scss']
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
