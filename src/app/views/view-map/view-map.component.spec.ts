import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ViewMapComponent } from './view-map.component';

describe('ViewMapComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMapComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: GameService,
          useValue: {
            run: () => {},
            zones: { current: () => 1 },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewMapComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
