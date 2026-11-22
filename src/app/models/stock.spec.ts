import { TestBed } from '@angular/core/testing';
import { StoreService } from '../core/services/store.service';
import {
  loadGameData,
  provideInMemoryGameData,
} from '../testing/game-data.testing';
import { Items } from './items';
import { ItemRef } from './refs/items';
import { MateriaRef } from './refs/materias';
import { WeaponRef } from './refs/weapons';
import { Weapons } from './weapons';

describe('Stock', () => {
  let store: StoreService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideInMemoryGameData()],
    });
    await loadGameData();
    store = TestBed.inject(StoreService);
  });

  it('stacks weapons with the same ref on the owned entry', () => {
    const weapons = new Weapons();
    const owned = store.getWeapon(WeaponRef.BusterSword);

    expect(weapons.add(owned)).toBe(owned);
    expect(weapons.add(store.getWeapon(WeaponRef.BusterSword))).toBe(owned);
    weapons.add(store.getWeapon(WeaponRef.MythrilSaber));

    expect(weapons.list).toHaveLength(2);
    expect(owned.nbr).toBe(2);
  });

  it('counts the owned copies, or 0 when none is owned', () => {
    const weapons = new Weapons();
    weapons.add(store.getWeapon(WeaponRef.BusterSword));
    weapons.add(store.getWeapon(WeaponRef.BusterSword));

    expect(weapons.inStock(store.getWeapon(WeaponRef.BusterSword))).toBe(2);
    expect(weapons.inStock(store.getWeapon(WeaponRef.MythrilSaber))).toBe(0);
  });

  it('removes one copy, then drops the entry at the last copy', () => {
    const weapons = new Weapons();
    const owned = weapons.add(store.getWeapon(WeaponRef.BusterSword));
    weapons.add(store.getWeapon(WeaponRef.BusterSword));
    const other = weapons.add(store.getWeapon(WeaponRef.MythrilSaber));
    const before = weapons.list;

    weapons.remove(owned);
    expect(owned.nbr).toBe(1);
    expect(weapons.list).toEqual([owned, other]);

    weapons.remove(owned);
    expect(weapons.list).toEqual([other]);
    expect(weapons.list).not.toBe(before);
    expect(weapons.inStock(owned)).toBe(0);
  });

  it('only applies the equipped flag to an item not owned yet', () => {
    const items = new Items();
    const potion = store.getItem(ItemRef.Potion);
    items.add(potion);

    items.add(store.getItem(ItemRef.Potion), true);

    expect(potion.equipped).toBe(false);
    expect(items.inStock(potion)).toBe(2);

    const ether = store.getItem(ItemRef.Ether);
    items.add(ether, true);
    expect(ether.equipped).toBe(true);
  });
});

describe('Purchasable', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideInMemoryGameData()],
    });
    await loadGameData();
  });

  it('sells weapons, materias and items back at half their price', () => {
    const store = TestBed.inject(StoreService);
    const products = [
      store.getWeapon(WeaponRef.MythrilSaber),
      store.getMateria(MateriaRef.Bolt),
      store.getItem(ItemRef.Ether),
    ];

    for (const product of products) {
      expect(product.getPrice()).toBeGreaterThan(0);
      expect(product.getSellPrice()).toBe(product.getPrice() / 2);
    }
  });

  it('is available from the zone it is sold from', () => {
    const store = TestBed.inject(StoreService);
    const products = [
      store.getWeapon(WeaponRef.MythrilSaber),
      store.getMateria(MateriaRef.Bolt),
      store.getItem(ItemRef.Ether),
    ];

    for (const product of products) {
      expect(product.isAvailable(product.zoneAvailable - 1)).toBe(false);
      expect(product.isAvailable(product.zoneAvailable)).toBe(true);
      expect(product.isAvailable(product.zoneAvailable + 1)).toBe(true);
    }
  });
});
