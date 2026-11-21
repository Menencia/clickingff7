import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ItDisplayHits } from '../../../core/interfaces/it-display-hits';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;
  let hits: Subject<ItDisplayHits>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
    }).compileComponents();

    hits = new Subject<ItDisplayHits>();
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('hits', hits);
    fixture.componentRef.setInput('progress', 80);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays received hits and updates the background after 300 ms', () => {
    fixture.componentRef.setInput('progress', 50);
    hits.next({ hits: 30 });

    expect(component.arrHits.length).toBe(1);
    expect(component.progressBg).toBe(80);

    vi.advanceTimersByTime(300);
    expect(component.progressBg).toBe(50);
  });

  it('unsubscribes from the hits stream on destroy', () => {
    fixture.destroy();

    expect(hits.observed).toBe(false);
    hits.next({ hits: 30 });
    expect(component.arrHits.length).toBe(0);
  });

  it('cancels the pending timeout on destroy', () => {
    fixture.componentRef.setInput('progress', 50);
    hits.next({ hits: 30 });
    fixture.destroy();

    vi.advanceTimersByTime(300);
    expect(component.progressBg).toBe(80);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('renders the progress, style and text inputs', () => {
    fixture.componentRef.setInput('text', 'HP 42');
    fixture.componentRef.setInput('style', 'progress-success');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const progress = el.querySelector('progress') as HTMLProgressElement;
    expect(progress.value).toBe(80);
    expect(progress.classList).toContain('progress-success');
    expect(el.querySelector('.label')?.textContent).toContain('HP 42');
  });
});

describe('ProgressBarComponent without hits input', () => {
  it('renders without a hits stream', async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProgressBarComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.arrHits).toEqual([]);
  });
});
