/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoteService } from './Lote.service';

describe('Service: LoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoteService]
    });
  });

  it('should ...', inject([LoteService], (service: LoteService) => {
    expect(service).toBeTruthy();
  }));
});
