import { TestBed } from '@angular/core/testing';
import { StoreService } from '../core/services/store.service';
import {
  loadGameData,
  provideInMemoryGameData,
} from '../testing/game-data.testing';
import { MAX_ITEMS } from './item';
import { Items } from './items';
import { ItemRef } from './refs/items';

describe('Items', () => {
  let items: Items;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideInMemoryGameData()],
    });
    await loadGameData();
    const store = TestBed.inject(StoreService);
    items = new Items();
    items.add(store.getItem(ItemRef.Potion), true);
    items.add(store.getItem(ItemRef.Potion), true);
    items.add(store.getItem(ItemRef.Ether));
    items.add(store.getItem(ItemRef.HiPotion));
  });

  it('a stack of items uses a single slot', () => {
    expect(items.getEquipped()).toHaveLength(1);
    expect(items.canEquip(items.list[0])).toBe(false);
  });

  it(`does not equip more than ${MAX_ITEMS} items`, () => {
    const [, ether, hiPotion] = items.list;

    items.equip(ether);
    expect(ether.equipped).toBe(true);
    expect(items.canEquip(hiPotion)).toBe(false);

    items.equip(hiPotion);
    expect(hiPotion.equipped).toBe(false);
    expect(items.getEquipped()).toHaveLength(MAX_ITEMS);
  });

  it('unequipping frees a slot', () => {
    const [potion, ether, hiPotion] = items.list;
    items.equip(ether);

    items.unequip(potion);

    expect(potion.equipped).toBe(false);
    expect(items.canEquip(hiPotion)).toBe(true);
  });
});
