import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { UiLayoutDefaultComponent } from '@shared/components/ui-layout-default/ui-layout-default.component';
import { Character } from '@shared/models/character';
import { CharacterRef } from '@shared/models/refs/characters';
import { Save } from '@shared/models/save';
import { GameService } from '@shared/services/game.service';
import { PlayerService } from '@shared/services/player.service';
import { StoreService } from '@shared/services/store.service';
import { PipeTimePipe } from 'src/app/shared/pipes/pipe-time.pipe';

import { ConfirmButtonComponent } from './components/confirm-button/confirm-button.component';

@Component({
  selector: 'app-view-save',
  imports: [
    UiLayoutDefaultComponent,
    TranslateModule,
    PipeTimePipe,
    FormsModule,
    ConfirmButtonComponent,
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
    private playerService: PlayerService,
    private store: StoreService,
    private router: Router,
  ) {
    this.saves = this.gameService.saves;
    this.areaExport = '';
    this.areaImport = '';
    this.showAreaExport = false;
    this.showAreaImport = false;
  }

  getCharactersFromRefs(characters: CharacterRef[]): Character[] {
    return [...characters].map((c) => this.store.getCharacter(c));
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
      this.gameService.load();
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
    this.areaExport = btoa(JSON.stringify(this.playerService.export()));
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
      this.gameService.load(save);
      this.router.navigateByUrl('game');
    }
  }
}
