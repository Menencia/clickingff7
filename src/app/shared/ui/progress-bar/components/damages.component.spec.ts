import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagesComponent } from './damages.component';

describe('DamagesComponent', () => {
  let component: DamagesComponent;
  let fixture: ComponentFixture<DamagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DamagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
