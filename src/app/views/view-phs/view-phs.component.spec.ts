import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ViewPhsComponent } from './view-phs.component';

describe('ViewPhsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPhsComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: GameService,
          useValue: {
            run: () => {},
            characters: {
              getTeam: () => [],
              getBackup: () => [],
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewPhsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
