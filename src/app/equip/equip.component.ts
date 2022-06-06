import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Character } from '../models/character';
import { Weapon } from '../models/weapon';

@Component({
  selector: 'app-equip',
  templateUrl: './equip.component.html',
  styleUrls: ['./equip.component.scss']
})
export class EquipComponent {

  selected: Character;
  team: Character[];
  otherWeapons: Weapon[] = [];

  constructor(public gameService: GameService) {
    this.selected = this.gameService.characters.selected;
    this.team = this.gameService.characters.getTeam();
    this.otherWeapons = this.gameService.weapons.getOthers(this.selected);
  }

  equipWeapon(newWeapon: Weapon): void {
    // find current equipped weapon
    const currentWeapon = this.gameService.weapons.list.find((weapon: Weapon) => {
      return weapon.type === newWeapon.type && weapon.equipped;
    });

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
    this.otherWeapons = this.gameService.weapons.getOthers(character);
  }

}
