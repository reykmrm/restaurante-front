/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SupervisorService } from './supervisor.service';

describe('Service: Supervisor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupervisorService]
    });
  });

  it('should ...', inject([SupervisorService], (service: SupervisorService) => {
    expect(service).toBeTruthy();
  }));
});
