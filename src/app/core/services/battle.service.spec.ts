import { TestBed } from '@angular/core/testing';
import { TestModule } from 'src/app/shared/test/test.module';

import { BattleService } from './battle.service';

describe('BattleService', () => {
  let service: BattleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });
    service = TestBed.inject(BattleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
