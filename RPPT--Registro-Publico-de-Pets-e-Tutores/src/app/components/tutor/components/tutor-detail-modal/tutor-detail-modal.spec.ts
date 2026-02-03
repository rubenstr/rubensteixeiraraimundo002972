import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorDetailModal } from './tutor-detail-modal';

describe('TutorDetailModal', () => {
  let component: TutorDetailModal;
  let fixture: ComponentFixture<TutorDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
