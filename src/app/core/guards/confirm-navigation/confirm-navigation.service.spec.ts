import { TestBed } from '@angular/core/testing';

import { ConfirmNavigationService } from './confirm-navigation.service';

describe('ConfirmNavigationService', () => {
  let service: ConfirmNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
