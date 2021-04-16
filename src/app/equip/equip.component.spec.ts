import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipComponent } from './equip.component';

describe('EquipComponent', () => {
  let component: EquipComponent;
  let fixture: ComponentFixture<EquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
