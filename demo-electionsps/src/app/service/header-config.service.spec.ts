import { TestBed } from '@angular/core/testing';

import { HeaderConfigService } from './header-config.service';

describe('HeaderConfigService', () => {
  let service: HeaderConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
