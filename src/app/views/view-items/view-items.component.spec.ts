import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemsComponent } from './view-items.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

describe('ViewItemsComponent', () => {
  let component: ViewItemsComponent;
  let fixture: ComponentFixture<ViewItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewItemsComponent ],
      imports: [ TranslateModule.forRoot(), SharedModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
