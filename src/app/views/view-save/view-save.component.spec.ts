import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ViewSaveComponent } from './view-save.component';

describe('ViewSaveComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSaveComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewSaveComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
