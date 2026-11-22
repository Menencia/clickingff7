import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { provideTranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { GameService } from './core/services/game.service';
import { MemoryStorage } from './testing/game-data.testing';

@Component({ template: '' })
class DummyComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([{ path: 'other', component: DummyComponent }]),
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: SwUpdate, useValue: { isEnabled: false } },
        {
          provide: GameService,
          useValue: { run: () => {}, zones: { isNextZone: () => 1 } },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
