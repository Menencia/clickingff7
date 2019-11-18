import { TestBed } from '@angular/core/testing';

import { BuilderService } from './builder.service';

describe('BuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuilderService = TestBed.get(BuilderService);
    expect(service).toBeTruthy();
  });
});
