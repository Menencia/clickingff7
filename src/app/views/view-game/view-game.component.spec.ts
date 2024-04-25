import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  let component: ViewGameComponent;
  let fixture: ComponentFixture<ViewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGameComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
