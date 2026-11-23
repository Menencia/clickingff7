import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { GameService } from '../../../core/services/game.service';
import { MAX_FIGHTS } from '../../../models/zone';
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
      [
        ...fixture.nativeElement.querySelectorAll(
          '[data-group="battle"] .action-name',
        ),
      ].map((b: HTMLElement) => b.textContent?.trim());
    fixture.detectChanges();
    expect(labels().some((l) => l?.startsWith('Fight random'))).toBe(true);
    expect(labels()).not.toContain('Attack');
    expect(labels()).not.toContain('Escape');

    fixture.componentInstance.fightRandom();
    fixture.detectChanges();
    expect(labels()).toEqual(['Attack', 'Escape']);
    expect(labels()).not.toContain('Fight boss');
  });

  it('escaping outside a battle does nothing', () => {
    expect(() => actions.escape()).not.toThrow();
    expect(battleService.battle()).toBeUndefined();
  });

  it('disables the fight buttons for a moment after a battle', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    const first = () =>
      fixture.nativeElement.querySelector(
        '[data-group="battle"] button',
      ) as HTMLButtonElement;
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

  it('renders the three groups, with their title, for large screens', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const groups = [...el.querySelectorAll('[role="tabpanel"]')];

    expect(groups.map((g) => g.getAttribute('data-group'))).toEqual([
      'battle',
      'magic',
      'items',
    ]);
    expect(
      groups.map((g) => g.querySelector('h2')?.textContent?.trim()),
    ).toEqual(['Battle', 'Magic', 'Items']);
    expect(groups.map((g) => g.classList.contains('inactive'))).toEqual([
      false,
      true,
      true,
    ]);
  });

  it('sorts the actions into the Battle, Magic and Items tabs', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const tabs = [...el.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    // All the groups are rendered; below lg, only the open one shows.
    const panel = () => el.querySelector('[role="tabpanel"]:not(.inactive)');
    const count = () => panel()?.querySelectorAll('button').length;

    expect(tabs.map((t) => t.textContent?.trim())).toEqual([
      'Battle',
      'Magic',
      'Items',
    ]);
    expect(panel()?.getAttribute('data-group')).toBe('battle');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(count()).toBe(1);

    tabs[2].click();
    fixture.detectChanges();
    expect(panel()?.getAttribute('data-group')).toBe('items');
    expect(tabs[2].classList).toContain('tab-active');
    expect(count()).toBe(actions.getItems().length);

    tabs[1].click();
    fixture.detectChanges();
    expect(panel()?.getAttribute('data-group')).toBe('magic');
    expect(count()).toBe(actions.getMaterias().length);
  });

  it('shows Fight boss only when the boss can be fought', () => {
    const boss = () => {
      const fixture = TestBed.createComponent(UiActionsComponent);
      fixture.detectChanges();
      return [
        ...(fixture.nativeElement as HTMLElement).querySelectorAll('button'),
      ].find((b) => b.textContent?.includes('Fight boss'));
    };
    expect(boss()).toBeUndefined();

    game.zones.current().nbFights = MAX_FIGHTS;
    const button = boss();
    expect(button?.disabled).toBe(false);

    button?.click();
    expect(battleService.battle()?.enemies.list[0].boss).toBe(true);
  });

  it('tells how many victories are left before the boss', () => {
    const hint = () => {
      const fixture = TestBed.createComponent(UiActionsComponent);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      return el.querySelector('[data-testid="boss-hint"]')?.textContent?.trim();
    };
    const zone = game.zones.current();

    expect(hint()).toBe('Boss after victories');
    expect(actions.remainingFights()).toBe(MAX_FIGHTS);

    zone.nbFights = MAX_FIGHTS - 1;
    expect(hint()).toBe('Boss after 1 victory');

    zone.nbFights = MAX_FIGHTS;
    expect(hint()).toBeUndefined();
    expect(actions.remainingFights()).toBe(0);
  });

  it('shows a flask icon on the potion', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    fixture.componentInstance.tab.set('items');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const potion = [
      ...el.querySelectorAll<HTMLButtonElement>('[data-group="items"] button'),
    ].find((b) => b.textContent?.includes('It. potion name'));

    expect(potion?.querySelector('svg')).not.toBeNull();
  });

  it('shows a wand icon on the green materias', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    fixture.componentInstance.tab.set('magic');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('[data-group="magic"] button');

    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button.querySelector('svg')).not.toBeNull();
      expect(button.querySelector('img')).toBeNull();
    }
  });

  it('shows an icon on each battle action', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    const icons = () => {
      fixture.detectChanges();
      return [
        ...(fixture.nativeElement as HTMLElement).querySelectorAll(
          '[data-group="battle"] button svg',
        ),
      ].map((svg) => svg.getAttribute('data-icon'));
    };

    expect(icons()).toEqual(['swords']);

    fixture.componentInstance.fightRandom();
    expect(icons()).toEqual(['sword', 'footprints']);
  });

  it('adds a Limit button under Attack when the gauge is full', () => {
    const fixture = TestBed.createComponent(UiActionsComponent);
    const names = () => {
      fixture.detectChanges();
      return [
        ...(fixture.nativeElement as HTMLElement).querySelectorAll(
          '[data-group="battle"] .action-name',
        ),
      ].map((e) => e.textContent?.trim());
    };
    fixture.componentInstance.fightRandom();
    battleService.battle()?.enemies.hp.set(1_000_000);
    expect(names()).toEqual(['Attack', 'Escape']);

    game.characters.limit.set(game.characters.limitMax());
    expect(names()).toEqual(['Attack', 'Limit', 'Escape']);

    const limit = [
      ...(
        fixture.nativeElement as HTMLElement
      ).querySelectorAll<HTMLButtonElement>('[data-group="battle"] button'),
    ][1];
    limit.click();
    expect(game.characters.limit()).toBe(0);
    expect(names()).toEqual(['Attack', 'Escape']);
  });
});
