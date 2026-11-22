import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../testing/game-data.testing';
import { ThemePickerComponent } from './theme-picker.component';

describe('ThemePickerComponent', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function create() {
    const fixture = TestBed.createComponent(ThemePickerComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  function theme() {
    return document.documentElement.getAttribute('data-theme');
  }

  it('uses the dark theme by default', () => {
    const component = create();
    expect(component.isLightTheme()).toBe(false);
    expect(theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('restores the saved light theme', () => {
    localStorage.setItem('theme', 'cupcake');
    const component = create();
    expect(component.isLightTheme()).toBe(true);
    expect(theme()).toBe('cupcake');
  });

  it('converts the legacy light theme to cupcake', () => {
    localStorage.setItem('theme', 'light');
    const component = create();
    expect(component.isLightTheme()).toBe(true);
    expect(theme()).toBe('cupcake');
    expect(localStorage.getItem('theme')).toBe('cupcake');
  });

  it('keeps the saved dark theme', () => {
    localStorage.setItem('theme', 'dark');
    const component = create();
    expect(component.isLightTheme()).toBe(false);
    expect(theme()).toBe('dark');
  });

  it('falls back to the dark theme for an unknown saved value', () => {
    localStorage.setItem('theme', 'retro');
    const component = create();
    expect(component.isLightTheme()).toBe(false);
    expect(theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('switches back to the dark theme when isLightTheme is false', () => {
    localStorage.setItem('theme', 'cupcake');
    const component = create();
    component.isLightTheme.set(false);
    TestBed.tick();
    expect(theme()).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('switches to the light theme when isLightTheme is true', () => {
    const component = create();
    component.isLightTheme.set(true);
    TestBed.tick();
    expect(theme()).toBe('cupcake');
    expect(localStorage.getItem('theme')).toBe('cupcake');
  });
});
