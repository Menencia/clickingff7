import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { ShopService } from '@shared/services/shop.service';
import { MockProvider } from 'ng-mocks';
import { ZonesMock } from 'src/app/shared/test/game.mock';

import { ViewMapComponent } from './view-map.component';

describe('ViewMapComponent', () => {
  let component: ViewMapComponent;
  let fixture: ComponentFixture<ViewMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMapComponent, TranslateModule.forRoot()],
      providers: [
        MockProvider(PlayerService, ZonesMock),
        MockProvider(ShopService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
