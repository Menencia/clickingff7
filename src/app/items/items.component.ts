import { Component } from '@angular/core'
import { GameService } from '../services/game.service'
import { Item, MAX_ITEMS } from '../models/item'

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {

  MAX_ITEMS = MAX_ITEMS
  list: Item[] = []
  nbrItems = 0

  constructor(public gameService: GameService) {
    this.list = this.gameService.items.list
    this.nbrItems = this.gameService.items.getEquipped().length
  }

  canEquipItem(item: Item): boolean {
    return !item.equipped && this.gameService.items.getEquipped().length < MAX_ITEMS
  }

  equipItem(item: Item): void {
    item.equipped = true
  }

  unequipItem(item: Item): void {
    item.equipped = false
  }

}
