import { Component, inject } from '@angular/core';
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

  selected: Character;

  team: Character[];

  weapons: Weapon[] = [];

  constructor() {
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
    return this.gameService.canEquipWeapon(this.selected, weapon);
  }

  equipWeapon(weapon: Weapon): void {
    this.gameService.equipWeapon(this.selected, weapon);
  }

  selectCharacter(character: Character): void {
    this.gameService.characters.select(character);
    this.selected = character;
    this.weapons = this.gameService.weapons.getAllWeapons(character);
  }
}
