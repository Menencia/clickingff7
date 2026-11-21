import { TestBed } from '@angular/core/testing';
import { StoreService } from '../core/services/store.service';
import {
  loadGameData,
  provideInMemoryGameData,
} from '../testing/game-data.testing';
import { Materias } from './materias';
import { MateriaRef } from './refs/materias';

describe('Materias', () => {
  let materias: Materias;
  let store: StoreService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideInMemoryGameData()],
    });
    await loadGameData();
    store = TestBed.inject(StoreService);
    materias = new Materias();
    materias.add(store.getMateria(MateriaRef.Restore), true);
    materias.add(store.getMateria(MateriaRef.Bolt));
  });

  it('equips a materia while a slot is free', () => {
    const [, bolt] = materias.list;
    expect(materias.canEquip(bolt, 2)).toBe(true);

    materias.equip(bolt, 2);

    expect(bolt.equipped).toBe(true);
    expect(materias.getEquipped()).toHaveLength(2);
  });

  it('does not equip a materia when all slots are used', () => {
    const [, bolt] = materias.list;
    expect(materias.canEquip(bolt, 1)).toBe(false);

    materias.equip(bolt, 1);

    expect(bolt.equipped).toBe(false);
  });

  it('cannot equip an equipped materia', () => {
    const [restore] = materias.list;
    expect(materias.canEquip(restore, 5)).toBe(false);
  });

  it('unequipping frees a slot', () => {
    const [restore, bolt] = materias.list;

    materias.unequip(restore);

    expect(restore.equipped).toBe(false);
    expect(materias.canEquip(bolt, 1)).toBe(true);
  });
});
