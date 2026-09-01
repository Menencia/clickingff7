import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BattleService } from './battle.service';
import { GameService } from './game.service';

describe('BattleService', () => {
  let service: BattleService;

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
    service = TestBed.inject(BattleService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
