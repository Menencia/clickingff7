import { Characters } from './units/characters';
import { Enemies } from './units/enemies';

/** Delay between two enemy attacks, in ms */
const ENEMY_ATTACK_DELAY = 1000;

export class Battle {
  private timer?: ReturnType<typeof setTimeout>;

  private started = false;

  /** True once the battle has ended (victory, defeat or escape) */
  ended = false;

  victory = false;

  /**
   * @param onEnd called once, when the battle ends
   */
  constructor(
    public readonly characters: Characters,
    public readonly enemies: Enemies,
    private readonly onEnd: (victory: boolean) => void = () => {},
  ) {}

  /**
   * Starts the enemy attack loop. Does nothing if the battle has already
   * started or ended.
   */
  start(): void {
    if (this.started || this.ended) {
      return;
    }
    this.started = true;
    this.scheduleEnemyAttack();
  }

  private scheduleEnemyAttack(): void {
    this.timer = setTimeout(() => {
      this.enemies
        .getAttackSkill()
        .use({ characters: this.characters, battle: this });

      if (this.characters.isAlive()) {
        this.scheduleEnemyAttack();
      } else {
        // the Limit gauge is lost when the team is defeated
        this.characters.limit.set(0);
        this.end(false);
      }
    }, ENEMY_ATTACK_DELAY);
  }

  /**
   * Stop fighting
   */
  stop(): void {
    clearTimeout(this.timer);
  }

  /**
   * Characters stop attacking and wait for next fight. Only the first call
   * counts.
   */
  end(victory: boolean): void {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.stop();
    this.victory = victory;
    this.onEnd(victory);
  }
}
