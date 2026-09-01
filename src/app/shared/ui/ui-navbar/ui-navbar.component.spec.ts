import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UiNavbarComponent } from './ui-navbar.component';

describe('UiNavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiNavbarComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UiNavbarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
