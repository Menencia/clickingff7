import { TestBed } from '@angular/core/testing';

import { BattleGuard } from './battle.guard';
import { TranslateModule } from '@ngx-translate/core';

describe('BattleGuard', () => {
  let guard: BattleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    guard = TestBed.inject(BattleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
