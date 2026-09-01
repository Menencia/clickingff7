import { TestBed } from '@angular/core/testing';
import { GameService } from '../services/game.service';
import { BattleGuard } from './battle.guard';

describe('BattleGuard', () => {
  let guard: BattleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
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
