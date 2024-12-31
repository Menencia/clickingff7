import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { UiNavbarComponent } from './ui-navbar.component';

describe('UiNavbarComponent', () => {
  let component: UiNavbarComponent;
  let fixture: ComponentFixture<UiNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiNavbarComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(UiNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
