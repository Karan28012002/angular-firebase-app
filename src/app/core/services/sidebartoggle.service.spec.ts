import { TestBed } from '@angular/core/testing';

import { SidebartoggleService } from './sidebartoggle.service';

describe('SidebartoggleService', () => {
  let service: SidebartoggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebartoggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
