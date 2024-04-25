import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLayoutDefaultComponent } from './ui-layout-default.component';

describe('UiLayoutDefaultComponent', () => {
  let component: UiLayoutDefaultComponent;
  let fixture: ComponentFixture<UiLayoutDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiLayoutDefaultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiLayoutDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
