import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../../services/game.service';
import { MenuSidebarComponent } from './menu-sidebar.component';

describe('MenuSidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuSidebarComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: GameService,
          useValue: {
            run: () => {},
            zones: { isNextZone: () => 1 },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MenuSidebarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
