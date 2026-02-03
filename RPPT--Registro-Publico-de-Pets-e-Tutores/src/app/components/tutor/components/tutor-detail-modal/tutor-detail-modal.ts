import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ITutor } from '../../../../interfaces/tutor.interfaces';
import { IPet } from '../../../../interfaces/pet.interfaces';

@Component({
  selector: 'app-tutor-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tutor-detail-modal.html',
})
export class TutorDetailModal {
  @Input({ required: true }) tutor!: ITutor;
  @Input() petsVinculados: IPet[] = [];
  @Input() petsDisponiveis: IPet[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ITutor>();
  @Output() vincularPet = new EventEmitter<number>();
  @Output() desvincularPet = new EventEmitter<number>();
  @Output() uploadFoto = new EventEmitter<File>();

  editMode = signal(false);

  tutorEdit = signal<ITutor>({} as ITutor);

  ngOnInit() {
    this.tutorEdit.set({ ...this.tutor });
  }

  enableEdit() {
    this.editMode.set(true);
  }

  cancelEdit() {
    this.tutorEdit.set({ ...this.tutor });
    this.editMode.set(false);
  }

  saveTutor() {
    this.save.emit(this.tutorEdit());
    this.editMode.set(false);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.uploadFoto.emit(input.files[0]);
    }
  }
}
