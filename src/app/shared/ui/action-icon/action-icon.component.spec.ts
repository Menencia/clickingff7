import { TestBed } from '@angular/core/testing';
import { ActionIconComponent } from './action-icon.component';

describe('ActionIconComponent', () => {
  it('draws the named icon', async () => {
    const fixture = TestBed.createComponent(ActionIconComponent);
    fixture.componentRef.setInput('name', 'swords');
    await fixture.whenStable();

    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    expect(svg?.getAttribute('data-icon')).toBe('swords');
    expect(svg?.getAttribute('fill')).toBe('none');
    expect(svg?.querySelectorAll('path').length).toBe(8);
  });

  it('fills the orb', async () => {
    const fixture = TestBed.createComponent(ActionIconComponent);
    fixture.componentRef.setInput('name', 'orb');
    await fixture.whenStable();

    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    expect(svg?.getAttribute('fill')).toBe('currentColor');
    expect(svg?.querySelector('circle')).not.toBeNull();
  });
});
