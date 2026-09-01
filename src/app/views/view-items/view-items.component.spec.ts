import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { ViewItemsComponent } from './view-items.component';

describe('ViewItemsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewItemsComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: GameService,
          useValue: {
            run: () => {},
            items: { list: [] },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewItemsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
