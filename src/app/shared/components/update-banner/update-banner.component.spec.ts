import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BattleService } from '../../../core/services/battle.service';
import {
  PwaUpdateService,
  type PwaUpdateState,
} from '../../../core/services/pwa-update.service';
import { UpdateBannerComponent } from './update-banner.component';

describe('UpdateBannerComponent', () => {
  const state = signal<PwaUpdateState>('none');
  const battle = signal<unknown>(undefined);
  const reload = vi.fn();

  beforeEach(() => {
    state.set('none');
    battle.set(undefined);
    reload.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: PwaUpdateService,
          useValue: { state, reload, dismiss: () => state.set('none') },
        },
        { provide: BattleService, useValue: { battle } },
      ],
    });
  });

  async function render() {
    const fixture = TestBed.createComponent(UpdateBannerComponent);
    await fixture.whenStable();
    return fixture;
  }

  function buttons(element: HTMLElement) {
    const [later, reloadButton] = Array.from(
      element.querySelectorAll<HTMLButtonElement>('button'),
    );
    return { later, reloadButton };
  }

  it('is hidden without an update', async () => {
    const fixture = await render();
    expect(fixture.nativeElement.querySelector('[role=alert]')).toBeNull();
  });

  it('reloads on demand once a version is ready', async () => {
    state.set('ready');
    const fixture = await render();
    const { reloadButton } = buttons(fixture.nativeElement);

    reloadButton.click();

    expect(reload).toHaveBeenCalled();
  });

  it('can be dismissed', async () => {
    state.set('ready');
    const fixture = await render();
    buttons(fixture.nativeElement).later.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role=alert]')).toBeNull();
  });

  it('cannot reload during a battle', async () => {
    state.set('ready');
    battle.set({});
    const fixture = await render();

    expect(buttons(fixture.nativeElement).reloadButton.disabled).toBe(true);
  });
});
