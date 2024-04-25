import { Injectable } from '@angular/core';
import { Characters } from 'src/app/models/units/characters';
import { Enemies } from 'src/app/models/units/enemies';
import { MAX_FIGHTS } from 'src/app/models/zone';

import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public characters: Characters;

  public enemies: Enemies;

  public isBattle = false;

  public timer!: ReturnType<typeof setTimeout>;

  constructor(private gameService: GameService) {
    this.characters = this.gameService.characters;
    this.enemies = new Enemies();
  }

  /**
   * Characters start auto-attacking
   */
  startRandom(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      const { levelSum } = this.gameService.characters;
      const zone = this.gameService.zones.current();
      this.enemies.fightRandom(levelSum, zone, this.gameService.difficulty);
      this.enemies.refresh();
      this.startFighting();
    }
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.gameService.zones.current();
    return !this.isBattle && zone.nbFights >= MAX_FIGHTS && !zone.completed;
  }

  /**
   * Characters start auto-attacking
   */
  startBoss(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      const zone = this.gameService.zones.current();
      const nbCharacters = this.gameService.characters.getTeam().length;
      this.enemies.fightBoss(zone, nbCharacters, this.gameService.difficulty);
      this.enemies.refresh();
      this.startFighting();
    }
  }

  startFighting(): void {
    this.timer = setTimeout(() => {
      this.enemies.getAttackSkill().use(this);

      if (this.characters.isAlive()) {
        this.startFighting();
      } else {
        this.end(false);
      }
    }, 1000);
  }

  /**
   * Stop fighting
   */
  stopFighting(): void {
    clearTimeout(this.timer);
  }

  /**
   * Characters stop attacking and wait for next fight
   */
  end(victory: boolean): void {
    this.isBattle = false;

    this.stopFighting();

    const enemies = this.enemies.list;
    const characters = this.gameService.characters.getTeam();
    const materias = this.gameService.materias.getEquipped();

    enemies.forEach((enemy) => {
      // Rewards if victory
      if (victory) {
        this.gameService.gils += enemy.gilsReward();

        if (
          enemy.boss &&
          this.gameService.zones.level + 1 > this.gameService.zones.levelMax
        ) {
          // Complete zone
          this.gameService.zones.complete();
        }

        // XP for characters
        const xp = enemy.xpReward();
        characters.forEach((character) => {
          character.setXp(xp);
        });

        // AP for materias
        const ap = enemy.apReward();
        materias.forEach((materia) => {
          materia.setAp(ap);
        });

        this.gameService.zones.current().nbFights += 1;
      }
    });

    this.enemies.remove();
    this.enemies.refresh();
    this.gameService.characters.refresh();
  }
}
