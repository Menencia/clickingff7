import { TestBed } from '@angular/core/testing';
import { TestModule } from 'src/app/shared/test/test.module';

import { BattleGuard } from './battle.guard';

describe('BattleGuard', () => {
  let guard: BattleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });
    guard = TestBed.inject(BattleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
