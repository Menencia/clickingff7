import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, type VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/** How often a long-running session asks the server for a new version. */
export const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

/**
 * - `ready`: a new version is downloaded and applies on the next load.
 * - `broken`: the cached version can't be served anymore, a reload is needed.
 */
export type PwaUpdateState = 'none' | 'ready' | 'broken';

/**
 * Tracks the service worker updates. A new version is never applied by force:
 * there is no autosave, so the player chooses when to reload.
 */
@Injectable({ providedIn: 'root' })
export class PwaUpdateService {
  private swUpdate = inject(SwUpdate);

  readonly state = signal<PwaUpdateState>('none');

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter((e): e is VersionReadyEvent => e.type === 'VERSION_READY'),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.state.set('ready'));

    this.swUpdate.unrecoverable
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.state.set('broken'));

    const timer = setInterval(() => {
      // Offline or server error: try again at the next interval.
      this.swUpdate.checkForUpdate().catch(() => {});
    }, UPDATE_CHECK_INTERVAL);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  /** Hides the notice; a downloaded version still applies on the next load. */
  dismiss(): void {
    this.state.set('none');
  }

  reload(): void {
    document.location.reload();
  }
}
