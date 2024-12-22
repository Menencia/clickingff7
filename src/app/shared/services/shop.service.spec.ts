import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { ShopService } from './shop.service';
import { StoreService } from './store.service';

describe('ShopService', () => {
  let service: ShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(StoreService)],
    });
    service = TestBed.inject(ShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
