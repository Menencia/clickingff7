import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { GameService } from '../../../core/services/game.service';

/**
 * Bottom navigation bar shown on small screens, in place of the navbar menu.
 * Icons are inlined from Lucide: importing @lucide/angular here would put the
 * whole library in the initial bundle.
 */
@Component({
  selector: 'app-dock',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './dock.component.html',
  host: { '(document:click)': 'onDocumentClick($event)' },
})
export class DockComponent {
  private gameService = inject(GameService);

  readonly more = viewChild<ElementRef<HTMLDetailsElement>>('more');

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeMore());
  }

  displayPhs() {
    return this.gameService.zones.isPhsUnlocked();
  }

  /** Closes the More menu when the player clicks anywhere outside it. */
  onDocumentClick(event: MouseEvent) {
    const more = this.more()?.nativeElement;
    if (more?.open && !more.contains(event.target as Node)) this.closeMore();
  }

  private closeMore() {
    const more = this.more()?.nativeElement;
    if (more) more.open = false;
  }
}
