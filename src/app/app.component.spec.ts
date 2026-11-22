import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { provideTranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { GameService } from './core/services/game.service';

@Component({ template: '' })
class DummyComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
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

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
