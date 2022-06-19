import { Injectable } from '@angular/core'
import { EnemiesService } from './enemies.service'
import { GameService } from './game.service'
import { Attack } from '../models/attack'
import { Characters } from '../models/characters'
import { Enemy } from '../models/enemy'
import { MAX_FIGHTS } from '../models/zone'

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  isBattle = false
  timer = 0

  characters: Characters
  enemies: Enemy[] = []

  constructor(public gameService: GameService,
              public enemiesService: EnemiesService) {
    this.characters = this.gameService.characters
  }

  /**
   * Characters start auto-attacking
   */
  startRandom(): void {
    if (!this.isBattle) {
      this.isBattle = true

      let levelSum = this.gameService.characters.levelSum
      const zone = this.gameService.zones.current()
      this.enemiesService.fightRandom(levelSum, zone, this.gameService.difficulty)
      this.enemiesService.refresh()
      this.autoFighting()
    }
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.gameService.zones.current()
    return (!this.isBattle && zone.nbFights >= MAX_FIGHTS && !zone.completed)
  }

  /**
   * Characters start auto-attacking
   */
  startBoss(): void {
    if (!this.isBattle) {
      this.isBattle = true

      const zone = this.gameService.zones.current()
      const nbCharacters = this.gameService.characters.getTeam().length
      this.enemiesService.fightBoss(zone, nbCharacters, this.gameService.difficulty)
      this.enemiesService.refresh()
      this.autoFighting()
    }
  }

  autoFighting(): void {
    this.timer = window.setTimeout(() => {
      const pwr = this.enemiesService.getHits()
      const hits = this.gameService.characters.getAutoAttacked(new Attack(pwr))
      this.enemiesService.displayAutoHits(hits)

      if (this.gameService.characters.isAlive()) {
        this.autoFighting()
      } else {
        this.end(false)
      }
    }, 1000)
  }

  /**
   * Stop fighting
   */
  stopFighting(): void {
    clearTimeout(this.timer)
  }

  /**
   * Characters stop attacking and wait for next fight
   */
  end(victory: boolean): void {
    this.isBattle = false

    this.stopFighting()

    const enemies = this.enemiesService.list
    const characters = this.gameService.characters.getTeam()
    const materias = this.gameService.materias.getEquipped()

    for (const enemy of enemies) {

      // Rewards if victory
      if (victory) {
        this.gameService.gils += enemy.gilsReward()

        if (enemy.boss && this.gameService.zones.level + 1 > this.gameService.zones.levelMax) {
          // Complete zone
          this.gameService.zones.complete()
        }

        // XP for characters
        const xp = enemy.xpReward()
        for (const character of characters) {
          character.setXp(xp)
        }

        // AP for materias
        const ap = enemy.apReward()
        for (const materia of materias) {
          materia.setAp(ap)
        }

        this.gameService.zones.current().nbFights++
      }
    }

    this.enemiesService.remove()
    this.enemiesService.refresh()
    this.gameService.characters.refresh()
  }

}
