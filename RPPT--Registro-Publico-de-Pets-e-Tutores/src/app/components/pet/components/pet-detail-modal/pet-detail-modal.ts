import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

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

}
