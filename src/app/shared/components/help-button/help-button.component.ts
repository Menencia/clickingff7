import { ApplicationRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import { helpData } from '../../../models/help';

@Component({
  selector: 'app-help-button',
  imports: [TranslatePipe],
  template: `
    <button
      type="button"
      class="btn btn-ghost btn-circle"
      [title]="'How to play?' | translate"
      [attr.aria-label]="'How to play?' | translate"
      [disabled]="battleService.battle()"
      (click)="help()"
    >
      <svg
        class="h-7 w-7"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </svg>
    </button>
  `,
})
export class HelpButtonComponent {
  protected battleService = inject(BattleService);
  private translateService = inject(TranslateService);
  private router = inject(Router);
  private appRef = inject(ApplicationRef);

  async help(): Promise<void> {
    if (this.battleService.battle()) {
      return;
    }

    // The steps target elements of the game screen: wait for it to render.
    await this.router.navigateByUrl('/battle');
    await this.appRef.whenStable();

    const steps = helpData.steps.map(({ key, element, position }) => ({
      position,
      element: element ? firstVisible(`[data-tour="${element}"]`) : undefined,
      intro: this.translateService.instant(`tour.${key}`),
    }));

    // Loaded on demand to keep intro.js out of the initial bundle.
    const { default: introJs } = await import('intro.js');
    // See the help-tour variant in styles.scss.
    document.body.classList.add('help-tour');
    const end = () => document.body.classList.remove('help-tour');
    introJs()
      .setOptions({ steps })
      .onbeforechange((element) => {
        scrollToTop(element);
        return true;
      })
      .oncomplete(end)
      .onexit(end)
      .start();
  }
}

/**
 * On a phone, scrolls the element to the top of the screen before intro.js
 * shows its step. intro.js picks the tooltip position (above, below...) from
 * where the element is before scrolling to it, so a tooltip placed above an
 * element further down ends up off screen once scrolled. With the element at
 * the top (or as high as the page allows), the tooltip fits below it, or
 * above it at the bottom of the page.
 */
function scrollToTop(element: HTMLElement | undefined): void {
  if (
    !element ||
    element.classList.contains('introjsFloatingElement') ||
    !window.matchMedia('(max-width: 639.98px)').matches
  ) {
    return;
  }
  const top = element.getBoundingClientRect().top + window.scrollY - 8;
  window.scrollTo({ top, behavior: 'instant' });
}

/** First element matching the selector that is rendered (not display: none). */
function firstVisible(selector: string): HTMLElement | undefined {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).find(
    (el) => el.getClientRects().length > 0,
  );
}
