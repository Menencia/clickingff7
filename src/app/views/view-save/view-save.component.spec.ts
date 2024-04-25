import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSaveComponent } from './view-save.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

describe('ViewSaveComponent', () => {
  let component: ViewSaveComponent;
  let fixture: ComponentFixture<ViewSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSaveComponent],
      imports: [TranslateModule.forRoot(), SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
