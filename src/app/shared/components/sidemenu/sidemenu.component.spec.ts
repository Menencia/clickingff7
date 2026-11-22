import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../../core/services/game.service';
import { Zones } from '../../../models/zones';
import { PHS_UNLOCK_ZONE } from '../../utils/game.utils';
import { SidemenuComponent } from './sidemenu.component';

describe('SidemenuComponent', () => {
  let zones: Zones;

  beforeEach(async () => {
    zones = new Zones();
    zones.isNextZone = () => false;
    await TestBed.configureTestingModule({
      imports: [SidemenuComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: GameService, useValue: { zones } },
      ],
    }).compileComponents();
  });

  async function render() {
    const fixture = TestBed.createComponent(SidemenuComponent);
    await fixture.whenStable();
    return fixture;
  }

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
});
