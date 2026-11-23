import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { BattleService } from '../../core/services/battle.service';
import { GameService } from '../../core/services/game.service';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { DEFEAT_DISPLAY, ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGameComponent],
      providers: [
        provideRouter([]),
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
    const fixture = TestBed.createComponent(ViewGameComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('ViewGameComponent (real data)', () => {
  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    TestBed.configureTestingModule({
      imports: [ViewGameComponent],
      providers: [
        provideInMemoryGameData(),
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    const game = await startGame();
    clearTimeout(game.timer);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('displays the current zone', async () => {
    const fixture = TestBed.createComponent(ViewGameComponent);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const zone = el.querySelector('[data-tour="zone"]')?.textContent;
    expect(el.querySelector('h1')?.textContent).toContain('Zone 1 name');
    expect(zone).toContain('#1');
    expect(zone).toContain('Current zone');
  });

  it('links to the zones screen', async () => {
    const fixture = TestBed.createComponent(ViewGameComponent);
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="change-zone"]',
    );
    expect(link?.getAttribute('href')).toBe('/map');
    expect(link?.textContent).toContain('Change zone');
  });

  it('flags the zone button when the next zone is available', async () => {
    const flagged = async () => {
      const fixture = TestBed.createComponent(ViewGameComponent);
      await fixture.whenStable();
      return !!(fixture.nativeElement as HTMLElement).querySelector(
        '[data-testid="change-zone"] [data-testid="next-zone"]',
      );
    };
    expect(await flagged()).toBe(false);

    TestBed.inject(GameService).zones.isNextZone = () => true;
    expect(await flagged()).toBe(true);
  });

  describe('end of a battle', () => {
    let battleService: BattleService;

    beforeEach(() => {
      vi.useFakeTimers();
      battleService = TestBed.inject(BattleService);
    });

    afterEach(() => {
      battleService.battle()?.stop();
      vi.useRealTimers();
    });

    function render() {
      const fixture = TestBed.createComponent(ViewGameComponent);
      const gauge = () => {
        fixture.detectChanges();
        return (fixture.nativeElement as HTMLElement).querySelector(
          'app-enemies-panel app-radial-gauge',
        );
      };
      return gauge;
    }

    it('keeps the defeated enemy for a moment after a victory', () => {
      const gauge = render();
      battleService.startRandom();
      battleService.battle()?.enemies.hp.set(1);
      expect(gauge()).not.toBeNull();

      battleService.attack();
      expect(battleService.battle()).toBeUndefined();
      expect(gauge()).not.toBeNull();
      expect(gauge()?.querySelector('.defeated')).not.toBeNull();

      vi.advanceTimersByTime(DEFEAT_DISPLAY);
      expect(gauge()).toBeNull();
    });

    it('clears the enemy right away after an escape', () => {
      const gauge = render();
      battleService.startRandom();
      expect(gauge()).not.toBeNull();

      battleService.escape();
      expect(gauge()).toBeNull();
    });
  });
});
