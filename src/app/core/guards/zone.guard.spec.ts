import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { GameService } from '../services/game.service';

import { ZoneGuard } from './zone.guard';

describe('ZoneGuard', () => {
  let guard: ZoneGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [MockProvider(GameService)],
    });
    guard = TestBed.inject(ZoneGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
