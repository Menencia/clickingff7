import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { StoreService } from '../../core/services/store.service';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import {
  loadGameData,
  MemoryStorage,
  provideInMemoryGameData,
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
              return {};
            },
            getMateria: () => {
              return {};
            },
            getItem: () => {
              return { ref: 'a', available: () => true };
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
    await loadGameData();
    game = TestBed.inject(GameService);
    game.gils = 100000;
    game.zones.levelMax = 2;
    shop = TestBed.createComponent(ViewShopComponent).componentInstance;
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('buying a weapon adds a copy, not the catalog object', () => {
    const weapon = shop.shopWeapons.find((w) => w.ref === WeaponRef.AssaultGun);
    if (!weapon) throw new Error('AssaultGun not in shop');
    shop.buyWeapon(weapon);

    const owned = game.weapons.list.find((w) => w.ref === weapon.ref);
    expect(owned).toBeDefined();
    expect(owned).not.toBe(weapon);
    expect(weapon).toMatchObject({ nbr: 1, equipped: false });
  });

  it('buying a materia adds a copy, not the catalog object', () => {
    const materia = shop.shopMaterias.find((m) => m.ref === MateriaRef.Ice);
    if (!materia) throw new Error('Ice not in shop');
    shop.buyMateria(materia);

    const owned = game.materias.list.find((m) => m.ref === materia.ref);
    expect(owned).toBeDefined();
    expect(owned).not.toBe(materia);
  });

  it('buying an item twice stacks on the owned copy only', () => {
    const item = shop.shopItems.find((i) => i.ref === ItemRef.Ether);
    if (!item) throw new Error('Ether not in shop');
    shop.buyItem(item);
    shop.buyItem(item);

    const owned = game.items.list.find((i) => i.ref === item.ref);
    expect(owned).not.toBe(item);
    expect(owned?.nbr).toBe(2);
    expect(item.nbr).toBe(1);
  });
});
