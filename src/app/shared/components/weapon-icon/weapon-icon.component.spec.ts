import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponIconComponent } from './weapon-icon.component';

describe('WeaponIconComponent', () => {
  let component: WeaponIconComponent;
  let fixture: ComponentFixture<WeaponIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeaponIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
