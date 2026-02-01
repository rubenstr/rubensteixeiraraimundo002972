import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFormModal } from './pet-form-modal';

describe('PetFormModal', () => {
  let component: PetFormModal;
  let fixture: ComponentFixture<PetFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
