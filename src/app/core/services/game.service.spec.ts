import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import { TranslateModule } from '@ngx-translate/core';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot() ]
    });
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
