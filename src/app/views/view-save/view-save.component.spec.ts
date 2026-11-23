import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { StoreService } from '../../core/services/store.service';
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
  let fixture: ComponentFixture<ViewSaveComponent>;
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

    fixture = TestBed.createComponent(ViewSaveComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('save', () => {
    it('saves the game without error message', () => {
      component.saveGame();

      expect(component.saveError).toBe(false);
      expect(localStorage.getItem('save1')).not.toBeNull();
      expect(game.lastSave()).toEqual(game.export());
    });

    it('shows the summary of the new save without leaving the screen', () => {
      const el: HTMLElement = fixture.nativeElement;
      const exportSave = () =>
        [...el.querySelectorAll<HTMLButtonElement>('.save-transfer button')][0];
      expect(el.querySelector('.save-last')?.textContent).toContain('No saves');
      expect(exportSave().disabled).toBe(true);

      game.gils.set(4321);
      el.querySelector<HTMLButtonElement>('.save-last .btn-primary')?.click();
      fixture.detectChanges();

      const card = el.querySelector('.save-last');
      expect(card?.textContent).not.toContain('No saves');
      expect(card?.textContent).toContain('4321');
      expect(card?.querySelectorAll('img').length).toBe(
        game.characters.team().length,
      );
      expect(exportSave().disabled).toBe(false);
    });

    it('shows the team portraits from the catalog', () => {
      const el: HTMLElement = fixture.nativeElement;
      game.save();
      game.lastSave.update((save) => {
        if (save) {
          for (const c of save.characters.list) {
            c.image = '/assets/images/characters/renamed.png';
          }
        }
        return save && structuredClone(save);
      });
      fixture.detectChanges();

      const store = TestBed.inject(StoreService);
      const srcs = [...el.querySelectorAll('.save-last img')].map((img) =>
        img.getAttribute('src'),
      );
      expect(srcs).toEqual(
        game.characters.team().map((c) => store.getCharacter(c.ref).image),
      );
    });

    it('reports a save the storage refuses, then clears the message on success', () => {
      const setItem = vi
        .spyOn(localStorage, 'setItem')
        .mockImplementation(() => {
          throw new DOMException('Quota exceeded', 'QuotaExceededError');
        });

      component.saveGame();
      expect(component.saveError).toBe(true);
      expect(game.lastSave()).toBeUndefined();

      setItem.mockRestore();
      component.saveGame();
      expect(component.saveError).toBe(false);
      expect(game.lastSave()).toEqual(game.export());
    });
  });

  describe('reset', () => {
    it('erases the save and starts a new game in zone 1', () => {
      unlockNextZone();
      game.gils.set(5000);
      game.save();

      component.resetGame();

      expect(localStorage.getItem('save1')).toBeNull();
      expect(game.lastSave()).toBeUndefined();
      expect(refs(game.zones.list)).toEqual([ZoneRef.Zone1]);
      expect(refs(game.characters.list)).toEqual([
        CharacterRef.Cloud,
        CharacterRef.Barret,
      ]);
      expect(game.gils()).toBe(200);
      expect(navigate).toHaveBeenCalledWith('battle');
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
      expect(navigate).toHaveBeenCalledWith('battle');
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

  describe('export', () => {
    it('exports the last save, not the current game', () => {
      game.gils.set(1000);
      game.save();
      const saved = encodeSave(game.export());
      game.gils.set(2000);

      component.exportLastSave();

      expect(component.showAreaExport).toBe(true);
      expect(component.areaExport).toBe(saved);
    });

    it('does not export without a save', () => {
      component.exportLastSave();

      expect(component.showAreaExport).toBe(false);
      expect(component.areaExport).toBe('');
    });

    it('follows the save when the game is reset', () => {
      game.save();
      game.reset();

      expect(component.lastSave()).toBeUndefined();
    });

    it('copies the exported string to the clipboard', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      component.exportCurrentGame();
      await component.copyExport();

      expect(writeText).toHaveBeenCalledWith(encodeSave(game.export()));
      expect(component.copied()).toBe(true);

      component.exportCurrentGame();
      expect(component.copied()).toBe(false);
    });

    it('does not report a copy when the clipboard is unavailable', async () => {
      vi.stubGlobal('navigator', {
        clipboard: { writeText: vi.fn().mockRejectedValue(new Error()) },
      });

      component.exportCurrentGame();
      await component.copyExport();

      expect(component.copied()).toBe(false);
    });
  });
});
