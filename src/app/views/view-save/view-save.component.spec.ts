import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ViewSaveComponent } from './view-save.component';

describe('ViewSaveComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSaveComponent],
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
    const fixture = TestBed.createComponent(ViewSaveComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
