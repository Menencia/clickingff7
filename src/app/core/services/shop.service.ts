import { Injectable, inject } from '@angular/core';
import { Item, MAX_ITEMS } from '../../models/item';
import { Materia } from '../../models/materia';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import { Weapon } from '../../models/weapon';
import { WEAPON_TYPES } from '../../models/weapon-type';
import { GameService } from './game.service';
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
 * Single source for the shop catalog, the shop sort orders and the
 * buy and sell rules. The catalog getters return fresh instances, never
 * the player's stock. Each buy and sell checks its rule and does nothing
 * (returns false) when the operation is not allowed.
 */
@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private store = inject(StoreService);
  private game = inject(GameService);

  getWeapons(levelMax: number): Weapon[] {
    return this.sortWeapons(
      SHOP_WEAPONS.map((ref) => this.store.getWeapon(ref)).filter((w) =>
        w.isAvailable(levelMax),
      ),
    );
  }

  getMaterias(levelMax: number): Materia[] {
    return this.sortMaterias(
      SHOP_MATERIAS.map((ref) => this.store.getMateria(ref)).filter((m) =>
        m.isAvailable(levelMax),
      ),
    );
  }

  getItems(levelMax: number): Item[] {
    return this.sortItems(
      SHOP_ITEMS.map((ref) => this.store.getItem(ref)).filter((i) =>
        i.isAvailable(levelMax),
      ),
    );
  }

  canBuyWeapon(weapon: Weapon): boolean {
    return (
      this.game.weapons.inStock(weapon) === 0 &&
      this.game.gils() >= weapon.getPrice()
    );
  }

  /**
   * Adds a new copy of the weapon, never the given (catalog) instance.
   */
  buyWeapon(weapon: Weapon): boolean {
    if (!this.canBuyWeapon(weapon)) return false;
    this.game.gils.update((gils) => gils - weapon.getPrice());
    this.game.weapons.add(this.store.getWeapon(weapon.ref));
    return true;
  }

  /**
   * An owned weapon can be sold unless it is the last equipped copy.
   */
  canSellWeapon(weapon: Weapon): boolean {
    return (
      this.game.weapons.list.includes(weapon) &&
      (!this.game.weapons.isEquipped(weapon, this.game.characters.list) ||
        weapon.nbr > 1)
    );
  }

  sellWeapon(weapon: Weapon): boolean {
    if (!this.canSellWeapon(weapon)) return false;
    this.game.gils.update((gils) => gils + weapon.getSellPrice());
    this.game.weapons.remove(weapon);
    return true;
  }

  canBuyMateria(materia: Materia): boolean {
    return (
      !materia.isOwned(this.game.materias.list) &&
      this.game.gils() >= materia.getPrice()
    );
  }

  /**
   * Adds a new copy of the materia, never the given (catalog) instance.
   */
  buyMateria(materia: Materia): boolean {
    if (!this.canBuyMateria(materia)) return false;
    this.game.gils.update((gils) => gils - materia.getPrice());
    this.game.materias.add(this.store.getMateria(materia.ref));
    return true;
  }

  /**
   * An owned materia can be sold unless it is equipped.
   */
  canSellMateria(materia: Materia): boolean {
    return this.game.materias.list.includes(materia) && !materia.equipped;
  }

  sellMateria(materia: Materia): boolean {
    if (!this.canSellMateria(materia)) return false;
    this.game.gils.update((gils) => gils + materia.getSellPrice());
    this.game.materias.list = this.game.materias.list.filter(
      (e) => e !== materia,
    );
    return true;
  }

  canBuyItem(item: Item): boolean {
    return this.game.gils() >= item.getPrice();
  }

  /**
   * Stacks on the owned copy, or adds a new copy, equipped if a slot is free.
   */
  buyItem(item: Item): boolean {
    if (!this.canBuyItem(item)) return false;
    this.game.gils.update((gils) => gils - item.getPrice());
    const equipped = this.game.items.getEquipped().length < MAX_ITEMS;
    this.game.items.add(this.store.getItem(item.ref), equipped);
    return true;
  }

  canSellItem(item: Item): boolean {
    return this.game.items.list.includes(item);
  }

  sellItem(item: Item): boolean {
    if (!this.canSellItem(item)) return false;
    this.game.gils.update((gils) => gils + item.getSellPrice());
    this.game.items.remove(item);
    return true;
  }

  /**
   * By weapon type, then by hits. Returns a new array.
   */
  sortWeapons(weapons: Weapon[]): Weapon[] {
    return [...weapons].sort(
      (a, b) =>
        WEAPON_TYPES.indexOf(a.type) - WEAPON_TYPES.indexOf(b.type) ||
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
