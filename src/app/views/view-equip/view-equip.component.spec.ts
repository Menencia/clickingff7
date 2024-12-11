import { MockBuilder, MockRender } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { CharactersMock, WeaponsMock } from 'src/app/shared/test/game.mock';

import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  beforeEach(() => {
    return MockBuilder(ViewEquipComponent).mock(GameService, {
      ...CharactersMock,
      ...WeaponsMock,
    });
  });

  it('should create', () => {
    expect(MockRender(ViewEquipComponent)).toBeDefined();
  });
});
