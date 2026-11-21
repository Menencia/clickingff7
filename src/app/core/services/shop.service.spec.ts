import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MAX_ITEMS } from '../../models/item';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import {
  loadGameData,
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { GameService } from './game.service';
import { ShopService } from './shop.service';
import { StoreService } from './store.service';

describe('ShopService', () => {
  let service: ShopService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
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

describe('ShopService (buy and sell)', () => {
  let service: ShopService;
  let game: GameService;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame();
    game.gils.set(100000);
    service = TestBed.inject(ShopService);
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function shopWeapon(ref: WeaponRef) {
    const weapon = service.getWeapons(9).find((w) => w.ref === ref);
    if (!weapon) throw new Error(`${ref} not in shop`);
    return weapon;
  }

  function shopMateria(ref: MateriaRef) {
    const materia = service.getMaterias(9).find((m) => m.ref === ref);
    if (!materia) throw new Error(`${ref} not in shop`);
    return materia;
  }

  function shopItem(ref: ItemRef) {
    const item = service.getItems(9).find((i) => i.ref === ref);
    if (!item) throw new Error(`${ref} not in shop`);
    return item;
  }

  describe('weapons', () => {
    it('buying adds a copy, not the catalog object, and debits the price', () => {
      const weapon = shopWeapon(WeaponRef.AssaultGun);
      expect(service.buyWeapon(weapon)).toBe(true);

      const owned = game.weapons.list.find((w) => w.ref === weapon.ref);
      expect(owned).toBeDefined();
      expect(owned).not.toBe(weapon);
      expect(
        owned && game.weapons.isEquipped(owned, game.characters.list),
      ).toBe(false);
      expect(weapon.nbr).toBe(1);
      expect(game.gils()).toBe(100000 - weapon.getPrice());
    });

    it('cannot buy without enough gils', () => {
      const weapon = shopWeapon(WeaponRef.AssaultGun);
      game.gils.set(weapon.getPrice() - 1);
      expect(service.canBuyWeapon(weapon)).toBe(false);
      expect(service.buyWeapon(weapon)).toBe(false);
      expect(game.weapons.list.some((w) => w.ref === weapon.ref)).toBe(false);
      expect(game.gils()).toBe(weapon.getPrice() - 1);

      game.gils.set(weapon.getPrice());
      expect(service.buyWeapon(weapon)).toBe(true);
      expect(game.gils()).toBe(0);
    });

    it('cannot buy a weapon already in stock', () => {
      const weapon = shopWeapon(WeaponRef.BusterSword);
      const before = game.weapons.list.map((w) => w.nbr);
      expect(service.canBuyWeapon(weapon)).toBe(false);
      expect(service.buyWeapon(weapon)).toBe(false);
      expect(game.weapons.list.map((w) => w.nbr)).toEqual(before);
      expect(game.gils()).toBe(100000);
    });

    it('cannot sell the last equipped copy', () => {
      const weapon = game.weapons.list.find((w) =>
        game.weapons.isEquipped(w, game.characters.list),
      );
      if (!weapon) throw new Error('no equipped weapon');
      expect(weapon.nbr).toBe(1);
      expect(service.sellWeapon(weapon)).toBe(false);
      expect(game.weapons.list).toContain(weapon);
      expect(game.gils()).toBe(100000);

      weapon.nbr = 2;
      expect(service.sellWeapon(weapon)).toBe(true);
      expect(weapon.nbr).toBe(1);
      expect(game.weapons.list).toContain(weapon);
      expect(game.gils()).toBe(100000 + weapon.getSellPrice());
    });

    it('a weapon replaced by another one can be sold', () => {
      const cloud = game.characters.list[0];
      const busterSword = cloud.weapon;
      const saber = TestBed.inject(StoreService).getWeapon(
        WeaponRef.MythrilSaber,
      );
      game.weapons.add(saber);
      expect(service.canSellWeapon(busterSword)).toBe(false);
      expect(service.canSellWeapon(saber)).toBe(true);

      game.equipWeapon(cloud, saber);

      expect(service.canSellWeapon(busterSword)).toBe(true);
      expect(service.canSellWeapon(saber)).toBe(false);
    });

    it('selling the last unequipped copy removes it from the stock', () => {
      service.buyWeapon(shopWeapon(WeaponRef.AssaultGun));
      const owned = game.weapons.list.find(
        (w) => w.ref === WeaponRef.AssaultGun,
      );
      if (!owned) throw new Error('AssaultGun not bought');
      const gils = game.gils();
      expect(service.sellWeapon(owned)).toBe(true);
      expect(game.weapons.list).not.toContain(owned);
      expect(game.gils()).toBe(gils + owned.getSellPrice());
    });

    it('cannot sell a weapon the player does not own', () => {
      const weapon = shopWeapon(WeaponRef.AssaultGun);
      expect(service.canSellWeapon(weapon)).toBe(false);
      expect(service.sellWeapon(weapon)).toBe(false);
      expect(game.gils()).toBe(100000);
    });
  });

  describe('materias', () => {
    it('buying adds a copy, not the catalog object, and debits the price', () => {
      const materia = shopMateria(MateriaRef.Ice);
      expect(service.buyMateria(materia)).toBe(true);

      const owned = game.materias.list.find((m) => m.ref === materia.ref);
      expect(owned).toBeDefined();
      expect(owned).not.toBe(materia);
      expect(game.gils()).toBe(100000 - materia.getPrice());
    });

    it('cannot buy without enough gils, nor a materia already owned', () => {
      const ice = shopMateria(MateriaRef.Ice);
      game.gils.set(ice.getPrice() - 1);
      expect(service.buyMateria(ice)).toBe(false);
      expect(ice.isOwned(game.materias.list)).toBe(false);

      game.gils.set(100000);
      const owned = game.materias.list[0];
      const length = game.materias.list.length;
      expect(service.canBuyMateria(shopMateria(owned.ref))).toBe(false);
      expect(service.buyMateria(shopMateria(owned.ref))).toBe(false);
      expect(game.materias.list).toHaveLength(length);
      expect(game.gils()).toBe(100000);
    });

    it('cannot sell an equipped materia', () => {
      const materia = game.materias.list[0];
      materia.equipped = true;
      expect(service.canSellMateria(materia)).toBe(false);
      expect(service.sellMateria(materia)).toBe(false);
      expect(game.materias.list).toContain(materia);
      expect(game.gils()).toBe(100000);

      materia.equipped = false;
      expect(service.sellMateria(materia)).toBe(true);
      expect(game.materias.list).not.toContain(materia);
      expect(game.gils()).toBe(100000 + materia.getSellPrice());
    });

    it('cannot sell a materia the player does not own', () => {
      const materia = shopMateria(MateriaRef.Ice);
      expect(service.sellMateria(materia)).toBe(false);
      expect(game.gils()).toBe(100000);
    });
  });

  describe('items', () => {
    it('buying twice stacks on the owned copy only', () => {
      const item = shopItem(ItemRef.Ether);
      service.buyItem(item);
      service.buyItem(item);

      const owned = game.items.list.find((i) => i.ref === item.ref);
      expect(owned).not.toBe(item);
      expect(owned?.nbr).toBe(2);
      expect(item.nbr).toBe(1);
      expect(game.gils()).toBe(100000 - 2 * item.getPrice());
    });

    it('cannot buy without enough gils', () => {
      const item = shopItem(ItemRef.Ether);
      game.gils.set(item.getPrice() - 1);
      expect(service.canBuyItem(item)).toBe(false);
      expect(service.buyItem(item)).toBe(false);
      expect(game.items.list.some((i) => i.ref === item.ref)).toBe(false);
      expect(game.gils()).toBe(item.getPrice() - 1);
    });

    it('equips a new item only while a slot is free', () => {
      game.items.list = [];
      const refs = [ItemRef.Potion, ItemRef.Ether, ItemRef.HiPotion];
      for (const ref of refs) service.buyItem(shopItem(ref));
      expect(game.items.getEquipped()).toHaveLength(MAX_ITEMS);
      const last = game.items.list.find((i) => i.ref === ItemRef.HiPotion);
      expect(last?.equipped).toBe(false);
    });

    it('selling decrements the stack, then removes it', () => {
      const item = game.items.list[0];
      item.nbr = 2;
      expect(service.sellItem(item)).toBe(true);
      expect(item.nbr).toBe(1);
      expect(game.items.list).toContain(item);
      expect(service.sellItem(item)).toBe(true);
      expect(game.items.list).not.toContain(item);
      expect(game.gils()).toBe(100000 + 2 * item.getSellPrice());
    });

    it('cannot sell an item the player does not own', () => {
      const item = shopItem(ItemRef.Ether);
      expect(service.canSellItem(item)).toBe(false);
      expect(service.sellItem(item)).toBe(false);
      expect(game.gils()).toBe(100000);
    });
  });
});
