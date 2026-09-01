import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../../../core/services/game.service';
import { UiActionsComponent } from './ui-actions.component';

describe('UiActionsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiActionsComponent, TranslateModule.forRoot()],
      providers: [
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
    const fixture = TestBed.createComponent(UiActionsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
