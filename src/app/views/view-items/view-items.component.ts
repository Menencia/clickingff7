import { Component } from '@angular/core';
import { LucideMinus, LucidePlus } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { ItemIconComponent } from '@shared/components/item-icon/item-icon.component';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { Item, MAX_ITEMS } from '@shared/models/item';
import { PlayerService } from '@shared/services/player.service';

@Component({
  selector: 'app-view-items',
  imports: [
    UiLayoutDefaultComponent,
    TranslatePipe,
    ItemIconComponent,
    LucideMinus,
    LucidePlus,
  ],
  templateUrl: './view-items.component.html',
})
export class ViewItemsComponent {
  MAX_ITEMS = MAX_ITEMS;

  list: Item[] = [];

  constructor(private playerService: PlayerService) {
    this.list = this.playerService.items.list;
  }

  getNbrItems(): number {
    return this.playerService.items.getEquipped().length;
  }

  canEquipItem(item: Item): boolean {
    return (
      !item.equipped &&
      this.playerService.items.getEquipped().length < MAX_ITEMS
    );
  }

  equipItem(item: Item): void {
    item.equipped = true;
  }

  unequipItem(item: Item): void {
    item.equipped = false;
  }
}
