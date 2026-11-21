import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { CharacterRef } from '../../models/refs/characters';
import { WeaponRef } from '../../models/refs/weapons';
import { MAX_ZONES } from '../../models/zones';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { ViewMapComponent } from './view-map.component';

describe('ViewMapComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMapComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: GameService,
          useValue: {
            run: () => {},
            zones: { current: () => 1 },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewMapComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('ViewMapComponent (real data)', () => {
  let game: GameService;
  let map: ViewMapComponent;

  const refs = <T extends { ref: string }>(list: T[]) => list.map((e) => e.ref);

  // completes the current zone and goes to the next one, until {level}
  const reachZone = (level: number) => {
    while (game.zones.level < level) {
      game.zones.complete();
      map.goNextZone();
    }
  };

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ViewMapComponent],
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame();
    map = TestBed.createComponent(ViewMapComponent).componentInstance;
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('offers the next zone once the current zone is completed', () => {
    expect(map.canGoNextZone()).toBe(false);
    game.zones.complete();
    expect(map.canGoNextZone()).toBe(true);
  });

  it('a new zone is built and unlocked', () => {
    game.zones.complete();
    map.goNextZone();

    expect(game.zones.level).toBe(2);
    expect(game.zones.levelMax).toBe(2);
    expect(game.zones.list.map((z) => z.level)).toEqual([1, 2]);
    expect(map.level).toBe(2);
    expect(map.current).toBe(game.zones.current());
    expect(map.current.level).toBe(2);
    expect(refs(game.characters.team())).toEqual([
      CharacterRef.Cloud,
      CharacterRef.Barret,
      CharacterRef.Tifa,
    ]);
    expect(game.characters.hp()).toBe(game.characters.hpMax());
  });

  it('goes back to a known zone without rebuilding it', () => {
    reachZone(2);
    const zone2 = game.zones.current();
    const nbCharacters = game.characters.list.length;
    const nbWeapons = game.weapons.list.length;

    map.goZone(1);
    expect(game.zones.level).toBe(1);
    expect(map.level).toBe(1);
    expect(map.current.level).toBe(1);
    expect(map.canGoNextZone()).toBe(true);

    map.goNextZone();
    expect(game.zones.level).toBe(2);
    expect(game.zones.levelMax).toBe(2);
    expect(game.zones.current()).toBe(zone2);
    expect(game.zones.list).toHaveLength(2);
    expect(game.characters.list).toHaveLength(nbCharacters);
    expect(game.weapons.list).toHaveLength(nbWeapons);
  });

  it('zone 5: Red XIII joins the backup with his weapon', () => {
    reachZone(5);

    expect(refs(game.characters.getBackup())).toEqual([CharacterRef.RedXIII]);
    const weapon = game.weapons.list.find(
      (w) => w.ref === WeaponRef.MythrilClip,
    );
    expect(
      weapon && game.weapons.isEquipped(weapon, game.characters.list),
    ).toBe(true);
  });

  it('zone 9: Yuffie joins the backup, and there is no next zone', () => {
    reachZone(MAX_ZONES);

    expect(game.zones.levelMax).toBe(MAX_ZONES);
    expect(refs(game.characters.getBackup())).toContain(CharacterRef.Yuffie);
    const weapon = game.weapons.list.find(
      (w) => w.ref === WeaponRef.FPtShuriken,
    );
    expect(
      weapon && game.weapons.isEquipped(weapon, game.characters.list),
    ).toBe(true);

    game.zones.complete();
    expect(map.canGoNextZone()).toBe(false);
  });
});
