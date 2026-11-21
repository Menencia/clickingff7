import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { StoreService } from '../../core/services/store.service';
import { MAX_ITEMS } from '../../models/item';
import { ItemRef } from '../../models/refs/items';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { ViewItemsComponent } from './view-items.component';

describe('ViewItemsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewItemsComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: GameService,
          useValue: {
            run: () => {},
            items: { list: [] },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewItemsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('ViewItemsComponent (real data)', () => {
  let game: GameService;
  let view: ViewItemsComponent;

  const item = (ref: ItemRef) => {
    const found = game.items.list.find((i) => i.ref === ref);
    if (!found) throw new Error(`${ref} not owned`);
    return found;
  };

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ViewItemsComponent],
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame(); // zone 1: 2 Potions, stacked and equipped
    const store = TestBed.inject(StoreService);
    game.items.add(store.getItem(ItemRef.Ether));
    game.items.add(store.getItem(ItemRef.HiPotion));
    view = TestBed.createComponent(ViewItemsComponent).componentInstance;
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('a stack of items uses a single slot', () => {
    expect(item(ItemRef.Potion).nbr).toBe(2);
    expect(view.getNbrItems()).toBe(1);
    expect(view.canEquipItem(item(ItemRef.Potion))).toBe(false);
  });

  it(`cannot equip more than ${MAX_ITEMS} items`, () => {
    const ether = item(ItemRef.Ether);
    const hiPotion = item(ItemRef.HiPotion);
    expect(view.canEquipItem(ether)).toBe(true);

    view.equipItem(ether);
    expect(ether.equipped).toBe(true);
    expect(view.getNbrItems()).toBe(MAX_ITEMS);
    expect(view.canEquipItem(hiPotion)).toBe(false);

    view.unequipItem(item(ItemRef.Potion));
    expect(item(ItemRef.Potion).equipped).toBe(false);
    expect(game.items.getEquipped()).toEqual([ether]);
    expect(view.canEquipItem(hiPotion)).toBe(true);
  });
});
