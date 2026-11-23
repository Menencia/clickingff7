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

  it('removes only the given materia', () => {
    const [restore, bolt] = materias.list;

    materias.remove(restore);

    expect(materias.list).toEqual([bolt]);
  });

  it('ignores a materia it does not hold', () => {
    const [restore, bolt] = materias.list;

    materias.remove(store.getMateria(MateriaRef.Restore));

    expect(materias.list).toEqual([restore, bolt]);
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

  describe('fit', () => {
    beforeEach(() => {
      const fire = store.getMateria(MateriaRef.Fire);
      materias.add(fire, true);
      materias.list[1].equipped = true; // Restore, Bolt, Fire equipped
    });

    it('unequips the last equipped materias beyond the slots', () => {
      materias.fit(1);

      expect(materias.getEquipped().map((m) => m.ref)).toEqual([
        MateriaRef.Restore,
      ]);
    });

    it('keeps every materia when the slots are enough', () => {
      materias.fit(3);
      expect(materias.getEquipped()).toHaveLength(3);

      materias.fit(5);
      expect(materias.getEquipped()).toHaveLength(3);
    });

    it('unequips everything when there is no slot', () => {
      materias.fit(0);
      expect(materias.getEquipped()).toEqual([]);
    });
  });

  it('clear empties the same list', () => {
    const list = materias.list;

    materias.clear();

    expect(materias.list).toBe(list);
    expect(list).toEqual([]);
    expect(materias.getEquipped()).toEqual([]);
  });
});
