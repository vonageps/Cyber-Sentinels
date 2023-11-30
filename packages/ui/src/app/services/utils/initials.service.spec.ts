import { TestBed } from '@angular/core/testing';

import { InitialsService } from './initials.service';

describe('InitialsService', () => {
  let service: InitialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
