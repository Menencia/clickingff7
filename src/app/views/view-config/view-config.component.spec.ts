import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { Difficulty, GameService } from '../../core/services/game.service';
import { ViewConfigComponent } from './view-config.component';

describe('ViewConfigComponent', () => {
  let game: { difficulty: Difficulty; language: string };

  beforeEach(async () => {
    game = { difficulty: Difficulty.Normal, language: 'en' };
    await TestBed.configureTestingModule({
      imports: [ViewConfigComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: GameService, useValue: game },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewConfigComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it.each([
    [0, Difficulty.Easy],
    [1, Difficulty.Normal],
    [2, Difficulty.Hard],
  ])('stores choice %i as the number %i', async (index, expected) => {
    const fixture = TestBed.createComponent(ViewConfigComponent);
    await fixture.whenStable();
    const badges: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('fieldset:first-of-type button');

    badges[index].click();

    expect(game.difficulty).toBe(expected);
    expect(typeof game.difficulty).toBe('number');
  });

  it('preselects the current difficulty', async () => {
    game.difficulty = Difficulty.Hard;
    const fixture = TestBed.createComponent(ViewConfigComponent);
    await fixture.whenStable();
    const badges: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('fieldset:first-of-type button');

    expect(
      [...badges].map((badge) => badge.getAttribute('aria-pressed')),
    ).toEqual(['false', 'false', 'true']);
  });
});
