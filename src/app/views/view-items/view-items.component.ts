import { Component } from '@angular/core';
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
  MAX_ITEMS = MAX_ITEMS;

  list: Item[] = [];

  constructor(private gameService: GameService) {
    this.list = this.gameService.items.list;
  }

  getNbrItems(): number {
    return this.gameService.items.getEquipped().length;
  }

  canEquipItem(item: Item): boolean {
    return (
      !item.equipped && this.gameService.items.getEquipped().length < MAX_ITEMS
    );
  }

  equipItem(item: Item): void {
    item.equipped = true;
  }

  unequipItem(item: Item): void {
    item.equipped = false;
  }
}
