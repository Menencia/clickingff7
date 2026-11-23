import { TestBed } from '@angular/core/testing';
import { Difficulty } from '../../models/difficulty';
import { ELEMENTS } from '../../models/element-type';
import { HpPotion } from '../../models/items/hp-potion';
import { MpPotion } from '../../models/items/mp-potion';
import { AttackMateria } from '../../models/materias/attack-materia';
import { CureMateria } from '../../models/materias/cure-materia';
import { CharacterRef } from '../../models/refs/characters';
import { EnemyRef } from '../../models/refs/enemy';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import { ZoneRef } from '../../models/refs/zones';
import { WEAPON_TYPES } from '../../models/weapon-type';
import {
  loadGameData,
  provideInMemoryGameData,
} from '../../testing/game-data.testing';
import { DataService } from './data.service';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let store: StoreService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideInMemoryGameData()],
    });
    await loadGameData();
    store = TestBed.inject(StoreService);
  });

  it('builds models from the catalog', () => {
    const zone = store.getZone(ZoneRef.Zone1);
    expect(zone.ref).toBe(ZoneRef.Zone1);
    expect(zone.enemies.length).toBeGreaterThan(0);
    expect(zone.boss.length).toBeGreaterThan(0);

    const cloud = store.getCharacter(CharacterRef.Cloud);
    expect(cloud.weapon.ref).toBe(WeaponRef.BusterSword);

    expect(store.getMateria(MateriaRef.Bolt)).toBeInstanceOf(AttackMateria);
    expect(store.getMateria(MateriaRef.Restore)).toBeInstanceOf(CureMateria);
    expect(store.getItem(ItemRef.Potion)).toBeInstanceOf(HpPotion);
    expect(store.getItem(ItemRef.Ether)).toBeInstanceOf(MpPotion);
  });

  it('returns a new instance on every call', () => {
    const zone = store.getZone(ZoneRef.Zone1);
    zone.nbFights = 15;
    zone.completed = true;
    zone.enemies[0].toLevel(30, Difficulty.Normal);
    const fresh = store.getZone(ZoneRef.Zone1);
    expect(fresh).not.toBe(zone);
    expect(fresh.nbFights).toBe(0);
    expect(fresh.completed).toBe(false);
    expect(fresh.enemies[0]).not.toBe(zone.enemies[0]);
    expect(fresh.enemies[0].level).toBe(1);

    const cloud = store.getCharacter(CharacterRef.Cloud);
    cloud.setXp(1000);
    cloud.inTeam = true;
    cloud.weapon.nbr = 3;
    const freshCloud = store.getCharacter(CharacterRef.Cloud);
    expect(freshCloud.level).toBe(1);
    expect(freshCloud.xp).toBe(0);
    expect(freshCloud.inTeam).toBe(false);
    expect(freshCloud.weapon).not.toBe(cloud.weapon);
    expect(freshCloud.weapon.nbr).toBe(1);

    const weapon = store.getWeapon(WeaponRef.BusterSword);
    weapon.nbr = 2;
    expect(store.getWeapon(WeaponRef.BusterSword).nbr).toBe(1);

    const materia = store.getMateria(MateriaRef.Bolt);
    materia.setAp(1000);
    materia.equipped = true;
    expect(store.getMateria(MateriaRef.Bolt)).toMatchObject({
      level: 1,
      ap: 0,
      equipped: false,
    });

    const item = store.getItem(ItemRef.Potion);
    item.nbr = 5;
    item.equipped = true;
    expect(store.getItem(ItemRef.Potion)).toMatchObject({
      nbr: 1,
      equipped: false,
    });
  });

  it('throws on an unknown ref', () => {
    expect(() => store.getZone('zone99' as ZoneRef)).toThrow(
      'Zone zone99 not found',
    );
    expect(() => store.getWeapon('nope' as WeaponRef)).toThrow();
    expect(() => store.getCharacter('nope' as CharacterRef)).toThrow();
    expect(() => store.getMateria('nope' as MateriaRef)).toThrow();
    expect(() => store.getItem('nope' as ItemRef)).toThrow();
    expect(() => store.getEnemy('nope' as EnemyRef)).toThrow();
  });

  it('only uses known weapon types', () => {
    const data = TestBed.inject(DataService);
    const known: readonly string[] = WEAPON_TYPES;
    for (const weapon of data.weapons) {
      expect(known, weapon.ref).toContain(weapon.type);
    }
    for (const character of data.characters) {
      expect(known, character.ref).toContain(character.weaponType);
      expect(store.getWeapon(character.weapon).type, character.ref).toBe(
        character.weaponType,
      );
    }
  });

  it('gives every weapon type a weapon in the catalog', () => {
    const types = new Set(
      TestBed.inject(DataService).weapons.map((w) => w.type),
    );
    expect([...types].sort()).toEqual([...WEAPON_TYPES].sort());
  });

  it('only uses known elements', () => {
    const data = TestBed.inject(DataService);
    const known: readonly string[] = ELEMENTS;
    for (const enemy of data.enemies) {
      for (const element of [
        ...(enemy.weakness ?? []),
        ...(enemy.resistance ?? []),
      ]) {
        expect(known, enemy.ref).toContain(element);
      }
    }
    for (const ref of Object.values(MateriaRef)) {
      const materia = store.getMateria(ref);
      if (materia instanceof AttackMateria) {
        expect(materia.elements.length, ref).toBeGreaterThan(0);
        for (const element of materia.elements) {
          expect(known, ref).toContain(element);
        }
      }
    }
  });

  it('only uses known enemy refs in zones', () => {
    const known: string[] = Object.values(EnemyRef);
    for (const zone of TestBed.inject(DataService).zones) {
      for (const ref of [...zone.enemies, ...zone.boss]) {
        expect(known, zone.ref).toContain(ref);
      }
    }
  });
});
