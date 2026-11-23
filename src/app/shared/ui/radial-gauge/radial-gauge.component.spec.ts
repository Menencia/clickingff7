import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ItDisplayHits } from '../../../models/units';
import { RadialGaugeComponent } from './radial-gauge.component';

describe('RadialGaugeComponent', () => {
  let component: RadialGaugeComponent;
  let fixture: ComponentFixture<RadialGaugeComponent>;
  let hits: Subject<ItDisplayHits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadialGaugeComponent],
    }).compileComponents();

    hits = new Subject<ItDisplayHits>();
    fixture = TestBed.createComponent(RadialGaugeComponent);
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

  it('renders the progress, color, thickness and label inputs', () => {
    fixture.componentRef.setInput('label', 'HP 42');
    fixture.componentRef.setInput('color', 'text-success');
    fixture.componentRef.setInput('thickness', 4);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const ring = el.querySelector('.ring') as SVGCircleElement;
    expect(el.getAttribute('aria-valuenow')).toBe('80');
    expect(el.getAttribute('aria-label')).toBe('HP 42');
    expect(ring.getAttribute('stroke-dasharray')).toBe('80 100');
    expect(ring.getAttribute('stroke-width')).toBe('4');
    expect(ring.getAttribute('r')).toBe('16');
    expect(ring.classList).toContain('text-success');
  });
});

describe('RadialGaugeComponent without hits input', () => {
  it('renders without a hits stream', async () => {
    await TestBed.configureTestingModule({
      imports: [RadialGaugeComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RadialGaugeComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.arrHits()).toEqual([]);
  });
});
