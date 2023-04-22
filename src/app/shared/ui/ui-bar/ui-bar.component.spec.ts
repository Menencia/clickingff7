import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBarComponent } from './ui-bar.component';

describe('UiBarComponent', () => {
  let component: UiBarComponent;
  let fixture: ComponentFixture<UiBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
