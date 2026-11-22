import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../../core/services/game.service';
import { Zones } from '../../../models/zones';
import { PHS_UNLOCK_ZONE } from '../../utils/game.utils';
import { DockComponent } from './dock.component';

@Component({ template: '' })
class DummyComponent {}

describe('DockComponent', () => {
  let zones: Zones;

  beforeEach(async () => {
    zones = new Zones();
    zones.isNextZone = () => false;
    await TestBed.configureTestingModule({
      imports: [DockComponent],
      providers: [
        provideRouter([{ path: '**', component: DummyComponent }]),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: GameService, useValue: { zones } },
      ],
    }).compileComponents();
  });

  async function render() {
    const fixture = TestBed.createComponent(DockComponent);
    await fixture.whenStable();
    return fixture;
  }

  function more(fixture: Awaited<ReturnType<typeof render>>) {
    const details = fixture.componentInstance.more()?.nativeElement;
    if (!details) throw new Error('more menu not found');
    return details;
  }

  it('closes the More menu after a navigation', async () => {
    const fixture = await render();
    more(fixture).open = true;

    await TestBed.inject(Router).navigateByUrl('/materia');

    expect(more(fixture).open).toBe(false);
  });

  it('closes the More menu on a click outside it', async () => {
    const fixture = await render();
    more(fixture).open = true;

    more(fixture)
      .querySelector('ul')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(more(fixture).open).toBe(true);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(more(fixture).open).toBe(false);
  });

  it('stops listening to the router once destroyed', async () => {
    const fixture = await render();
    const details = more(fixture);
    fixture.destroy();
    details.open = true;

    await TestBed.inject(Router).navigateByUrl('/materia');

    expect(details.open).toBe(true);
  });

  it('shows the PHS link only once unlocked', async () => {
    let fixture = await render();
    const hasPhs = () =>
      !!fixture.nativeElement.querySelector('a[href="/phs"]');
    expect(hasPhs()).toBe(false);

    fixture.destroy();
    zones.levelMax = PHS_UNLOCK_ZONE;
    fixture = await render();
    expect(hasPhs()).toBe(true);
  });

  it('flags the map when the next zone is available', async () => {
    let fixture = await render();
    const flagged = () =>
      !!fixture.nativeElement.querySelector('[data-testid="next-zone"]');
    expect(flagged()).toBe(false);

    fixture.destroy();
    zones.isNextZone = () => true;
    fixture = await render();
    expect(flagged()).toBe(true);
  });
});
