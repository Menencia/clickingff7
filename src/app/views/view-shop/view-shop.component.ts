import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ShopService } from '../../core/services/shop.service';
import { StoreService } from '../../core/services/store.service';
import { Item, MAX_ITEMS } from '../../models/item';
import { Materia } from '../../models/materia';
import { Weapon } from '../../models/weapon';
import { ItemIconComponent } from '../../shared/ui/item-icon/item-icon.component';
import { MateriaIconComponent } from '../../shared/ui/materia-icon/materia-icon.component';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';
import { WeaponIconComponent } from '../../shared/ui/weapon-icon/weapon-icon.component';
@Component({
  selector: 'app-shop',
  imports: [
    TranslatePipe,
    UiLayoutDefaultComponent,
    WeaponIconComponent,
    MateriaIconComponent,
    ItemIconComponent,
  ],
  templateUrl: './view-shop.component.html',
  styleUrls: ['./view-shop.component.scss'],
})
export class ViewShopComponent {
  private gameService = inject(GameService);
  private store = inject(StoreService);
  private shop = inject(ShopService);

  section = 'buy';

  type = 'weapons';

  shopWeapons: Weapon[] = [];

  shopMaterias: Materia[] = [];

  shopItems: Item[] = [];

  playerWeapons: Weapon[] = [];

  playerMaterias: Materia[] = [];

  playerItems: Item[] = [];

  constructor() {
    this.refresh();
  }

  getGils(): number {
    return this.gameService.gils();
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
      this.gameService.gils() >= weapon.getPrice()
    );
  }

  buyWeapon(weapon: Weapon): void {
    this.gameService.gils.update((gils) => gils - weapon.getPrice());
    this.gameService.weapons.add(this.store.getWeapon(weapon.ref), false);
    this.refreshPlayerWeapons();
  }

  canSellWeapon(weapon: Weapon): boolean {
    return (weapon.equipped && weapon.nbr > 1) || !weapon.equipped;
  }

  sellWeapon(weapon: Weapon): void {
    this.gameService.gils.update((gils) => gils + weapon.getSellPrice());
    if (weapon.nbr > 1) {
      weapon.nbr -= 1;
    } else {
      this.gameService.weapons.list = this.gameService.weapons.list.filter(
        (e) => e !== weapon,
      );
      this.refreshPlayerWeapons();
    }
  }

  isOwnedMateria(materia: Materia): boolean {
    return materia.isOwned(this.gameService.materias.list);
  }

  canBuyMateria(materia: Materia): boolean {
    return (
      !this.isOwnedMateria(materia) &&
      this.gameService.gils() >= materia.getPrice()
    );
  }

  buyMateria(materia: Materia): void {
    this.gameService.gils.update((gils) => gils - materia.getPrice());
    this.gameService.materias.add(this.store.getMateria(materia.ref));
    this.refreshPlayerMaterias();
  }

  sellMateria(materia: Materia): void {
    this.gameService.gils.update((gils) => gils + materia.getSellPrice());
    this.gameService.materias.list = this.gameService.materias.list.filter(
      (e) => e !== materia,
    );
    this.refreshPlayerMaterias();
  }

  inStockItem(item: Item): number {
    return item.inStock(this.gameService.items.list);
  }

  canBuyItem(item: Item): boolean {
    return this.gameService.gils() >= item.getPrice();
  }

  buyItem(item: Item): void {
    this.gameService.gils.update((gils) => gils - item.getPrice());
    const equipped = this.gameService.items.getEquipped().length < MAX_ITEMS;
    this.gameService.items.add(this.store.getItem(item.ref), equipped);
    this.refreshPlayerItems();
  }

  sellItem(item: Item): void {
    this.gameService.gils.update((gils) => gils + item.getSellPrice());
    if (item.nbr > 1) {
      item.nbr -= 1;
    } else {
      this.gameService.items.list = this.gameService.items.list.filter(
        (e) => e !== item,
      );
      this.refreshPlayerItems();
    }
  }

  refresh(): void {
    const { levelMax } = this.gameService.zones;
    this.shopWeapons = this.shop.getWeapons(levelMax);
    this.shopMaterias = this.shop.getMaterias(levelMax);
    this.shopItems = this.shop.getItems(levelMax);
    this.refreshPlayerWeapons();
    this.refreshPlayerMaterias();
    this.refreshPlayerItems();
  }

  private refreshPlayerWeapons(): void {
    this.playerWeapons = this.shop.sortWeapons(this.gameService.weapons.list);
  }

  private refreshPlayerMaterias(): void {
    this.playerMaterias = this.gameService.materias.list;
  }

  private refreshPlayerItems(): void {
    this.playerItems = this.shop.sortItems(this.gameService.items.list);
  }
}
