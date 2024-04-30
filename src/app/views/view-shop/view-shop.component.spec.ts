import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestModule } from 'src/app/shared/test/test.module';

import { ViewShopComponent } from './view-shop.component';

describe('ShopComponent', () => {
  let component: ViewShopComponent;
  let fixture: ComponentFixture<ViewShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
