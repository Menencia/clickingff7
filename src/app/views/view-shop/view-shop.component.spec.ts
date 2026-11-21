import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ShopService } from '../../core/services/shop.service';
import { StoreService } from '../../core/services/store.service';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
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

  it('cannot sell an equipped materia', () => {
    const materia = game.materias.list[0];
    materia.equipped = true;
    const gils = game.gils();
    expect(shop.canSellMateria(materia)).toBe(false);
    shop.sellMateria(materia);
    expect(game.materias.list).toContain(materia);
    expect(game.gils()).toBe(gils);

    materia.equipped = false;
    expect(shop.canSellMateria(materia)).toBe(true);
    shop.sellMateria(materia);
    expect(game.materias.list).not.toContain(materia);
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
});
