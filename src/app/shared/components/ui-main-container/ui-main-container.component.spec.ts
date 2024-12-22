import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMainContainerComponent } from './ui-main-container.component';

describe('UiMainContainerComponent', () => {
  let component: UiMainContainerComponent;
  let fixture: ComponentFixture<UiMainContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMainContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMainContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
