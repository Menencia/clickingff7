import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../services/game.service';
import { ZoneGuard } from './zone.guard';

describe('ZoneGuard', () => {
  let guard: ZoneGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: GameService,
          useValue: {
            run: () => {},
          },
        },
      ],
    });
    guard = TestBed.inject(ZoneGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });
});
