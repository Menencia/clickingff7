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
  currentWeapon: Weapon;
  otherWeapons: Weapon[] = [];

  constructor(public gameService: GameService) {
    this.selected = this.gameService.characters.selected;
    this.team = this.gameService.characters.getTeam();
    this.currentWeapon = this.gameService.weapons.getCurrent(this.selected);
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

    // then equipped this one
    newWeapon.equipped = true;

    this.gameService.refreshCharacters();
  }

  selectCharacter(character: Character): void {
    this.gameService.characters.select(character);
    this.selected = character;
    this.currentWeapon = this.gameService.weapons.getCurrent(character);
    this.otherWeapons = this.gameService.weapons.getOthers(character);
  }

  getHits(character: Character): number {
    const weapon = this.gameService.weapons.getCurrent(character);
    return character.getHits(weapon);
  }

}
