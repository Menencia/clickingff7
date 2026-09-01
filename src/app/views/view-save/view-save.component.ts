import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BattleService } from '../../core/services/battle.service';
import { GameService } from '../../core/services/game.service';
import { Save } from '../../models/save';
import { PipeTimePipe } from '../../shared/pipes/pipe-time.pipe';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { UiLayoutDefaultComponent } from '../../shared/ui/ui-layout-default/ui-layout-default.component';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
