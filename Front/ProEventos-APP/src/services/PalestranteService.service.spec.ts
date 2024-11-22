/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PalestranteServiceService } from './PalestranteService.service';

describe('Service: PalestranteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PalestranteServiceService]
    });
  });

  it('should ...', inject([PalestranteServiceService], (service: PalestranteServiceService) => {
    expect(service).toBeTruthy();
  }));
});
