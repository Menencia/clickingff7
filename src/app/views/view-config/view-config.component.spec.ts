import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConfigComponent } from './view-config.component';

describe('ViewConfigComponent', () => {
  let component: ViewConfigComponent;
  let fixture: ComponentFixture<ViewConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
