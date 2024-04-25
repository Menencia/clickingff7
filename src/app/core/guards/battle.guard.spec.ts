import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { BattleGuard } from './battle.guard';

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
