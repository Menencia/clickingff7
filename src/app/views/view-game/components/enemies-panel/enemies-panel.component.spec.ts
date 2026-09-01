import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
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
});
