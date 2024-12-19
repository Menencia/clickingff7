import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/character';
import { Enemy } from 'src/app/models/enemy';
import { Item } from 'src/app/models/item';
import { Materia } from 'src/app/models/materia';
import { CharacterRef } from 'src/app/models/refs/characters';
import { EnemyRef } from 'src/app/models/refs/enemy';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { ZoneRef } from 'src/app/models/refs/zones';
import { CharacterSave, ItemSave, MateriaSave, ZoneSave } from 'src/app/models/save';
import { Weapon } from 'src/app/models/weapon';
import { Zone } from 'src/app/models/zone';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private data: DataService) {}

  /** Returns a Zone from given ref & filled with save */
  getZone(ref: ZoneRef, save?: ZoneSave): Zone {
    const data = this.data.getZone(ref);
    const enemies = data.enemies.map((e) => this.getEnemy(e));
    const boss = data.boss.map((e) => this.getEnemy(e));
    return new Zone(data, enemies, boss, save?.nbFights, save?.completed);
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
