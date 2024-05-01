import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/character';
import { Weapon } from 'src/app/models/weapon';
import { Zone } from 'src/app/models/zone';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private data: DataService) {}

  getZone(ref: string): Zone {
    const found = this.data.zones.find((zone) => zone.ref === ref);
    if (found) {
      return found;
    }
    throw new Error(`Zone ${ref} not found`);
  }

  getWeapon(ref: string): Weapon {
    const found = this.data.weapons.find((weapon) => weapon.ref === ref);
    if (found) {
      return found;
    }
    throw new Error(`Weapon ${ref} not found`);
  }

  getCharacter(ref: string): Character {
    const found = this.data.characters.find(
      (character) => character.ref === ref,
    );
    if (found) {
      return found;
    }
    throw new Error(`Character ${ref} not found`);
  }
}
