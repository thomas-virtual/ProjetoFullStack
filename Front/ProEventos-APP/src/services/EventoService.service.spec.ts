/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EventoServiceService } from './EventoService.service';

describe('Service: EventoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventoServiceService]
    });
  });

  it('should ...', inject([EventoServiceService], (service: EventoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
