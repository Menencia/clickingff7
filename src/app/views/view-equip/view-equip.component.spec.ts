import { PlayerService } from '@shared/services/player.service';
import { MockBuilder, MockRender } from 'ng-mocks';
import { CharactersMock, WeaponsMock } from 'src/app/shared/test/game.mock';

import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  beforeEach(() => {
    return MockBuilder(ViewEquipComponent).mock(PlayerService, {
      ...CharactersMock,
      ...WeaponsMock,
    });
  });

  it('should create', () => {
    expect(MockRender(ViewEquipComponent)).toBeDefined();
  });
});
