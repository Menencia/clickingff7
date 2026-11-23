import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
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
      providers: [provideTranslateService({ fallbackLang: 'en' })],
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

    expect(component.arrHits().map((h) => h.hits)).toEqual([12, 30]);
  });

  it('follows a new hits stream given to the input', () => {
    hits.next({ hits: 30 });
    const next = new Subject<ItDisplayHits>();
    fixture.componentRef.setInput('hits', next);
    fixture.detectChanges();

    expect(hits.observed).toBe(false);
    hits.next({ hits: 99 });
    next.next({ hits: 12 });

    expect(component.arrHits().map((h) => h.hits)).toEqual([12, 30]);
  });

  it('sends the hit numbers to the right and the left in turn', () => {
    hits.next({ hits: 1 });
    hits.next({ hits: 2 });
    hits.next({ hits: 3 });

    const [third, second, first] = component.arrHits().map((h) => h.dx);
    expect(first).toBeGreaterThanOrEqual(15);
    expect(first).toBeLessThanOrEqual(45);
    expect(second).toBeLessThanOrEqual(-15);
    expect(second).toBeGreaterThanOrEqual(-45);
    expect(third).toBeGreaterThan(0);
  });

  it('gives each hit number its drift', () => {
    hits.next({ hits: 30 });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const hit = el.querySelector<HTMLElement>('.hits');
    expect(hit?.style.getPropertyValue('--dx')).toBe(
      `${component.arrHits()[0].dx}px`,
    );
  });

  it('shows a critical hit bigger and in another color', () => {
    hits.next({ hits: 30 });
    hits.next({ hits: 60, critical: true });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const [critical, normal] = el.querySelectorAll('.hits');
    expect(critical.classList).toContain('critical');
    expect(critical.classList).toContain('text-warning');
    expect(critical.classList).toContain('text-4xl');
    expect(critical.classList).toContain('hits');
    expect(normal.classList).not.toContain('critical');
    expect(normal.classList).toContain('text-error');
  });

  it('shows a heal in green, with a plus sign', () => {
    hits.next({ hits: 30 });
    hits.next({ hits: 12, heal: true });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const [heal, damage] = el.querySelectorAll('.hits');
    expect(heal.classList).toContain('text-success');
    expect(heal.textContent?.trim()).toBe('+12');
    expect(damage.classList).toContain('text-error');
    expect(damage.textContent?.trim()).toBe('30');
  });

  it('labels a hit on a weakness', () => {
    hits.next({ hits: 30 });
    hits.next({ hits: 90, weakness: true });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const [weak, normal] = el.querySelectorAll('.hits');
    expect(weak.querySelector('.weakness')?.textContent).toContain(
      'Weakness hit',
    );
    expect(weak.textContent).toContain('90');
    expect(normal.querySelector('.weakness')).toBeNull();
  });

  it('removes the oldest hit when its animation ends', () => {
    hits.next({ hits: 30 });
    hits.next({ hits: 12 });
    component.onAnimationEvent();

    expect(component.arrHits().map((h) => h.hits)).toEqual([12]);
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
