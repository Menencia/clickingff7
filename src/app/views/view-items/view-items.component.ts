import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Item, MAX_ITEMS } from '@shared/models/item';
import { PlayerService } from '@shared/services/player.service';
import { ItemIconComponent } from 'src/app/shared/ui/item-icon/item-icon.component';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-items',
  standalone: true,
  imports: [UiLayoutDefaultComponent, TranslateModule, ItemIconComponent],
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss'],
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
    return !item.equipped && this.playerService.items.getEquipped().length < MAX_ITEMS;
  }

  equipItem(item: Item): void {
    item.equipped = true;
  }

  unequipItem(item: Item): void {
    item.equipped = false;
  }
}
