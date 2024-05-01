import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { BattleService } from '../services/battle.service';

import { BattleGuard } from './battle.guard';

describe('BattleGuard', () => {
  let guard: BattleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [MockProvider(BattleService)],
    });
    guard = TestBed.inject(BattleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
