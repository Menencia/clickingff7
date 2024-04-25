import { Component } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { Item, MAX_ITEMS } from 'src/app/models/item';
import { ItemLoader } from 'src/app/models/loaders/item-loader';
import { MateriaLoader } from 'src/app/models/loaders/materia-loader';
import { WeaponLoader } from 'src/app/models/loaders/weapon-loader';
import { Materia } from 'src/app/models/materia';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { Weapon } from 'src/app/models/weapon';

@Component({
  selector: 'app-shop',
  templateUrl: './view-shop.component.html',
  styleUrls: ['./view-shop.component.scss'],
})
export class ViewShopComponent {
  section = 'buy';
  type = 'weapons';

  shopWeapons: Weapon[] = [];
  shopMaterias: Materia[] = [];
  shopItems: Item[] = [];

  playerWeapons: Weapon[] = [];
  playerMaterias: Materia[] = [];
  playerItems: Item[] = [];

  constructor(private gameService: GameService) {
    this.refresh();
  }

  getGils(): number {
    return this.gameService.gils;
  }

  changeSection(s: string): void {
    this.section = s;
  }

  changeType(t: string): void {
    this.type = t;
  }

  inStockWeapon(weapon: Weapon): number {
    return weapon.inStock(this.gameService.weapons.list);
  }

  canBuyWeapon(weapon: Weapon): boolean {
    return (
      this.inStockWeapon(weapon) === 0 &&
      this.gameService.gils >= weapon.getPrice()
    );
  }

  buyWeapon(weapon: Weapon): void {
    this.gameService.gils -= weapon.getPrice();
    this.gameService.weapons.add(weapon, false);
    this.refreshPlayerWeapons();
  }

  canSellWeapon(weapon: Weapon): boolean {
    return (weapon.equipped && weapon.nbr > 1) || !weapon.equipped;
  }

  sellWeapon(weapon: Weapon): void {
    this.gameService.gils += weapon.getSellPrice();
    if (weapon.nbr > 1) {
      weapon.nbr--;
    } else {
      this.gameService.weapons.list = this.gameService.weapons.list.filter(
        (e) => e !== weapon,
      );
      this.refreshPlayerWeapons();
    }
  }

  inStockMateria(materia: Materia): boolean {
    return materia.inStock(this.gameService.materias.list);
  }

  canBuyMateria(materia: Materia): boolean {
    return (
      !this.inStockMateria(materia) &&
      this.gameService.gils >= materia.getPrice()
    );
  }

  buyMateria(materia: Materia): void {
    this.gameService.gils -= materia.getPrice();
    this.gameService.materias.add(materia);
    this.refreshPlayerMaterias();
  }

  sellMateria(materia: Materia): void {
    this.gameService.gils += materia.getSellPrice();
    this.gameService.materias.list = this.gameService.materias.list.filter(
      (e) => e !== materia,
    );
    this.refreshPlayerMaterias();
  }

  inStockItem(item: Item): number {
    return item.inStock(this.gameService.items.list);
  }

  canBuyItem(item: Item): boolean {
    return this.gameService.gils >= item.getPrice();
  }

  buyItem(item: Item): void {
    this.gameService.gils -= item.getPrice();
    const equipped = this.gameService.items.getEquipped().length < MAX_ITEMS;
    this.gameService.items.add(item, equipped);
    this.refreshPlayerItems();
  }

  sellItem(item: Item): void {
    this.gameService.gils += item.getSellPrice();
    if (item.nbr > 1) {
      item.nbr--;
    } else {
      this.gameService.items.list = this.gameService.items.list.filter(
        (e) => e !== item,
      );
      this.refreshPlayerItems();
    }
  }

  refresh(): void {
    const levelMax = this.gameService.zones.levelMax;
    this.shopWeapons = [];
    this.shopMaterias = [];
    this.shopItems = [];

    const weapons = [
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
      // 'FPtShuriken'
    ];
    for (const w of weapons) {
      const weapon = WeaponLoader.build(w);
      if (weapon.zoneAvailable <= levelMax) {
        this.shopWeapons.push(weapon);
      }
    }
    this.shopWeapons = this.sortWeapons(this.shopWeapons);
    this.refreshPlayerWeapons();

    const materias = [
      MateriaRef.Restore,
      MateriaRef.Bolt,
      MateriaRef.Ice,
      MateriaRef.Fire,
      MateriaRef.Poison,
      MateriaRef.Earth,
      MateriaRef.ChocoMog,
    ];
    for (const m of materias) {
      const materia = MateriaLoader.build(m);
      if (materia.zoneAvailable <= levelMax) {
        this.shopMaterias.push(materia);
      }
    }
    this.shopMaterias = this.sortMaterias(this.shopMaterias);
    this.refreshPlayerMaterias();

    const items = [
      ItemRef.Potion,
      ItemRef.Ether,
      ItemRef.HiPotion,
      ItemRef.HiEther,
    ];
    for (const i of items) {
      const item = ItemLoader.build(i);
      if (item.available(levelMax)) {
        this.shopItems.push(item);
      }
    }
    this.shopItems = this.sortItems(this.shopItems);
    this.refreshPlayerItems();
  }

  private refreshPlayerWeapons(): void {
    this.playerWeapons = this.sortWeapons(this.gameService.weapons.list);
  }

  private sortWeapons(weapons: Weapon[]): Weapon[] {
    const types: { [type: string]: number } = {
      broadsword: 1,
      'gun-arm': 2,
      knuckle: 3,
    };
    return weapons
      .sort((a, b) => a.hits - b.hits)
      .sort((a, b) => types[a.type] - types[b.type]);
  }

  private refreshPlayerMaterias(): void {
    this.playerMaterias = this.gameService.materias.list;
  }

  private sortMaterias(materias: Materia[]): Materia[] {
    return materias.sort((a, b) => a.pwr - b.pwr);
  }

  private refreshPlayerItems(): void {
    this.playerItems = this.sortItems(this.gameService.items.list);
  }

  private sortItems(items: Item[]): Item[] {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }
}
