import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEquipComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewEquipComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
