import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGameComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: GameService,
          useValue: {
            run: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewGameComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
