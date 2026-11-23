import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarComponent);
    fixture.componentRef.setInput('progress', 80);
    fixture.detectChanges();
  });

  it('renders the progress, style and text inputs', () => {
    fixture.componentRef.setInput('text', 'HP 42');
    fixture.componentRef.setInput('style', 'progress-success');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const progress = el.querySelector('progress') as HTMLProgressElement;
    expect(progress.value).toBe(80);
    expect(progress.classList).toContain('progress-success');
    expect(el.querySelector('.progress-label')?.textContent).toContain('HP 42');
  });
});
