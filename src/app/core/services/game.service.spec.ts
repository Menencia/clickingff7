import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import {
  characterMock,
  itemMock,
  materiaMock,
  weaponMock,
} from 'src/app/shared/test/game.mock';

import { GameService } from './game.service';
import { StoreService } from './store.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(TranslateService),
        MockProvider(StoreService, {
          getCharacter: () => characterMock,
          getWeapon: () => weaponMock,
          getItem: () => itemMock,
          getMateria: () => materiaMock,
        }),
      ],
    });
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
