import { TestBed } from '@angular/core/testing';

import { TicketsStorageService } from './tickets-storage.service';

describe('TicketsStorageService', () => {
  let service: TicketsStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
