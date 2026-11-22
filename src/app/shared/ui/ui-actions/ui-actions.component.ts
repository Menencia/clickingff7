import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { GameService } from '../../../core/services/game.service';
import { Item } from '../../../models/item';
import { Materia } from '../../../models/materia';
import { MAX_FIGHTS } from '../../../models/zone';

@Component({
  selector: 'app-ui-actions',
  imports: [TranslatePipe],
  templateUrl: './ui-actions.component.html',
  styleUrls: ['./ui-actions.component.scss'],
})
export class UiActionsComponent {
  private battleService = inject(BattleService);
  private gameService = inject(GameService);

  public remainingBattles() {
    const remain = MAX_FIGHTS - this.gameService.zones.current().nbFights;
    return remain > 0 ? `(${remain})` : '';
  }

  // Outside a battle, offensive materias and items are hidden.
  public getMaterias(): Materia[] {
    const battle = this.isBattle();
    return this.gameService.materias
      .getEquipped()
      .filter((materia) => battle || !materia.isBattleOnly());
  }

  public getItems(): Item[] {
    const battle = this.isBattle();
    return this.gameService.items
      .getEquipped()
      .filter((item) => battle || !item.isBattleOnly());
  }

  public getGils(): number {
    return this.gameService.gils();
  }

  public isBattle(): boolean {
    return !!this.battleService.battle();
  }

  public canFightRandom(): boolean {
    return this.battleService.canFightRandom();
  }

  public fightRandom(): void {
    if (this.canFightRandom()) {
      this.battleService.startRandom();
    }
  }

  public canFightBoss(): boolean {
    return this.battleService.canFightBoss();
  }

  public fightBoss(): void {
    if (this.battleService.canFightBoss()) {
      this.battleService.startBoss();
    }
  }

  public attack(): void {
    this.battleService.attack();
  }

  public escape(): void {
    this.battleService.escape();
  }

  public canUseMateria(materia: Materia): boolean {
    return this.battleService.canUseMateria(materia);
  }

  public useMateria(materia: Materia): void {
    this.battleService.useMateria(materia);
  }

  public canUseItem(item: Item): boolean {
    return this.battleService.canUseItem(item);
  }

  public useItem(item: Item): void {
    this.battleService.useItem(item);
  }

  public canLimit(): boolean {
    return this.gameService.characters.canLimit();
  }

  public getZoneLvl(): number {
    return this.gameService.zones.level;
  }
}
