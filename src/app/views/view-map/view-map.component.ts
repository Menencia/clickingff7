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
    this.gameService.zones.goTo(zoneLevel);
    this.refresh();
  }

  canGoNextZone(): boolean {
    return this.gameService.zones.isNextZone();
  }

  goNextZone(): void {
    this.gameService.goNextZone();
    this.refresh();
  }

  private refresh(): void {
    this.current = this.gameService.zones.current();
    this.level = this.gameService.zones.level;
  }
}
