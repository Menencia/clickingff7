import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPhsComponent } from './view-phs.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

describe('ViewPhsComponent', () => {
  let component: ViewPhsComponent;
  let fixture: ComponentFixture<ViewPhsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPhsComponent ],
      imports: [ TranslateModule.forRoot(), SharedModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
