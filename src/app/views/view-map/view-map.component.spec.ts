import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ViewMapComponent } from './view-map.component';

describe('ViewMapComponent', () => {
  let component: ViewMapComponent;
  let fixture: ComponentFixture<ViewMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMapComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
