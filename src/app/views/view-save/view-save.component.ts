import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BattleService } from 'src/app/core/services/battle.service';
import { GameService } from 'src/app/core/services/game.service';
import { Save } from 'src/app/models/save';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { PipeTimePipe } from 'src/app/shared/ui/pipes/pipe-time.pipe';
import { UiLayoutDefaultComponent } from 'src/app/shared/ui/ui-layout-default/ui-layout-default.component';

import { ConfirmButtonComponent } from './components/confirm-button/confirm-button.component';

@Component({
  selector: 'app-view-save',
  standalone: true,
  imports: [
    UiLayoutDefaultComponent,
    TranslateModule,
    PipeTimePipe,
    FormsModule,
    ConfirmButtonComponent,
    NgFor,
    NgIf,
    ButtonComponent,
  ],
  templateUrl: './view-save.component.html',
  styleUrls: ['./view-save.component.scss'],
})
export class ViewSaveComponent {
  saves: Save[];

  areaExport: string;

  areaImport: string;

  showAreaExport: boolean;

  showAreaImport: boolean;

  msgImportSave = "Are you sure ? You'll lose your current save !";

  msgResetGame = "Are you sure ? You'll lose everything !";

  constructor(
    private gameService: GameService,
    private battleService: BattleService,
    private router: Router,
  ) {
    this.saves = this.gameService.saves;
    this.areaExport = '';
    this.areaImport = '';
    this.showAreaExport = false;
    this.showAreaImport = false;
  }

  /**
   * Save the game
   */
  saveGame(): void {
    this.gameService.save();
  }

  /**
   * Reset the game
   */
  resetGame(confirm: boolean): void {
    if (this.gameService.saves[0] && confirm) {
      this.gameService.preload();
      this.gameService.reset();
      this.gameService.buildLevel(1);
      this.gameService.postload();
      this.battleService.characters = this.gameService.characters;
      this.router.navigateByUrl('game');
    }
  }

  /**
   * Export the current save
   */
  exportLastSave(): void {
    const save = this.gameService.saves[0];
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
    this.areaExport = btoa(JSON.stringify(this.gameService.export()));
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
  importSave(confirm: boolean): void {
    if (this.areaImport && confirm) {
      const save = JSON.parse(atob(this.areaImport));
      this.gameService.preload();
      this.gameService.load(save);
      this.gameService.postload();
      this.battleService.characters = this.gameService.characters;
      this.router.navigateByUrl('game');
    }
  }
}
