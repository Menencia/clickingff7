import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from 'src/app/core/services/game.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { Zone } from 'src/app/models/zone';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-map',
  standalone: true,
  imports: [
    UiLayoutDefaultComponent,
    TranslateModule,
    NgFor,
    NgIf,
    ButtonComponent,
  ],
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.scss'],
})
export class ViewMapComponent {
  current: Zone;

  level: number;

  list: Zone[];

  constructor(
    private gameService: GameService,
    private shopService: ShopService,
  ) {
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
    this.gameService.zones.level += 1;

    // Known level
    if (this.gameService.zones.level <= this.gameService.zones.levelMax) {
      this.goZone(this.gameService.zones.level);
    }

    // New level
    else {
      this.gameService.zones.levelMax += 1;
      this.gameService.zones.nextZone = false;
      this.gameService.buildLevel(this.gameService.zones.level);
      this.gameService.characters.refresh();
      const zoneLevelMax = this.gameService.zones.levelMax;
      this.shopService.refresh(zoneLevelMax);
      this.goZone(this.gameService.zones.level);
    }
  }
}
