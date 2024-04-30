import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestModule } from 'src/app/shared/test/test.module';

import { ViewPhsComponent } from './view-phs.component';

describe('ViewPhsComponent', () => {
  let component: ViewPhsComponent;
  let fixture: ComponentFixture<ViewPhsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
