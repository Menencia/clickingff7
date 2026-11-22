import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFooterComponent } from './ui-footer.component';

describe('UiFooterComponent', () => {
  let component: UiFooterComponent;
  let fixture: ComponentFixture<UiFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiFooterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('version', '1.2.3');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the given version', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#step12')?.textContent?.trim()).toBe('1.2.3');
  });
});
