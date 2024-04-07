import { Injectable } from '@angular/core';
import { Characters } from 'src/app/models/units/characters';
import { Enemies } from 'src/app/models/units/enemies';
import { MAX_FIGHTS } from 'src/app/models/zone';
import { AutoFighting } from '../helpers/auto-fighting';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  public characters: Characters;
  public enemies: Enemies;
  public isBattle = false;

  public autos: AutoFighting[] = [];

  constructor(private gameService: GameService) {
    this.characters = this.gameService.characters;
    this.enemies = new Enemies();
    // this.autos.push(new AutoFighting(this.characters, this));
    this.autos.push(new AutoFighting(this.enemies, this));
  }

  /**
   * Characters start auto-attacking
   */
  startRandom(): void {
    if (!this.isBattle) {
      this.isBattle = true;

      let levelSum = this.gameService.characters.levelSum;
      const zone = this.gameService.zones.current();
      this.enemies.fightRandom(levelSum, zone, this.gameService.difficulty);
      this.enemies.refresh();
      this.autos.forEach(auto => auto.run());
    }
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.gameService.zones.current();
    return (!this.isBattle && zone.nbFights >= MAX_FIGHTS && !zone.completed);
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
      this.autos.forEach(auto => auto.run());
    }
  }

  /**
   * Stop fighting
   */
  stopFighting(): void {
    this.autos.forEach(auto => auto.stop());
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

    for (const enemy of enemies) {

      // Rewards if victory
      if (victory) {
        this.gameService.gils += enemy.gilsReward();

        if (enemy.boss && this.gameService.zones.level + 1 > this.gameService.zones.levelMax) {
          // Complete zone
          this.gameService.zones.complete();
        }

        // XP for characters
        const xp = enemy.xpReward();
        for (const character of characters) {
          character.setXp(xp);
        }

        // AP for materias
        const ap = enemy.apReward();
        for (const materia of materias) {
          materia.setAp(ap);
        }

        this.gameService.zones.current().nbFights++;
      }
    }

    this.enemies.remove();
    this.enemies.refresh();
    this.gameService.characters.refresh();
  }

}
