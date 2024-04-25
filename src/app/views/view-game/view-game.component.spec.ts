import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  let component: ViewGameComponent;
  let fixture: ComponentFixture<ViewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewGameComponent],
      imports: [TranslateModule.forRoot(), SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
