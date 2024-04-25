import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { UiActionsComponent } from './ui-actions.component';

describe('UiActionsComponent', () => {
  let component: UiActionsComponent;
  let fixture: ComponentFixture<UiActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiActionsComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UiActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
