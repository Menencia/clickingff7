import { Component } from '@angular/core';
import { Zone } from 'src/app/models/zone';
import { GameService } from 'src/app/services/game.service';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.scss']
})
export class ViewMapComponent {

  current: Zone;
  level: number;
  list: Zone[];

  constructor(private gameService: GameService,
              private shopService: ShopService) {
    this.current = this.gameService.zones.current();
    this.level = this.gameService.zones.level;
    this.list = this.gameService.zones.list;
  }

  goZone(zoneLevel: number): void {
    this.gameService.zones.level = zoneLevel;
    this.current = this.gameService.zones.current();
    this.level = this.gameService.zones.level;
  }

  canGoNextZone(): boolean {
    return this.gameService.zones.isNextZone();
  }

  goNextZone(): void {
    this.gameService.zones.level++;

    // Known level
    if (this.gameService.zones.level <= this.gameService.zones.levelMax) {
      this.goZone(this.gameService.zones.level);
    }

    // New level
    else {
      this.gameService.zones.levelMax++;
      this.gameService.zones.nextZone = false;
      this.gameService.buildLevel(this.gameService.zones.level);
      this.gameService.characters.refresh();
      const zoneLevelMax = this.gameService.zones.levelMax;
      this.shopService.refresh(zoneLevelMax);
      this.goZone(this.gameService.zones.level);
    }
  }

}
