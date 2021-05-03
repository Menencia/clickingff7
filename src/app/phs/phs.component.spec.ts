import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhsComponent } from './phs.component';

describe('PhsComponent', () => {
  let component: PhsComponent;
  let fixture: ComponentFixture<PhsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
