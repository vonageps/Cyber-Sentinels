import { TestBed } from '@angular/core/testing';

import { VideoMsService } from './video-ms.service';

describe('VideoMsService', () => {
  let service: VideoMsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoMsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
