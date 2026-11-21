import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { GameService } from '../../../core/services/game.service';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../../testing/game-data.testing';
import { UiActionsComponent } from './ui-actions.component';

describe('UiActionsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiActionsComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: GameService,
          useValue: {
            run: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('UiActionsComponent (real data)', () => {
  let game: GameService;
  let battleService: BattleService;
  let actions: UiActionsComponent;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [UiActionsComponent],
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame();
    battleService = TestBed.inject(BattleService);
    actions = TestBed.createComponent(UiActionsComponent).componentInstance;
  });

  afterEach(() => {
    battleService.battle()?.stop();
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('escaping ends the battle without rewards', () => {
    actions.fightRandom();
    const battle = battleService.battle();
    expect(battle).toBeDefined();
    const gils = game.gils();
    const xp = game.characters.list.map((c) => c.xp);
    const hp = game.characters.hp();

    actions.escape();

    expect(battleService.battle()).toBeUndefined();
    expect(battle?.victory).toBe(false);
    expect(actions.isBattle()).toBe(false);
    expect(game.gils()).toBe(gils);
    expect(game.characters.list.map((c) => c.xp)).toEqual(xp);
    expect(game.zones.current().nbFights).toBe(0);
    expect(game.characters.hp()).toBe(hp);
    expect(actions.canFightRandom()).toBe(true);
  });

  it('the enemies stop attacking after an escape', () => {
    actions.fightRandom();
    actions.escape();
    const hp = game.characters.hp();

    vi.advanceTimersByTime(10_000);

    expect(game.characters.hp()).toBe(hp);
  });

  it('escaping outside a battle does nothing', () => {
    expect(() => actions.escape()).not.toThrow();
    expect(battleService.battle()).toBeUndefined();
  });
});
