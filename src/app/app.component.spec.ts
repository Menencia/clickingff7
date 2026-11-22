import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
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

  describe('drawer', () => {
    beforeEach(() => {
      // Child components are not under test here.
      TestBed.overrideComponent(AppComponent, {
        set: { imports: [RouterOutlet], schemas: [NO_ERRORS_SCHEMA] },
      });
    });

    it('closes the drawer after a navigation', async () => {
      const fixture = TestBed.createComponent(AppComponent);
      await fixture.whenStable();
      const drawer = fixture.componentInstance.drawerToggle()?.nativeElement;
      if (!drawer) throw new Error('drawer not found');
      drawer.checked = true;

      await TestBed.inject(Router).navigateByUrl('/other');

      expect(drawer.checked).toBe(false);
    });

    it('stops listening to the router once destroyed', async () => {
      const fixture = TestBed.createComponent(AppComponent);
      await fixture.whenStable();
      const drawer = fixture.componentInstance.drawerToggle()?.nativeElement;
      if (!drawer) throw new Error('drawer not found');
      fixture.destroy();
      drawer.checked = true;

      await TestBed.inject(Router).navigateByUrl('/other');

      expect(drawer.checked).toBe(true);
    });
  });
});
