import { Injectable, inject, signal } from '@angular/core';
import { Battle } from '../../models/battle';
import { Context } from '../../models/context';
import { Difficulty } from '../../models/difficulty';
import { Item } from '../../models/item';
import { Materia } from '../../models/materia';
import { Enemies } from '../../models/units/enemies';
import { MAX_FIGHTS, Zone } from '../../models/zone';
import { random } from '../../shared/utils/math.utils';
import { GameService } from './game.service';

/** Boss levels per zone and per team slot (team size + 1) */
const BOSS_LEVELS_PER_SLOT = 3;

/** Extra difficulty of a boss over its base level */
const BOSS_LEVEL_FACTOR = 1.4;

/** Level bonus of a mini-boss over a regular enemy */
const MINIBOSS_LEVEL_FACTOR = 1.2;

/** Number of extra enemies of the zone that become reachable as fights are won */
const ENEMY_RANGE_STEPS = 4;

/** Index of the last enemy of the zone that can be picked */
const MAX_ENEMY_INDEX = 3;

/**
 * Base level of a zone boss: zone × (team size + 1) × 3 × 1.4
 */
export function bossLevelSum(zone: Zone, teamSize: number): number {
  return zone.level * (teamSize + 1) * BOSS_LEVELS_PER_SLOT * BOSS_LEVEL_FACTOR;
}

/**
 * Index of the last enemy that can be picked in a zone: grows with the fights
 * won, up to the 4th enemy
 */
export function enemyRange(zone: Zone): number {
  return Math.min(
    Math.floor((zone.nbFights / MAX_FIGHTS) * ENEMY_RANGE_STEPS),
    MAX_ENEMY_INDEX,
  );
}

/**
 * Base level of a random enemy: the team level sum, raised for a mini-boss
 */
export function enemyLevelSum(teamLevelSum: number, miboss: boolean): number {
  return miboss ? teamLevelSum * MINIBOSS_LEVEL_FACTOR : teamLevelSum;
}

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  private gameService = inject(GameService);

  public battle = signal<Battle | undefined>(undefined);

  /**
   * Characters start auto-attacking
   */
  startRandom(): void {
    this.assertCanStart();

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
    this.assertCanStart();

    // get random boss
    const zone = this.gameService.zones.current();
    const levelSum = bossLevelSum(
      zone,
      this.gameService.characters.team().length,
    );

    const enemies = zone.boss;
    enemies.forEach((e) => {
      e.toLevel(levelSum, this.gameService.difficulty);
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
    const enemy = zone.enemies[random(0, enemyRange(zone))];
    enemy.toLevel(enemyLevelSum(levelSumBase, enemy.miboss), difficulty);
    const res = new Enemies();
    res.list = [enemy];
    return res;
  }

  private startBattle(enemies: Enemies) {
    const battle = new Battle(
      this.gameService.characters,
      enemies,
      (victory) => {
        if (victory) {
          this.onTeamVictory(battle);
        }
        this.battle.set(undefined);
      },
    );

    this.battle.set(battle);
    battle.start();
  }

  /**
   * A battle can start when none is ongoing and the team has HP left
   */
  canFightRandom(): boolean {
    return !this.battle() && this.gameService.characters.hp() > 0;
  }

  canFightBoss(): boolean {
    const zone = this.gameService.zones.current();
    return (
      this.canFightRandom() && zone.nbFights >= MAX_FIGHTS && !zone.completed
    );
  }

  private assertCanStart(): void {
    if (this.battle()) {
      throw new Error('Battle is already ongoing');
    }
    if (this.gameService.characters.hp() <= 0) {
      throw new Error('Team has no HP left');
    }
  }

  /**
   * Team attacks the enemies (Limit when the gauge is full)
   */
  attack(): void {
    const battle = this.battle();
    if (!battle) {
      return;
    }
    const { characters } = this.gameService;
    const skill = characters.getAttackSkill();
    if (characters.canLimit()) {
      characters.limit.set(0);
    }
    skill.use(this.getContext());
    this.endIfEnemiesDefeated();
  }

  /**
   * Ends the battle as a defeat, without rewards. Does nothing outside a battle.
   */
  escape(): void {
    this.battle()?.end(false);
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
    this.gameService.items.remove(item);
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

  private onTeamVictory(battle: Battle) {
    const enemies = battle.enemies.list;
    const characters = this.gameService.characters.team();
    const materias = this.gameService.materias.getEquipped();

    enemies.forEach((enemy) => {
      this.gameService.gils.update((gils) => gils + enemy.gils);

      // A boss can only be fought in an uncompleted zone, the last unlocked one
      if (enemy.boss) {
        this.gameService.zones.complete();
      }

      // XP for characters
      characters.forEach((character) => {
        character.setXp(enemy.xp);
      });

      // AP for materias
      materias.forEach((materia) => {
        materia.setAp(enemy.ap);
      });
    });

    this.gameService.zones.current().nbFights += 1;

    this.gameService.characters.refresh();
  }
}
