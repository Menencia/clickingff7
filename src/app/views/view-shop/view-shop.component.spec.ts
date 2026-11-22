import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ShopService } from '../../core/services/shop.service';
import { StoreService } from '../../core/services/store.service';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { ViewShopComponent } from './view-shop.component';

describe('ViewShopComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewShopComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: GameService,
          useValue: {
            run: () => {},
            zones: { isNextZone: () => 1 },
            weapons: { list: [] },
            materias: { list: [] },
            items: { list: [] },
          },
        },
        {
          provide: StoreService,
          useValue: {
            getWeapon: () => {
              return { isAvailable: () => false };
            },
            getMateria: () => {
              return { isAvailable: () => false };
            },
            getItem: () => {
              return { ref: 'a', isAvailable: () => true };
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewShopComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('ViewShopComponent (real catalog)', () => {
  let shop: ViewShopComponent;
  let game: GameService;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ViewShopComponent],
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame();
    game.gils.set(100000);
    game.zones.levelMax = 2;
    shop = TestBed.createComponent(ViewShopComponent).componentInstance;
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('shows the shared catalog for the max zone reached', () => {
    const refs = shop.shopWeapons.map((w) => w.ref);
    expect(refs).toEqual(
      TestBed.inject(ShopService)
        .getWeapons(2)
        .map((w) => w.ref),
    );
    expect(shop.shopWeapons.every((w) => w.zoneAvailable <= 2)).toBe(true);
  });

  it('sorts player weapons without reordering the player stock', () => {
    const before = [...game.weapons.list];
    shop.buyWeapon(shop.shopWeapons[shop.shopWeapons.length - 1]);
    shop.buyWeapon(shop.shopWeapons[0]);
    const stock = [...game.weapons.list];
    shop.refresh();
    expect(game.weapons.list).toEqual(stock);
    expect(stock.slice(0, before.length)).toEqual(before);
    expect(shop.playerWeapons).toHaveLength(stock.length);
  });

  it('refreshes the player lists after a sale', () => {
    const item = game.items.list[0];
    item.nbr = 1;
    shop.sellItem(item);
    expect(shop.playerItems).not.toContain(item);
  });
});
