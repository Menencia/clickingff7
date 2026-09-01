import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    service = TestBed.inject(DataService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
