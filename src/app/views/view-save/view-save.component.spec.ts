import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { CharacterRef } from '../../models/refs/characters';
import { ZoneRef } from '../../models/refs/zones';
import { encodeSave } from '../../shared/utils/save.utils';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { ViewSaveComponent } from './view-save.component';

const refs = <T extends { ref: string }>(list: T[]) => list.map((e) => e.ref);

describe('ViewSaveComponent', () => {
  let game: GameService;
  let component: ViewSaveComponent;
  let navigate: ReturnType<typeof vi.fn>;

  /** Completes the current zone and moves the game to the next one */
  function unlockNextZone(): void {
    game.zones.complete();
    game.goNextZone();
  }

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();

    navigate = vi.fn();
    TestBed.configureTestingModule({
      imports: [ViewSaveComponent],
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: Router, useValue: { navigateByUrl: navigate } },
      ],
    });
    game = await startGame();

    const fixture = TestBed.createComponent(ViewSaveComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('reset', () => {
    it('erases the save and starts a new game in zone 1', () => {
      unlockNextZone();
      game.gils.set(5000);
      game.save();

      component.resetGame();

      expect(localStorage.getItem('save1')).toBeNull();
      expect(game.saves).toEqual([]);
      expect(refs(game.zones.list)).toEqual([ZoneRef.Zone1]);
      expect(refs(game.characters.list)).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
      ]);
      expect(game.gils()).toBe(200);
      expect(navigate).toHaveBeenCalledWith('game');
    });

    it('does nothing without a save', () => {
      unlockNextZone();

      component.resetGame();

      expect(game.zones.list.length).toBe(2);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('import', () => {
    it('loads a valid save and goes to the game screen', () => {
      unlockNextZone();
      game.gils.set(1234);
      const save = structuredClone(game.export());
      game.newGame();

      component.areaImport = encodeSave(save);
      expect(component.checkImport()).toBe(true);
      component.importSave();

      expect(component.importError).toBe(false);
      expect(game.export()).toEqual(save);
      expect(navigate).toHaveBeenCalledWith('game');
    });

    it('does not overwrite the stored save', () => {
      game.save();
      const stored = localStorage.getItem('save1');
      unlockNextZone();

      component.areaImport = encodeSave(game.export());
      component.importSave();

      expect(localStorage.getItem('save1')).toBe(stored);
    });

    it('rejects an invalid string before confirmation', () => {
      component.areaImport = 'not a save';

      expect(component.checkImport()).toBe(false);
      expect(component.importError).toBe(true);
    });

    it('keeps the current game if the string is invalid', () => {
      unlockNextZone();
      const before = game.export();

      component.areaImport = 'not a save';
      component.importSave();

      expect(component.importError).toBe(true);
      expect(game.export()).toEqual(before);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('keeps the current game if the save references unknown data', () => {
      unlockNextZone();
      game.gils.set(777);
      const before = structuredClone(game.export());
      const save = structuredClone(before);
      save.gils = 1;
      save.materias[0].ref = 'unknown' as never;

      component.areaImport = encodeSave(save);
      expect(component.checkImport()).toBe(true);
      component.importSave();

      expect(component.importError).toBe(true);
      expect(game.export()).toEqual(before);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('clears the error when the import area is reopened', () => {
      component.areaImport = 'not a save';
      component.checkImport();

      component.showImport();

      expect(component.importError).toBe(false);
    });
  });
});
