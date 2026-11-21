import { Battle, BattleState } from './battle';
import { Character } from './character';
import { Enemy } from './enemy';
import { CharacterRef } from './refs/characters';
import { EnemyRef } from './refs/enemy';
import { WeaponRef } from './refs/weapons';
import { Characters } from './units/characters';
import { Enemies } from './units/enemies';
import { Weapon } from './weapon';

function makeCharacters(): Characters {
  const weapon = new Weapon({
    ref: WeaponRef.BusterSword,
    type: 'broadsword',
    hits: 10,
    price: 0,
    maxMaterias: 1,
    zoneAvailable: 1,
  });
  const characters = new Characters();
  characters.add(
    new Character({
      ref: CharacterRef.Cloud,
      image: 'cloud',
      weaponType: 'broadsword',
      weapon,
      hp: 3,
      mp: 3,
      xp: 3,
    }).setLevel(5), // 100 HP
    true,
  );
  characters.refresh();
  characters.hp.set(characters.hpMax);
  return characters;
}

function makeEnemies(): Enemies {
  const enemy = new Enemy({
    ref: EnemyRef.Aps,
    image: 'aps',
    hp: 3,
    hits: 3,
    xp: 3,
    ap: 3,
    gils: 3,
  });
  enemy.toLevel(10, 2); // 10 hits
  const enemies = new Enemies();
  enemies.list = [enemy];
  enemies.refresh();
  return enemies;
}

describe('Battle', () => {
  let characters: Characters;
  let battle: Battle;

  beforeEach(() => {
    vi.useFakeTimers();
    // random(a, b) returns the middle of the range: no damage variance
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    characters = makeCharacters();
    battle = new Battle(characters, makeEnemies());
  });

  afterEach(() => {
    battle.stop();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts in the Started state', () => {
    expect(battle.state.value).toBe(BattleState.Started);
    expect(battle.victory).toBe(false);
  });

  it('makes enemies attack once per second', () => {
    vi.advanceTimersByTime(999);
    expect(characters.hp()).toBe(100);

    vi.advanceTimersByTime(1);
    expect(characters.hp()).toBe(90);

    vi.advanceTimersByTime(2000);
    expect(characters.hp()).toBe(70);
  });

  it('fills the limit gauge with damage taken', () => {
    vi.advanceTimersByTime(3000);
    expect(characters.limit).toBe(30);
  });

  it('ends in defeat when the team reaches 0 HP', () => {
    characters.hp.set(15);
    const states: BattleState[] = [];
    battle.state.subscribe((s) => states.push(s));

    vi.advanceTimersByTime(2000);

    expect(characters.hp()).toBe(0);
    expect(battle.victory).toBe(false);
    expect(states).toEqual([BattleState.Started, BattleState.Ended]);
    expect(battle.state.isStopped).toBe(true);
    expect(characters.limit).toBe(0);
  });

  it('stops attacking after a defeat', () => {
    characters.hp.set(10);
    vi.advanceTimersByTime(1000);
    characters.hp.set(50);

    vi.advanceTimersByTime(5000);
    expect(characters.hp()).toBe(50);
  });

  it('ends in victory and stops the enemy loop', () => {
    battle.end(true);

    expect(battle.victory).toBe(true);
    expect(battle.state.value).toBe(BattleState.Ended);

    vi.advanceTimersByTime(5000);
    expect(characters.hp()).toBe(100);
  });
});
