import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { PipeTimePipe } from '../../shared/pipes/pipe-time.pipe';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';
import { decodeSave, encodeSave } from '../../shared/utils/save.utils';

@Component({
  selector: 'app-view-save',
  imports: [UiLayoutDefaultComponent, TranslatePipe, PipeTimePipe, FormsModule],
  templateUrl: './view-save.component.html',
  styleUrls: ['./view-save.component.scss'],
})
export class ViewSaveComponent {
  private gameService = inject(GameService);
  private router = inject(Router);

  /** Last save, shown in the summary card */
  readonly lastSave = this.gameService.lastSave;

  areaExport: string;

  areaImport: string;

  showAreaExport: boolean;

  showAreaImport: boolean;

  /** True when the last save could not be written to the storage */
  saveError = false;

  /** True when the last import attempt was rejected */
  importError = false;

  /** True once the export string has been copied to the clipboard */
  copied = signal(false);

  constructor() {
    this.areaExport = '';
    this.areaImport = '';
    this.showAreaExport = false;
    this.showAreaImport = false;
  }

  /**
   * Save the game
   */
  saveGame(): void {
    this.saveError = !this.gameService.save();
  }

  /**
   * Reset the game (after confirmation)
   */
  resetGame(): void {
    if (this.lastSave()) {
      this.gameService.newGame();
      this.router.navigateByUrl('game');
    }
  }

  /**
   * Export the current save
   */
  exportLastSave(): void {
    const save = this.lastSave();
    if (save) {
      this.showAreaImport = false;
      this.showAreaExport = true;
      this.areaExport = encodeSave(save);
      this.copied.set(false);
    }
  }

  /**
   * Export the current game
   */
  exportCurrentGame(): void {
    this.areaExport = encodeSave(this.gameService.export());
    this.showAreaImport = false;
    this.showAreaExport = true;
    this.copied.set(false);
  }

  /**
   * Copy the export string to the clipboard
   */
  async copyExport(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.areaExport);
      this.copied.set(true);
    } catch {
      this.copied.set(false);
    }
  }

  /**
   * Show import area
   */
  showImport(): void {
    this.showAreaImport = true;
    this.showAreaExport = false;
    this.importError = false;
  }

  /**
   * Check the pasted save before asking for confirmation.
   * Returns true if the save can be imported.
   */
  checkImport(): boolean {
    this.importError = decodeSave(this.areaImport) === null;
    return !this.importError;
  }

  /**
   * Import a save (after confirmation).
   * If the save references unknown data, the current game is kept.
   */
  importSave(): void {
    const save = decodeSave(this.areaImport);
    if (!save || !this.gameService.importGame(save)) {
      this.importError = true;
      return;
    }
    this.router.navigateByUrl('game');
  }
}
