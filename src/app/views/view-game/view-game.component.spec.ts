import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGameComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewGameComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
