import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestModule } from 'src/app/shared/test/test.module';

import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  let component: ViewEquipComponent;
  let fixture: ComponentFixture<ViewEquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEquipComponent, TestModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
