import { TestBed } from '@angular/core/testing';
import { GameService } from '../../core/services/game.service';
import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEquipComponent],
      providers: [
        {
          provide: GameService,
          useValue: {
            run: () => {},
            characters: { getTeam: () => [] },
            weapons: { getAllWeapons: () => [] },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewEquipComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
