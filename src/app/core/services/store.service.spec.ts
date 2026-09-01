import { TestBed } from '@angular/core/testing';

import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(() => {
    service = TestBed.inject(StoreService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
