import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ViewConfigComponent } from './view-config.component';

describe('ViewConfigComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewConfigComponent],
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
    const fixture = TestBed.createComponent(ViewConfigComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
