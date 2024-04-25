import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  let component: ViewEquipComponent;
  let fixture: ComponentFixture<ViewEquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEquipComponent],
      imports: [TranslateModule.forRoot(), SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
