import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import packageJson from '../../../../package.json';
import { ViewAboutComponent } from './view-about.component';

describe('ViewAboutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAboutComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
  });

  it('displays the game version', async () => {
    const fixture = TestBed.createComponent(ViewAboutComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('.version')?.textContent?.trim()).toBe(
      packageJson.version,
    );
  });

  it('keeps the app icon attribution', async () => {
    const fixture = TestBed.createComponent(ViewAboutComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(
      el.querySelector(
        'a[href="https://creativecommons.org/licenses/by/3.0/"]',
      ),
    ).not.toBeNull();
  });
});
