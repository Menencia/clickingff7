import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/character';
import { Item } from 'src/app/models/item';
import { Materia } from 'src/app/models/materia';
import { CharacterRef } from 'src/app/models/refs/characters';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { ZoneRef } from 'src/app/models/refs/zones';
import { MateriaSave, WeaponSave, ZoneSave } from 'src/app/models/save';
import { Weapon } from 'src/app/models/weapon';
import { Zone } from 'src/app/models/zone';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private data: DataService) {}

  getZone(ref: ZoneRef, save?: ZoneSave): Zone {
    const found = this.data.zones.find((zone) => zone.data.ref === ref);
    if (found) {
      if (save) found.load(save);
      return found;
    }
    throw new Error(`Zone ${ref} not found`);
  }

  getWeapon(ref: WeaponRef, save?: WeaponSave): Weapon {
    const found = this.data.weapons.find((weapon) => weapon.data.ref === ref);
    if (found) {
      if (save) found.load(save);
      return found;
    }
    throw new Error(`Weapon ${ref} not found`);
  }

  getCharacter(ref: CharacterRef): Character {
    const found = this.data.characters.find((character) => character.ref === ref);
    if (found) {
      return found;
    }
    throw new Error(`Character ${ref} not found`);
  }

  getItem(ref: ItemRef): Item {
    const found = this.data.items.find((item) => item.ref === ref);
    if (found) {
      return found;
    }
    throw new Error(`Item ${ref} not found`);
  }

  getMateria(ref: MateriaRef, save?: MateriaSave): Materia {
    const found = this.data.materias.find((materia) => materia.data.ref === ref);
    if (found) {
      if (save) found.load(save);
      return found;
    }
    throw new Error(`Materia ${ref} not found`);
  }
}
