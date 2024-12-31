import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { BattleService } from './battle.service';
import { PlayerService } from './player.service';

describe('BattleService', () => {
  let service: BattleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [MockProvider(PlayerService), provideHttpClient()],
    });
    service = TestBed.inject(BattleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
