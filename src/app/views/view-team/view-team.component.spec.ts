import { MockBuilder, MockRender } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { CharactersMock } from 'src/app/shared/test/game.mock';

import { ViewTeamComponent } from './view-team.component';

describe('ViewTeamComponent', () => {
  beforeEach(() => {
    return MockBuilder(ViewTeamComponent).mock(GameService, {
      ...CharactersMock,
    });
  });

  it('should create', () => {
    expect(MockRender(ViewTeamComponent)).toBeDefined();
  });
});
