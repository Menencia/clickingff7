import { TestBed } from '@angular/core/testing';

import { ShopService } from './shop.service';

describe('ShopService', () => {
  let service: ShopService;

  beforeEach(() => {
    service = TestBed.inject(ShopService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
