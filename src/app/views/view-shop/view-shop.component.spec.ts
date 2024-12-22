/* eslint-disable max-classes-per-file */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { StoreService } from '@shared/services/store.service';
import { MockProvider } from 'ng-mocks';
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
