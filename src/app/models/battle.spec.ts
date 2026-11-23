import { Battle } from './battle';
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
  characters.hp.set(characters.hpMax());
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
  let onEnd: ReturnType<typeof vi.fn<(victory: boolean) => void>>;

  beforeEach(() => {
    vi.useFakeTimers();
    // 0.5: no damage variance, rounding to the nearest integer
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    characters = makeCharacters();
    onEnd = vi.fn<(victory: boolean) => void>();
    battle = new Battle(characters, makeEnemies(), onEnd);
    battle.start();
  });

  afterEach(() => {
    battle.stop();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts ongoing', () => {
    expect(battle.ended).toBe(false);
    expect(battle.victory).toBe(false);
    expect(onEnd).not.toHaveBeenCalled();
  });

  it('does not attack before start() is called', () => {
    const other = makeCharacters();
    const idle = new Battle(other, makeEnemies());

    vi.advanceTimersByTime(5000);

    expect(other.hp()).toBe(100);
    idle.stop();
  });

  it('ignores a second call to start()', () => {
    battle.start();

    vi.advanceTimersByTime(1000);

    expect(characters.hp()).toBe(90);
  });

  it('does not start after it has ended', () => {
    const other = makeCharacters();
    const idle = new Battle(other, makeEnemies());
    idle.end(false);
    idle.start();

    vi.advanceTimersByTime(5000);

    expect(other.hp()).toBe(100);
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
    expect(characters.limit()).toBe(30);
  });

  it('ends in defeat when the team reaches 0 HP', () => {
    characters.hp.set(15);

    vi.advanceTimersByTime(2000);

    expect(characters.hp()).toBe(0);
    expect(battle.victory).toBe(false);
    expect(battle.ended).toBe(true);
    expect(onEnd).toHaveBeenCalledExactlyOnceWith(false);
    expect(characters.limit()).toBe(0);
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
    expect(battle.ended).toBe(true);
    expect(onEnd).toHaveBeenCalledExactlyOnceWith(true);

    vi.advanceTimersByTime(5000);
    expect(characters.hp()).toBe(100);
  });

  it('only ends once', () => {
    battle.end(true);
    battle.end(false);

    expect(battle.victory).toBe(true);
    expect(onEnd).toHaveBeenCalledExactlyOnceWith(true);
  });
});
