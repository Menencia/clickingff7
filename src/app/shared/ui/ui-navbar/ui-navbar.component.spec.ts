import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { UiNavbarComponent } from './ui-navbar.component';

describe('UiNavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiNavbarComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UiNavbarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
