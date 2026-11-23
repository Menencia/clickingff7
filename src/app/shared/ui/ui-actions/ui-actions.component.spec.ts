import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { GameService } from '../../../core/services/game.service';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../../testing/game-data.testing';
import { FIGHT_COOLDOWN, UiActionsComponent } from './ui-actions.component';

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

  it('hides offensive materias outside a battle', () => {
    const refs = () => actions.getMaterias().map((m) => m.ref);
    const equipped = game.materias.getEquipped();
    const offensive = equipped.filter((m) => m.isBattleOnly());
    expect(offensive.length).toBeGreaterThan(0);

    expect(refs()).toEqual(
      equipped.filter((m) => !m.isBattleOnly()).map((m) => m.ref),
    );

    actions.fightRandom();
    expect(refs()).toEqual(equipped.map((m) => m.ref));
  });

  it('swaps the fight buttons for Attack and Escape during a battle', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    const labels = () =>
      [...fixture.nativeElement.querySelectorAll('button')].map(
        (b: HTMLButtonElement) => b.textContent?.trim(),
      );
    fixture.detectChanges();
    expect(labels()).toContain('Fight boss');
    expect(labels()).not.toContain('Attack');
    expect(labels()).not.toContain('Escape');

    fixture.componentInstance.fightRandom();
    fixture.detectChanges();
    expect(labels()).toEqual(['Attack', 'Escape', ...labels().slice(2)]);
    expect(labels()).not.toContain('Fight boss');
  });

  it('escaping outside a battle does nothing', () => {
    expect(() => actions.escape()).not.toThrow();
    expect(battleService.battle()).toBeUndefined();
  });

  it('disables the fight buttons for a moment after a battle', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    const first = () =>
      fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    fixture.detectChanges();

    first().click();
    fixture.detectChanges();
    expect(battleService.battle()).toBeDefined();

    // The battle ends: a click left over on Attack lands on Fight random.
    battleService.battle()?.end(true);
    fixture.detectChanges();
    expect(first().textContent).toContain('Fight random');
    expect(first().disabled).toBe(true);
    first().click();
    expect(battleService.battle()).toBeUndefined();
    expect(fixture.componentInstance.canFightBoss()).toBe(false);

    vi.advanceTimersByTime(FIGHT_COOLDOWN);
    fixture.detectChanges();
    expect(first().disabled).toBe(false);
    first().click();
    expect(battleService.battle()).toBeDefined();
  });
});
