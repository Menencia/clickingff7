import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BattleGuard } from './battle.guard';

describe('BattleGuard', () => {
  let guard: BattleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
    guard = TestBed.inject(BattleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
