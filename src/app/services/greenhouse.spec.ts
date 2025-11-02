import { TestBed } from '@angular/core/testing';

import { Greenhouse } from './greenhouse';

describe('Greenhouse', () => {
  let service: Greenhouse;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Greenhouse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
