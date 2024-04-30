import { TestBed } from '@angular/core/testing';
import { TestModule } from 'src/app/shared/test/test.module';

import { ZoneGuard } from './zone.guard';

describe('ZoneGuard', () => {
  let guard: ZoneGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });
    guard = TestBed.inject(ZoneGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
