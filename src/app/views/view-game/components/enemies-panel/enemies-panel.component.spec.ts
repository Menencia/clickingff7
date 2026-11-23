import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Enemies } from '../../../../models/units/enemies';
import { EnemiesPanelComponent } from './enemies-panel.component';

describe('EnemiesPanelComponent', () => {
  let component: EnemiesPanelComponent;
  let fixture: ComponentFixture<EnemiesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnemiesPanelComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(EnemiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the empty state when the enemies input has no enemy', () => {
    fixture.componentRef.setInput('enemies', new Enemies());
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-radial-gauge')).toBeNull();
    expect(el.textContent).toContain('No enemies');
    // The HP row keeps its room, hidden, so the panel keeps its height.
    expect(el.querySelector('[data-testid="enemies-hp"]')?.classList).toContain(
      'invisible',
    );
  });
});
