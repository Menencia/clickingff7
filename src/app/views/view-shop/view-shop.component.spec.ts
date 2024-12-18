/* eslint-disable max-classes-per-file */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { PlayerService } from 'src/app/core/services/player.service';
import { StoreService } from 'src/app/core/services/store.service';
import { ItemsMock, MateriasMock, WeaponsMock, ZonesMock, itemMock, materiaMock, weaponMock } from 'src/app/shared/test/game.mock';

import { ViewShopComponent } from './view-shop.component';

describe('ShopComponent', () => {
  let component: ViewShopComponent;
  let fixture: ComponentFixture<ViewShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        MockProvider(PlayerService, {
          ...ZonesMock,
          ...WeaponsMock,
          ...MateriasMock,
          ...ItemsMock,
        }),
        MockProvider(StoreService, {
          getWeapon: () => weaponMock,
          getItem: () => itemMock,
          getMateria: () => materiaMock,
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
