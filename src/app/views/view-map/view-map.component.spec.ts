import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { PlayerService } from 'src/app/core/services/player.service';
import { ShopService } from 'src/app/core/services/shop.service';
import { ZonesMock } from 'src/app/shared/test/game.mock';

import { ViewMapComponent } from './view-map.component';

describe('ViewMapComponent', () => {
  let component: ViewMapComponent;
  let fixture: ComponentFixture<ViewMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMapComponent, TranslateModule.forRoot()],
      providers: [MockProvider(PlayerService, ZonesMock), MockProvider(ShopService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
