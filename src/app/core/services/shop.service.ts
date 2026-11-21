import { Injectable } from '@angular/core';
import { Item } from '../../models/item';
import { Materia } from '../../models/materia';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import { Weapon } from '../../models/weapon';
import { StoreService } from './store.service';

const SHOP_WEAPONS: WeaponRef[] = [
  WeaponRef.BusterSword,
  WeaponRef.GatlingGun,
  WeaponRef.AssaultGun,
  WeaponRef.LeatherGlove,
  WeaponRef.MetalKnuckle,
  WeaponRef.GuardStick,
  WeaponRef.MythrilRod,
  WeaponRef.MythrilSaber,
  WeaponRef.CannonBall,
  WeaponRef.MythrilClaw,
  WeaponRef.FullMetalStaff,
  WeaponRef.FPtShuriken,
];

const SHOP_MATERIAS: MateriaRef[] = [
  MateriaRef.Restore,
  MateriaRef.Bolt,
  MateriaRef.Ice,
  MateriaRef.Fire,
  MateriaRef.Poison,
  MateriaRef.Earth,
  MateriaRef.ChocoMog,
];

const SHOP_ITEMS: ItemRef[] = [
  ItemRef.Potion,
  ItemRef.Ether,
  ItemRef.HiPotion,
  ItemRef.HiEther,
];

/**
 * Display order of weapon types, following the characters' order.
 */
const WEAPON_TYPE_ORDER: string[] = [
  'broadsword',
  'gun-arm',
  'knuckle',
  'stave',
  'headdresse',
  'shuriken',
];

/**
 * Single source for the shop catalog and the shop sort orders.
 * Every call returns fresh instances, never the player's stock.
 */
@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private store: StoreService) {}

  getWeapons(levelMax: number): Weapon[] {
    return this.sortWeapons(
      SHOP_WEAPONS.map((ref) => this.store.getWeapon(ref)).filter(
        (w) => w.zoneAvailable <= levelMax,
      ),
    );
  }

  getMaterias(levelMax: number): Materia[] {
    return this.sortMaterias(
      SHOP_MATERIAS.map((ref) => this.store.getMateria(ref)).filter(
        (m) => m.zoneAvailable <= levelMax,
      ),
    );
  }

  getItems(levelMax: number): Item[] {
    return this.sortItems(
      SHOP_ITEMS.map((ref) => this.store.getItem(ref)).filter((i) =>
        i.available(levelMax),
      ),
    );
  }

  /**
   * By weapon type, then by hits. Returns a new array.
   */
  sortWeapons(weapons: Weapon[]): Weapon[] {
    return [...weapons].sort(
      (a, b) =>
        WEAPON_TYPE_ORDER.indexOf(a.type) - WEAPON_TYPE_ORDER.indexOf(b.type) ||
        a.hits - b.hits,
    );
  }

  /**
   * By power. Returns a new array.
   */
  sortMaterias(materias: Materia[]): Materia[] {
    return [...materias].sort((a, b) => a.pwr - b.pwr);
  }

  /**
   * By ref. Returns a new array.
   */
  sortItems(items: Item[]): Item[] {
    return [...items].sort((a, b) => a.ref.localeCompare(b.ref));
  }
}
