import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestModule } from '../../test/test.module';

import { UiActionsComponent } from './ui-actions.component';

describe('UiActionsComponent', () => {
  let component: UiActionsComponent;
  let fixture: ComponentFixture<UiActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiActionsComponent, TestModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UiActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
