import { TestBed } from '@angular/core/testing';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import {
  loadGameData,
  provideInMemoryGameData,
} from '../../testing/game-data.testing';
import { ShopService } from './shop.service';
import { StoreService } from './store.service';

describe('ShopService', () => {
  let service: ShopService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideInMemoryGameData()],
    });
    await loadGameData();
    service = TestBed.inject(ShopService);
  });

  it('filters the catalog by zone availability', () => {
    for (const levelMax of [1, 2, 5, 9]) {
      expect(
        service.getWeapons(levelMax).every((w) => w.zoneAvailable <= levelMax),
      ).toBe(true);
      expect(
        service.getMaterias(levelMax).every((m) => m.zoneAvailable <= levelMax),
      ).toBe(true);
      expect(
        service.getItems(levelMax).every((i) => i.available(levelMax)),
      ).toBe(true);
    }
  });

  it('grows the catalog as zones are unlocked', () => {
    const zone1 = service.getWeapons(1).map((w) => w.ref);
    const zone9 = service.getWeapons(9).map((w) => w.ref);
    expect(zone1.length).toBeLessThan(zone9.length);
    expect(zone9).toEqual(expect.arrayContaining(zone1));
    expect(zone9).toContain(WeaponRef.FPtShuriken);
    expect(service.getMaterias(9).map((m) => m.ref)).toContain(
      MateriaRef.ChocoMog,
    );
    expect(service.getItems(9).map((i) => i.ref)).toContain(ItemRef.HiEther);
  });

  it('sorts weapons by type for all 6 types, then by hits', () => {
    const store = TestBed.inject(StoreService);
    const all = Object.values(WeaponRef).map((ref) => store.getWeapon(ref));
    const weapons = service.sortWeapons(all.reverse());
    const order = [
      'broadsword',
      'gun-arm',
      'knuckle',
      'stave',
      'headdresse',
      'shuriken',
    ];
    expect([...new Set(weapons.map((w) => w.type))]).toEqual(order);
    for (let i = 1; i < weapons.length; i++) {
      if (weapons[i].type === weapons[i - 1].type) {
        expect(weapons[i].hits).toBeGreaterThanOrEqual(weapons[i - 1].hits);
      }
    }
  });

  it('sorts materias by power and items by ref', () => {
    const pwr = service.getMaterias(9).map((m) => m.pwr);
    expect(pwr).toEqual([...pwr].sort((a, b) => a - b));
    const refs = service.getItems(9).map((i) => i.ref);
    expect(refs).toEqual([...refs].sort((a, b) => a.localeCompare(b)));
  });

  it('returns fresh instances on every call', () => {
    const [first] = service.getWeapons(1);
    const [again] = service.getWeapons(1);
    expect(again).not.toBe(first);
    expect(again.ref).toBe(first.ref);
  });

  it('does not reorder the array it sorts', () => {
    const weapons = service.getWeapons(9).reverse();
    const before = [...weapons];
    service.sortWeapons(weapons);
    expect(weapons).toEqual(before);
  });
});
