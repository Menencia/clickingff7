import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Difficulty } from '../../models/difficulty';
import { Items } from '../../models/items';
import { Materias } from '../../models/materias';
import { Characters } from '../../models/units/characters';
import { Weapons } from '../../models/weapons';
import { Zones } from '../../models/zones';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { GameService } from './game.service';
import { GameState, SaveService } from './save.service';

/** Empty game state, as GameService.preload() leaves it. */
function emptyState(): GameState {
  return {
    characters: new Characters(),
    zones: new Zones(),
    weapons: new Weapons(),
    materias: new Materias(),
    items: new Items(),
    gils: signal(0),
    language: 'en',
    difficulty: Difficulty.Normal,
    time: signal(0),
    version: '0.0.0',
  };
}

describe('SaveService', () => {
  let game: GameService;
  let saves: SaveService;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame();
    clearTimeout(game.timer);
    saves = TestBed.inject(SaveService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('loads into another state what it exported', () => {
    const save = saves.export(game);
    // load() keeps the state's version, set by GameService.preload()
    const state = { ...emptyState(), version: save.version };

    saves.load(state, structuredClone(save));

    expect(saves.export(state)).toEqual(save);
  });

  it('throws on a save without a team', () => {
    const save = saves.export(game);
    save.characters.list.forEach((c) => {
      c.inTeam = false;
    });

    expect(() => saves.load(emptyState(), save)).toThrow('Empty team');
  });
});
