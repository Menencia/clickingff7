import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { Zone } from '@shared/models/zone';
import { PlayerService } from '@shared/services/player.service';
import { ShopService } from '@shared/services/shop.service';

@Component({
  selector: 'app-view-map',
  imports: [UiLayoutDefaultComponent, TranslateModule],
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.scss'],
})
export class ViewMapComponent {
  current: Zone;

  level: number;

  list: Zone[];

  constructor(
    private playerService: PlayerService,
    private shopService: ShopService,
  ) {
    this.current = this.playerService.zones.current();
    this.level = this.playerService.zones.level;
    this.list = this.playerService.zones.list;
  }

  goZone(zoneLevel: number): void {
    this.playerService.zones.level = zoneLevel;
    this.current = this.playerService.zones.current();
    this.level = this.playerService.zones.level;
  }

  canGoNextZone(): boolean {
    return this.playerService.zones.isNextZone();
  }

  goNextZone(): void {
    this.playerService.zones.level += 1;

    // Known level
    if (this.playerService.zones.level <= this.playerService.zones.levelMax) {
      this.goZone(this.playerService.zones.level);
    }

    // New level
    else {
      this.playerService.zones.levelMax += 1;
      this.playerService.zones.nextZone = false;
      this.playerService.buildLevel(this.playerService.zones.level);
      this.playerService.team.refresh();
      const zoneLevelMax = this.playerService.zones.levelMax;
      this.shopService.refresh(zoneLevelMax);
      this.goZone(this.playerService.zones.level);
    }
  }
}
