import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { MockProvider } from 'ng-mocks';
import { ItemsMock } from 'src/app/shared/test/game.mock';

import { ViewItemsComponent } from './view-items.component';

describe('ViewItemsComponent', () => {
  let component: ViewItemsComponent;
  let fixture: ComponentFixture<ViewItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewItemsComponent, TranslateModule.forRoot()],
      providers: [MockProvider(PlayerService, { ...ItemsMock })],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
