import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiActionsComponent } from './ui-actions.component';
import { TranslateModule } from '@ngx-translate/core';

describe('UiActionsComponent', () => {
  let component: UiActionsComponent;
  let fixture: ComponentFixture<UiActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiActionsComponent ],
      imports: [ TranslateModule.forRoot() ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
