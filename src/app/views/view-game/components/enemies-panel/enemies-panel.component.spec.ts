import { TestBed } from '@angular/core/testing';
import { EnemiesPanelComponent } from './enemies-panel.component';

describe('EnemiesPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnemiesPanelComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EnemiesPanelComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
