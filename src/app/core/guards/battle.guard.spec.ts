import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../services/game.service';
import { BattleGuard } from './battle.guard';

describe('BattleGuard', () => {
  let guard: BattleGuard;

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
    guard = TestBed.inject(BattleGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });
});
