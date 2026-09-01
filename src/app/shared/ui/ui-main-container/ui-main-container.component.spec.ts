import { TestBed } from '@angular/core/testing';
import { UiMainContainerComponent } from './ui-main-container.component';

describe('UiMainContainerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMainContainerComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UiMainContainerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
