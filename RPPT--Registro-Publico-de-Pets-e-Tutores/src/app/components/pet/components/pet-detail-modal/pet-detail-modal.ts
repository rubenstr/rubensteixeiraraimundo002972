import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, input, Output, output, signal } from '@angular/core';
import { TutorService } from '../../../../services/tutor.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetService } from '../../../../services/pet.service';

@Component({
  selector: 'app-pet-detail-modal',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './pet-detail-modal.html',
  styleUrl: './pet-detail-modal.css',
})
export class PetDetailModal {
  @Output() save = new EventEmitter<any>();

  pet = input<any | null>(null);
  loading = input<boolean>(false);
  close = output<void>();

  isEditing = signal(false);
  photoPreview = signal<string | null>(null);

  expandedTutorId = signal<number | null>(null);
  tutorDetail = signal<any | null>(null);
  loadingTutor = signal(false);

  private readonly fb = inject(FormBuilder);

form = this.fb.group({
  nome: [{ value: '', disabled: true }, Validators.required],
  raca: [{ value: '', disabled: true }, Validators.required],
  idade: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]]
});

  constructor( 
    private readonly tutorService: TutorService,
    private readonly petService: PetService
  ) {
    this.form.disable();

  effect(() => {
    const pet = this.pet();
    if (pet) {
      this.form.patchValue({
        nome: pet.nome,
        raca: pet.raca,
        idade: pet.idade
      });
    }
  });
   }

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

toggleEdit() {
  const editing = !this.isEditing();
  this.isEditing.set(editing);

  if (editing && this.pet()) {
    this.form.enable();

    this.form.patchValue({
      nome: this.pet()?.nome,
      raca: this.pet()?.raca,
      idade: this.pet()?.idade,
    });
  } else {
    this.form.disable();
    this.photoPreview.set(null);
  }
}

    onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

savePet() {
 
  if (this.form.invalid || !this.pet()) return;

  const payload = {
    nome: this.form.value.nome ?? undefined,
    raca: this.form.value.raca ?? undefined,
    idade: this.form.value.idade ?? undefined,
  };

  this.save.emit(payload);
}


}
