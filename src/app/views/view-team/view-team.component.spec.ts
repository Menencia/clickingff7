import { MockBuilder, MockRender } from 'ng-mocks';
import { PlayerService } from '@shared/services/player.service';
import { CharactersMock } from 'src/app/shared/test/game.mock';

import { ViewTeamComponent } from './view-team.component';

describe('ViewTeamComponent', () => {
  beforeEach(() => {
    return MockBuilder(ViewTeamComponent).mock(PlayerService, {
      ...CharactersMock,
    });
  });

  it('should create', () => {
    expect(MockRender(ViewTeamComponent)).toBeDefined();
  });
});
