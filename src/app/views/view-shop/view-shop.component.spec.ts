import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { StoreService } from '../../core/services/store.service';
import { ViewShopComponent } from './view-shop.component';

describe('ViewShopComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewShopComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: GameService,
          useValue: {
            run: () => {},
            zones: { isNextZone: () => 1 },
            weapons: { list: [] },
            materias: { list: [] },
            items: { list: [] },
          },
        },
        {
          provide: StoreService,
          useValue: {
            getWeapon: () => {
              return {};
            },
            getMateria: () => {
              return {};
            },
            getItem: () => {
              return { ref: 'a', available: () => true };
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewShopComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
