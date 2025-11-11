import { Injectable } from '@angular/core';
import { Character } from '@shared/models/character';
import { Enemy } from '@shared/models/enemy';
import { Item } from '@shared/models/item';
import { Materia } from '@shared/models/materia';
import { CharacterRef } from '@shared/models/refs/characters';
import { EnemyRef } from '@shared/models/refs/enemy';
import { ItemRef } from '@shared/models/refs/items';
import { MateriaRef } from '@shared/models/refs/materias';
import { WeaponRef } from '@shared/models/refs/weapons';
import { ZoneRef } from '@shared/models/refs/zones';
import {
  CharacterSave,
  ItemSave,
  MateriaSave,
  ZoneSave,
} from '@shared/models/save';
import { Weapon } from '@shared/models/weapon';
import { Zone } from '@shared/models/zone';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private data: DataService) {}

  /** Returns a Zone from given ref & filled with save */
  getZone(ref: ZoneRef, save?: ZoneSave): Zone {
    const data = this.data.getZone(ref);
    return new Zone(data, save?.nbFights, save?.completed);
  }

  /** Returns an Enemy from given ref */
  getEnemy(ref: EnemyRef): Enemy {
    const data = this.data.getEnemy(ref);
    return new Enemy(data);
  }

  /** Returns a Weapon from given ref & filled with save */
  getWeapon(ref: WeaponRef): Weapon {
    const data = this.data.getWeapon(ref);
    return new Weapon(data);
  }

  /** Returns a Character from given ref & filled with save */
  getCharacter(ref: CharacterRef, save?: Partial<CharacterSave>): Character {
    const data = this.data.getCharacter(ref);
    const weapon = this.getWeapon(save?.weaponRef ?? data.weapon);
    return new Character(data, weapon);
  }

  /** Returns an Item from given ref & filled with save */
  getItem(ref: ItemRef, save?: ItemSave): Item {
    const data = this.data.getItem(ref);
    return new Item(data, save?.nbr, save?.equipped);
  }

  /** Returns a Materia from given ref & filled with save */
  getMateria(ref: MateriaRef, save?: MateriaSave): Materia {
    const data = this.data.getMateria(ref);
    return new Materia(data, save?.level, save?.ap, save?.equipped);
  }
}
