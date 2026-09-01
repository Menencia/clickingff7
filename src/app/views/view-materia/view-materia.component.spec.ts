import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ViewMateriaComponent } from './view-materia.component';

describe('ViewMateriaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMateriaComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: GameService,
          useValue: {
            run: () => {},
            materias: { list: [] },
            characters: { getMaxMaterias: () => 0 },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewMateriaComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
