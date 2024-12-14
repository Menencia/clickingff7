import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LangService } from './lang.service';

describe('LangService', () => {
  let service: LangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(LangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
