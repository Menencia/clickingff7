import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ViewConfigComponent } from './view-config.component';

describe('ViewConfigComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewConfigComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewConfigComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
