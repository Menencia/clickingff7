import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { Zone } from '../../models/zone';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';

@Component({
  selector: 'app-view-map',
  imports: [UiLayoutDefaultComponent, TranslatePipe],
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.scss'],
})
export class ViewMapComponent {
  private gameService = inject(GameService);

  current: Zone;

  level: number;

  list: Zone[];

  constructor() {
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
      this.goZone(this.gameService.zones.level);
    }
  }
}
