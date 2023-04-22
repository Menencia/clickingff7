import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSaveComponent } from './view-save.component';

describe('ViewSaveComponent', () => {
  let component: ViewSaveComponent;
  let fixture: ComponentFixture<ViewSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
