import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ViewMateriaComponent } from './view-materia.component';

describe('ViewMateriaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMateriaComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewMateriaComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
