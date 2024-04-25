import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  let component: ViewEquipComponent;
  let fixture: ComponentFixture<ViewEquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEquipComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
