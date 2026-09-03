import { Injectable, signal } from '@angular/core';
import { Battle, BattleState } from '../../models/battle';
import { Enemies } from '../../models/units/enemies';
import { MAX_FIGHTS, Zone } from '../../models/zone';
import { random } from '../../shared/utils/math.utils';
import { Difficulty, GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public battle = signal<Battle | undefined>(undefined);

  constructor(private gameService: GameService) {}

  /**
   * Characters start auto-attacking
   */
  startRandom(): void {
    if (this.battle()) {
      throw new Error('Battle is already ongoing');
    }

    // get random enemy
    const { levelSum } = this.gameService.characters;
    const zone = this.gameService.zones.current();
    const enemies = this.getRandomEnemy(
      levelSum,
      zone,
      this.gameService.difficulty,
    );
    enemies.refresh();

    // new battle
    const battle = new Battle(this.gameService.characters, enemies);

    // watch battle state
    battle.state.subscribe(async (state) => {
      switch (state) {
        case BattleState.Ended:
          // rewards on victory
          if (battle.victory) {
            this.onTeamVictory(battle);
          }
          // clean battle
          this.battle.set(undefined);
      }
    });

    this.battle.set(battle);
  }

  private getRandomEnemy(
    levelSumBase: number,
    zone: Zone,
    difficulty: Difficulty,
  ) {
    let range: number;
    range = Math.floor((zone.nbFights / MAX_FIGHTS) * 4);
    range = Math.min(range, 3);

    const enemy = zone.enemies[random(0, range)];

    let levelSum = levelSumBase;
    if (enemy.miboss) {
      levelSum *= 1.2;
    }

    enemy.toLevel(levelSum, difficulty);
    const res = new Enemies();
    res.list = [enemy];
    return res;
  }

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.gameService.zones.current();
    return !this.battle() && zone.nbFights >= MAX_FIGHTS && !zone.completed;
  }

  /**
   * Characters start auto-attacking
   */
  startBoss(): void {
    // if (!this.isBattle) {
    //   this.isBattle = true;
    //   const zone = this.gameService.zones.current();
    //   const nbCharacters = this.gameService.characters.getTeam().length;
    //   this.enemies().fightBoss(zone, nbCharacters, this.gameService.difficulty);
    //   this.enemies().refresh();
    //   this.startFighting();
    // }
  }

  onTeamVictory(battle: Battle) {
    const enemies = battle.enemies.list;
    const characters = this.gameService.characters.getTeam();
    const materias = this.gameService.materias.getEquipped();

    enemies.forEach((enemy) => {
      this.gameService.gils += enemy.gilsReward();

      if (
        enemy.boss &&
        this.gameService.zones.level + 1 > this.gameService.zones.levelMax
      ) {
        // Complete zone
        this.gameService.zones.complete();
      }

      // XP for characters
      characters.forEach((character) => {
        character.setXp(enemy.xpReward());
      });

      // AP for materias
      materias.forEach((materia) => {
        materia.setAp(enemy.apReward());
      });
    });

    this.gameService.zones.current().nbFights += 1;

    this.gameService.characters.refresh();
  }
}
