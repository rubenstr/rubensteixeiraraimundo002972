import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { TutorService } from '../../../../services/tutor.service';

@Component({
  selector: 'app-pet-detail-modal',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pet-detail-modal.html',
  styleUrl: './pet-detail-modal.css',
})
export class PetDetailModal {
  pet = input<any | null>(null);
  loading = input(false);
  close = output<void>();

  expandedTutorId = signal<number | null>(null);
  tutorDetail = signal<any | null>(null);
  loadingTutor = signal(false);

  constructor(private readonly tutorService: TutorService) { }

  toggleTutor(tutorId: number) {
    if (this.expandedTutorId() === tutorId) {
      this.expandedTutorId.set(null);
      return;
    }

    this.expandedTutorId.set(tutorId);

    if (this.tutorDetail()?.id === tutorId) {
      return;
    }

    this.loadingTutor.set(true);

    this.tutorService.getTutorById(tutorId).subscribe({
      next: tutor => {
        this.tutorDetail.set(tutor);
        this.loadingTutor.set(false);
      },
      error: () => {
        this.tutorDetail.set(null);
        this.loadingTutor.set(false);
      }
    });
  }

}
