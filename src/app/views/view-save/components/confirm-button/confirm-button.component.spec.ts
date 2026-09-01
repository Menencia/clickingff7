import { TestBed } from '@angular/core/testing';
import { ConfirmButtonComponent } from './confirm-button.component';

describe('ConfirmButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmButtonComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ConfirmButtonComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
