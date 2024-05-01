import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { ItemsMock } from 'src/app/shared/test/game.mock';

import { ViewItemsComponent } from './view-items.component';

describe('ViewItemsComponent', () => {
  let component: ViewItemsComponent;
  let fixture: ComponentFixture<ViewItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewItemsComponent, TranslateModule.forRoot()],
      providers: [MockProvider(GameService, { ...ItemsMock })],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
