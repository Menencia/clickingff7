import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { PlayerService } from '../services/player.service';

import { ZoneGuard } from './zone.guard';

describe('ZoneGuard', () => {
  let guard: ZoneGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [MockProvider(PlayerService)],
    });
    guard = TestBed.inject(ZoneGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
