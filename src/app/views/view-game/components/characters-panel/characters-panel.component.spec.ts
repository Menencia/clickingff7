import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { CharactersPanelComponent } from './characters-panel.component';

describe('CharactersPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersPanelComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CharactersPanelComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
