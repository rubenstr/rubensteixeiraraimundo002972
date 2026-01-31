import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetDetailModal } from './pet-detail-modal';

describe('PetDetailModal', () => {
  let component: PetDetailModal;
  let fixture: ComponentFixture<PetDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
