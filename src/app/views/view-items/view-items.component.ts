import { Component } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { Item, MAX_ITEMS } from 'src/app/models/item';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss']
})
export class ViewItemsComponent {

  MAX_ITEMS = MAX_ITEMS;
  list: Item[] = [];

  constructor(private gameService: GameService) {
    this.list = this.gameService.items.list;
  }

  getNbrItems(): number {
    return this.gameService.items.getEquipped().length;
  }

  canEquipItem(item: Item): boolean {
    return !item.equipped && this.gameService.items.getEquipped().length < MAX_ITEMS;
  }

  equipItem(item: Item): void {
    item.equipped = true;
  }

  unequipItem(item: Item): void {
    item.equipped = false;
  }

}
