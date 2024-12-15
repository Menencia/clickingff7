import { Injectable } from '@angular/core';
import { Character } from 'src/app/models/character';
import { Enemy } from 'src/app/models/enemy';
import { Item } from 'src/app/models/item';
import { HpPotion } from 'src/app/models/items/hp-potion';
import { MpPotion } from 'src/app/models/items/mp-potion';
import { Materia } from 'src/app/models/materia';
import { AttackMateria } from 'src/app/models/materias/attack-materia';
import { CureMateria } from 'src/app/models/materias/cure-materia';
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
    switch (data.type) {
      case 'hp-potion':
        return new HpPotion(data, save?.nbr, save?.equipped);
      case 'mp-potion':
        return new MpPotion(data, save?.nbr, save?.equipped);
      default:
        throw new Error(`Item of type ${data.type} not found`);
    }
  }

  /** Returns a Materia from given ref & filled with save */
  getMateria(ref: MateriaRef, save?: MateriaSave): Materia {
    const data = this.data.getMateria(ref);
    switch (data.type) {
      case 'attack':
        return new AttackMateria(data, save?.level, save?.ap, save?.equipped);
      case 'cure':
        return new CureMateria(data, save?.level, save?.ap, save?.equipped);
      default:
        throw new Error(`Materia of type ${data.type} not found`);
    }
  }
}
