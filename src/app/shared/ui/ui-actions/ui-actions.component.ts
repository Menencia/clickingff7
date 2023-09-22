import { Component } from '@angular/core';
import { BattleService } from 'src/app/core/services/battle.service';
import { GameService } from 'src/app/core/services/game.service';
import { ItemAction } from 'src/app/models/actions/item';
import { MateriaAction } from 'src/app/models/actions/materia';
import { Item } from 'src/app/models/item';
import { Materia } from 'src/app/models/materia';

@Component({
  selector: 'app-ui-actions',
  templateUrl: './ui-actions.component.html',
  styleUrls: ['./ui-actions.component.scss']
})
export class UiActionsComponent {

  /** True if the player has already played at his turn */
  played = false;

  constructor(
    private battleService: BattleService,
    private gameService: GameService
  ) { }

  public isPlayerTurn(): boolean {
    return this.battleService.isPlayerTurn;
  }

  public actionDisabled(): boolean {
    return this.played || !this.isPlayerTurn();
  }

  public getMaterias(): Materia[] {
    return this.gameService.materias.getEquipped();
  }

  public getItems(): Item[] {
    return this.gameService.items.getEquipped();
  }

  public getGils(): number {
    return this.gameService.gils;
  }

  public isBattle(): boolean {
    return this.battleService.isBattle;
  }

  public fightRandom(): void {
    if (!this.battleService.isBattle) {
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
    this.played = true;
    const action = this.gameService.characters.getAction();
    action.use(this.battleService);
    action._complete.subscribe(() => {
      this.played = false;
      this.battleService.nextTurn();
    });
  }

  /**
   * Escape fight
   */
  public escape(): void {
    if (this.battleService.isBattle) {
      this.battleService.end(false);
    }
  }

  public canUseMateria(materia: Materia): boolean {
    return materia.canUse(this.battleService);
  }

  public useMateria(materia: Materia): void {
    this.played = true;
    this.gameService.characters.mp -= materia.getMpCost();
    const action = new MateriaAction(materia);
    action.use(this.battleService);
    action._complete.subscribe(() => {
      this.played = false;
      this.battleService.nextTurn();
    });
  }

  public canUseItem(item: Item): boolean {
    return item.canUse(this.battleService);
  }

  public useItem(item: Item): void {
    this.played = true;
    if (item.nbr > 1) {
      item.nbr--;
    } else {
      this.gameService.items.list = this.gameService.items.list.filter(e => e !== item);
    }
    const action = new ItemAction(item);
    action.use(this.battleService);
    action._complete.subscribe(() => {
      this.played = false;
      this.battleService.nextTurn();
    });
  }

  public canLimit(): boolean {
    return this.gameService.characters.canLimit();
  }

  public getZoneLvl(): number {
    return this.gameService.zones.level;
  }

}
