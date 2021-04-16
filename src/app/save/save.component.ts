import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent {

  areaExport: string;
  areaImport: string;
  showAreaExport: boolean;
  showAreaImport: boolean;

  constructor(public game: GameService, public router: Router) {
    // Redirection
    if (!this.game.loaded) {
      this.router.navigateByUrl('game');
    }

    this.areaExport = '';
    this.areaImport = '';
    this.showAreaExport = false;
    this.showAreaImport = false;
  }

  /**
   * Save the game
   */
  saveGame(): void {
    this.game.save();
  }

  /**
   * Reset the game
   */
  resetGame(): void {
    if (this.game.saves[0] && confirm('Are you sure ? You\'ll lose everything !')) {
      this.game.reset();
      this.game.buildLevel(1);
      this.router.navigateByUrl('game');
    }
  }

  /**
   * Export the current save
   */
  exportLastSave(): void {
    const save = this.game.saves[0];
    if (save) {
      this.showAreaImport = false;
      this.showAreaExport = true;
      this.areaExport = btoa(JSON.stringify(save));
    }
  }

  /**
   * Export the current game
   */
  exportCurrentGame(): void {
    this.areaExport = btoa(JSON.stringify(this.game.export()));
    this.showAreaImport = false;
    this.showAreaExport = true;
  }

  /**
   * Show import area
   */
  showImport(): void {
    this.showAreaImport = true;
    this.showAreaExport = false;
  }

  /**
   * Import a save
   */
  importSave(): void {
    if (this.areaImport && confirm('Are you sure ? You\'ll lose your current save !')) {
      const save = JSON.parse(atob(this.areaImport));
      this.game.load(save);
      this.router.navigateByUrl('game');
    }
  }

}
