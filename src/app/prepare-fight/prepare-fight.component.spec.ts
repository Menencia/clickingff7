import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareFightComponent } from './prepare-fight.component';

describe('PrepareFightComponent', () => {
  let component: PrepareFightComponent;
  let fixture: ComponentFixture<PrepareFightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareFightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareFightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
