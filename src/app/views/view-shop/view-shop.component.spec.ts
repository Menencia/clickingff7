/* eslint-disable max-classes-per-file */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { StoreService } from 'src/app/core/services/store.service';
import {
  ItemsMock,
  MateriasMock,
  WeaponsMock,
  ZonesMock,
  itemMock,
  weaponMock,
} from 'src/app/shared/test/game.mock';

import { ViewShopComponent } from './view-shop.component';

describe('ShopComponent', () => {
  let component: ViewShopComponent;
  let fixture: ComponentFixture<ViewShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        MockProvider(GameService, {
          ...ZonesMock,
          ...WeaponsMock,
          ...MateriasMock,
          ...ItemsMock,
        }),
        MockProvider(StoreService, {
          getWeapon: () => weaponMock,
          getItem: () => itemMock,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
