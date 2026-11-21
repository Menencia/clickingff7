import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { Item, MAX_ITEMS } from '../../models/item';
import { ItemIconComponent } from '../../shared/ui/item-icon/item-icon.component';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-items',
  imports: [UiLayoutDefaultComponent, TranslatePipe, ItemIconComponent],
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss'],
})
export class ViewItemsComponent {
  private gameService = inject(GameService);

  MAX_ITEMS = MAX_ITEMS;

  list: Item[] = [];

  constructor() {
    this.list = this.gameService.items.list;
  }

  getNbrItems(): number {
    return this.gameService.items.getEquipped().length;
  }

  canEquipItem(item: Item): boolean {
    return this.gameService.items.canEquip(item);
  }

  equipItem(item: Item): void {
    this.gameService.items.equip(item);
  }

  unequipItem(item: Item): void {
    this.gameService.items.unequip(item);
  }
}
