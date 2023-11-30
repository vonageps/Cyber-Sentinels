import { TestBed } from '@angular/core/testing';

import { TrulienceService } from './trulience.service';

describe('TrulienceService', () => {
  let service: TrulienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrulienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
