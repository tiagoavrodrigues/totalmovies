import { TestBed } from '@angular/core/testing';

import { RatedmoviesService } from './ratedmovies.service';

describe('RatedmoviesService', () => {
  let service: RatedmoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatedmoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
