import { TestBed } from '@angular/core/testing';
import { GameService } from '../../../../core/services/game.service';
import { CharactersPanelComponent } from './characters-panel.component';

describe('CharactersPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersPanelComponent],
      providers: [{ provide: GameService, useValue: { run: () => {} } }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CharactersPanelComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
