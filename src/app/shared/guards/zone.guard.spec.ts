import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ZoneGuard } from './zone.guard';

describe('ZoneGuard', () => {
  let guard: ZoneGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
    guard = TestBed.inject(ZoneGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
