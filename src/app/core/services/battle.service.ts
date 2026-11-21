import { Injectable, signal } from '@angular/core';
import { Battle, BattleState } from '../../models/battle';
import { Context } from '../../models/context';
import { Item } from '../../models/item';
import { Materia } from '../../models/materia';
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
    const levelSum = this.gameService.characters.levelSum();
    const zone = this.gameService.zones.current();
    const enemies = this.getRandomEnemy(
      levelSum,
      zone,
      this.gameService.difficulty,
    );
    enemies.refresh();

    this.startBattle(enemies);
  }

  /**
   * Characters start auto-attacking
   */
  startBoss(): void {
    if (this.battle()) {
      throw new Error('Battle is already ongoing');
    }

    // get random boss
    const zone = this.gameService.zones.current();
    const nbCharacters = this.gameService.characters.getTeam().length;

    const enemies = zone.boss;
    enemies.forEach((e) => {
      e.toLevel(
        zone.level * (nbCharacters + 1) * 3 * 1.4,
        this.gameService.difficulty,
      );
    });
    const res = new Enemies();
    res.list = enemies;
    res.refresh();

    this.startBattle(res);
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

  private startBattle(enemies: Enemies) {
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

  /**
   * Returns true if zone boss is available
   */
  canFightBoss(): boolean {
    const zone = this.gameService.zones.current();
    return !this.battle() && zone.nbFights >= MAX_FIGHTS && !zone.completed;
  }

  /**
   * Team attacks the enemies (Limit when the gauge is full)
   */
  attack(): void {
    const battle = this.battle();
    if (!battle) {
      return;
    }
    this.gameService.characters.getAttackSkill().use(this.getContext());
    this.endIfEnemiesDefeated();
  }

  /**
   * Returns true if the materia can be used now
   */
  canUseMateria(materia: Materia): boolean {
    return materia.canUse(this.getContext());
  }

  /**
   * Pays the MP cost and applies the materia effect.
   * Does nothing if the materia cannot be used.
   */
  useMateria(materia: Materia): void {
    const context = this.getContext();
    if (!materia.canUse(context)) {
      return;
    }
    this.gameService.characters.mp.update((mp) => mp - materia.getMpCost());
    materia.use(context);
    this.endIfEnemiesDefeated();
  }

  /**
   * Returns true if the item can be used now
   */
  canUseItem(item: Item): boolean {
    return item.canUse(this.getContext());
  }

  /**
   * Consumes one item and applies its effect.
   * Does nothing if the item cannot be used.
   */
  useItem(item: Item): void {
    const context = this.getContext();
    if (!item.canUse(context)) {
      return;
    }
    const { items } = this.gameService;
    if (item.nbr > 1) {
      item.nbr -= 1;
    } else {
      items.list = items.list.filter((e) => e !== item);
    }
    item.use(context);
    this.endIfEnemiesDefeated();
  }

  private getContext(): Context {
    return {
      characters: this.gameService.characters,
      battle: this.battle(),
    };
  }

  private endIfEnemiesDefeated(): void {
    const battle = this.battle();
    if (battle && !battle.enemies.isAlive()) {
      battle.end(true);
    }
  }

  onTeamVictory(battle: Battle) {
    const enemies = battle.enemies.list;
    const characters = this.gameService.characters.getTeam();
    const materias = this.gameService.materias.getEquipped();

    enemies.forEach((enemy) => {
      this.gameService.gils.update((gils) => gils + enemy.gilsReward());

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
