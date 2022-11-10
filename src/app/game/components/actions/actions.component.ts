import { Component } from '@angular/core'
import { Attack } from 'src/app/models/attack'
import { Item } from 'src/app/models/item'
import { Materia } from 'src/app/models/materia'
import { BattleService } from 'src/app/services/battle.service'
import { GameService } from 'src/app/services/game.service'

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {

  constructor(private battleService: BattleService,
              private gameService: GameService) { }

  public getMaterias(): Materia[] {
    return this.gameService.materias.getEquipped()
  }

  public getItems(): Item[] {
    return this.gameService.items.getEquipped()
  }

  public getGils(): number {
    return this.gameService.gils
  }

  public isBattle(): boolean {
    return this.battleService.isBattle
  }

  /**
   * Explore for fight
   */
  public fightRandom(): void {
    if (!this.battleService.isBattle) {
      this.battleService.startRandom()
    }
  }

  public canFightBoss(): boolean {
    return this.battleService.canFightBoss()
  }

  /**
   * Explore for fight
   */
  public fightBoss(): void {
    if (this.battleService.canFightBoss()) {
      this.battleService.startBoss()
    }
  }

  /**
   * Attack manually enemy
   */
  public attack(): void {
    if (this.battleService.isBattle) {
      const pwr = this.gameService.characters.getHits()
      const hits = this.battleService.enemies.getAttacked(new Attack(pwr))
      this.gameService.characters.displayHits(hits)

      if (!this.battleService.enemies.isAlive()) {
        this.battleService.end(true)
      }
    }
  }

  /**
   * Escape fight
   */
  public escape(): void {
    if (this.battleService.isBattle) {
      this.battleService.end(false)
    }
  }

  public canUseMateria(materia: Materia): boolean {
    return materia.canUse(this.battleService)
  }

  public useMateria(materia: Materia): void {
    // cost
    if (this.canUseMateria(materia)) {
      this.gameService.characters.mp -= materia.getMpCost()
    } else {
      throw new Error('CANNOT USE')
    }

    // do action
    materia.use(this.battleService)
  }

  public canUseItem(item: Item): boolean {
    return item.canUse(this.battleService)
  }

  public useItem(item: Item): void {
    // cost
    if (this.canUseItem(item)) {
      if (item.nbr > 1) {
        item.nbr--
      } else {
        this.gameService.items.list = this.gameService.items.list.filter(e => e !== item)
      }
    } else {
      throw new Error('CANNOT USE')
    }

    // do action
    item.use(this.battleService)
  }

  public canLimit(): boolean {
    return this.gameService.characters.canLimit()
  }

}
