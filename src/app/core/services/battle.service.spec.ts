import { TestBed } from '@angular/core/testing';

import { BattleService } from './battle.service';
import { TranslateModule } from '@ngx-translate/core';

describe('BattleService', () => {
  let service: BattleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(BattleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
