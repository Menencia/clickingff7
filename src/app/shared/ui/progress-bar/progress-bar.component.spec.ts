import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ItDisplayHits } from '../../../models/units';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;
  let hits: Subject<ItDisplayHits>;

  beforeEach(async () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays received hits, newest first', () => {
    hits.next({ hits: 30 });
    hits.next({ hits: 12 });

    expect(component.arrHits()).toEqual([{ hits: 12 }, { hits: 30 }]);
  });

  it('follows a new hits stream given to the input', () => {
    hits.next({ hits: 30 });
    const next = new Subject<ItDisplayHits>();
    fixture.componentRef.setInput('hits', next);
    fixture.detectChanges();

    expect(hits.observed).toBe(false);
    hits.next({ hits: 99 });
    next.next({ hits: 12 });

    expect(component.arrHits()).toEqual([{ hits: 12 }, { hits: 30 }]);
  });

  it('removes the oldest hit when its animation ends', () => {
    hits.next({ hits: 30 });
    hits.next({ hits: 12 });
    component.onAnimationEvent();

    expect(component.arrHits()).toEqual([{ hits: 12 }]);
  });

  it('renders a hit emitted outside of any event handler', () => {
    const el: HTMLElement = fixture.nativeElement;
    hits.next({ hits: 30 });
    fixture.detectChanges();

    expect(el.querySelectorAll('.hits').length).toBe(1);
    expect(el.querySelector('.hits')?.textContent).toContain('30');

    component.onAnimationEvent();
    fixture.detectChanges();

    expect(el.querySelectorAll('.hits').length).toBe(0);
  });

  it('ignores an animation end when no hit is displayed', () => {
    component.onAnimationEvent();

    expect(component.arrHits()).toEqual([]);
  });

  it('unsubscribes from the hits stream on destroy', () => {
    fixture.destroy();

    expect(hits.observed).toBe(false);
    hits.next({ hits: 30 });
    expect(component.arrHits().length).toBe(0);
  });

  it('leaves no pending timer', () => {
    vi.useFakeTimers();
    hits.next({ hits: 30 });
    // Let Angular's zoneless scheduler run the change detection it queued.
    vi.advanceTimersByTime(16);
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
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

describe('ProgressBarComponent without hits input', () => {
  it('renders without a hits stream', async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProgressBarComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.arrHits()).toEqual([]);
  });
});
