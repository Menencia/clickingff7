import { TestBed } from '@angular/core/testing';

import { ZoneGuard } from './zone.guard';
import { TranslateModule } from '@ngx-translate/core';

describe('ZoneGuard', () => {
  let guard: ZoneGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot() ]
    });
    guard = TestBed.inject(ZoneGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
