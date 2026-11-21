import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ShopService } from '../../core/services/shop.service';
import { Item } from '../../models/item';
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
    return this.gameService.weapons.inStock(weapon);
  }

  canBuyWeapon(weapon: Weapon): boolean {
    return this.shop.canBuyWeapon(weapon);
  }

  buyWeapon(weapon: Weapon): void {
    if (this.shop.buyWeapon(weapon)) this.refreshPlayerWeapons();
  }

  canSellWeapon(weapon: Weapon): boolean {
    return this.shop.canSellWeapon(weapon);
  }

  sellWeapon(weapon: Weapon): void {
    if (this.shop.sellWeapon(weapon)) this.refreshPlayerWeapons();
  }

  isOwnedMateria(materia: Materia): boolean {
    return materia.isOwned(this.gameService.materias.list);
  }

  canBuyMateria(materia: Materia): boolean {
    return this.shop.canBuyMateria(materia);
  }

  buyMateria(materia: Materia): void {
    if (this.shop.buyMateria(materia)) this.refreshPlayerMaterias();
  }

  canSellMateria(materia: Materia): boolean {
    return this.shop.canSellMateria(materia);
  }

  sellMateria(materia: Materia): void {
    if (this.shop.sellMateria(materia)) this.refreshPlayerMaterias();
  }

  inStockItem(item: Item): number {
    return this.gameService.items.inStock(item);
  }

  canBuyItem(item: Item): boolean {
    return this.shop.canBuyItem(item);
  }

  buyItem(item: Item): void {
    if (this.shop.buyItem(item)) this.refreshPlayerItems();
  }

  canSellItem(item: Item): boolean {
    return this.shop.canSellItem(item);
  }

  sellItem(item: Item): void {
    if (this.shop.sellItem(item)) this.refreshPlayerItems();
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
