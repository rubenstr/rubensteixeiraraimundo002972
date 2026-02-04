import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorFormModal } from './tutor-form-modal';

describe('TutorFormModal', () => {
  let component: TutorFormModal;
  let fixture: ComponentFixture<TutorFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
