import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ViewShopComponent } from './view-shop.component';

describe('ViewShopComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewShopComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewShopComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
