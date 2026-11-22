import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { PwaUpdateService } from '../../../core/services/pwa-update.service';

@Component({
  selector: 'app-update-banner',
  imports: [TranslatePipe],
  template: `
    @if (pwaUpdate.state() !== 'none') {
      <div class="toast toast-center z-50">
        <div role="alert" class="alert alert-info alert-vertical sm:alert-horizontal">
          <span>
            {{
              (pwaUpdate.state() === 'ready' ? 'Update ready' : 'Update broken')
                | translate
            }}
          </span>
          <div class="flex gap-2">
            <button
              type="button"
              class="btn btn-sm btn-ghost"
              (click)="pwaUpdate.dismiss()"
            >
              {{ 'Later' | translate }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-primary"
              [disabled]="battleService.battle()"
              (click)="pwaUpdate.reload()"
            >
              {{ 'Reload' | translate }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class UpdateBannerComponent {
  protected pwaUpdate = inject(PwaUpdateService);
  protected battleService = inject(BattleService);
}
