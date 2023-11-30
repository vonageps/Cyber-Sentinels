import { TestBed } from '@angular/core/testing';

import { CvAnalyserService } from './cv-analyser.service';

describe('CvAnalyserService', () => {
  let service: CvAnalyserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvAnalyserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
