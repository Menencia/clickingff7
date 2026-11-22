import { Injectable, inject } from '@angular/core';
import { Character } from '../../models/character';
import { Enemy } from '../../models/enemy';
import { Item } from '../../models/item';
import { HpPotion } from '../../models/items/hp-potion';
import { MpPotion } from '../../models/items/mp-potion';
import { Materia } from '../../models/materia';
import {
  AttackMateria,
  AttackMateriaJson,
} from '../../models/materias/attack-materia';
import { CureMateria } from '../../models/materias/cure-materia';
import { CharacterRef } from '../../models/refs/characters';
import { EnemyRef } from '../../models/refs/enemy';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import { ZoneRef } from '../../models/refs/zones';
import { Weapon } from '../../models/weapon';
import { Zone } from '../../models/zone';
import { DataService } from './data.service';

/**
 * Builds game models from the catalog.
 * Every call returns a new instance, so the player's stock, the shop and
 * successive games never share state.
 */
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private data = inject(DataService);

  getZone(ref: ZoneRef): Zone {
    const json = this.find(this.data.zones, ref, 'Zone');
    return new Zone({
      ...json,
      enemies: json.enemies.map((e) => this.getEnemy(e)),
      boss: json.boss.map((e) => this.getEnemy(e)),
    });
  }

  getEnemy(ref: EnemyRef): Enemy {
    return new Enemy(this.find(this.data.enemies, ref, 'Enemy'));
  }

  getWeapon(ref: WeaponRef): Weapon {
    return new Weapon(this.find(this.data.weapons, ref, 'Weapon'));
  }

  getCharacter(ref: CharacterRef): Character {
    const json = this.find(this.data.characters, ref, 'Character');
    return new Character({
      ...json,
      weapon: this.getWeapon(json.weapon),
    });
  }

  /** Returns the portrait of a character, without building it */
  getCharacterImage(ref: CharacterRef): string {
    return this.find(this.data.characters, ref, 'Character').image;
  }

  getItem(ref: ItemRef): Item {
    const json = this.find(this.data.items, ref, 'Item');
    switch (json.type) {
      case 'hp-potion':
        return new HpPotion(json);
      case 'mp-potion':
        return new MpPotion(json);
      default:
        throw new Error(`Item of type ${json.type} not found`);
    }
  }

  getMateria(ref: MateriaRef): Materia {
    const json = this.find(this.data.materias, ref, 'Materia');
    switch (json.type) {
      case 'attack':
        return new AttackMateria(json as AttackMateriaJson);
      case 'cure':
        return new CureMateria(json);
      default:
        throw new Error(`Materia of type ${json.type} not found`);
    }
  }

  private find<T extends { ref: string }>(
    list: T[],
    ref: string,
    kind: string,
  ): T {
    const found = list.find((e) => e.ref === ref);
    if (found) {
      return found;
    }
    throw new Error(`${kind} ${ref} not found`);
  }
}
