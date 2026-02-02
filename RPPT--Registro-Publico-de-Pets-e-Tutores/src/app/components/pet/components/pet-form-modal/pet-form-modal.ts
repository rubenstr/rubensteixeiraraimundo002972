import { Component, computed, inject, Input, OnInit, output, signal } from '@angular/core';
import { PetService } from '../../../../services/pet.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPet } from '../../../../interfaces/pet.interfaces';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-form-modal',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './pet-form-modal.html',
  styleUrl: './pet-form-modal.css',
})
export class PetFormModal implements OnInit {
  @Input() pet?: any;
  @Input() mode: 'create' | 'edit' = 'create';

  close = output<void>();
  saved = output<void>();

  loading = signal(false);

  title = computed(() =>
    this.mode === 'create' ? 'Novo Pet' : 'Editar Pet'
  );

  private readonly fb = inject(FormBuilder);

  selectedFile?: File;

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    idade: [null],
    raca: ['']
  });

  constructor(private readonly petService: PetService) { }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.pet) {
      this.form.patchValue({
        nome: this.pet.nome,
        idade: this.pet.idade,
        raca: this.pet.raca
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const payload = this.form.getRawValue();

    if (this.mode === 'create') {
      this.createPet(payload);
    } else {
      this.updatePet(payload);
    }
  }

  private createPet(payload: any) {
    this.petService.create(payload).subscribe({
      next: (pet: IPet) => this.uploadPhotoIfNeeded(pet.id ?? 0),
      error: () => this.loading.set(false)
    });
  }

  private updatePet(payload: any) {
    if (!this.pet?.id) return;

    this.petService.update(this.pet.id, payload).subscribe({
      next: () => this.uploadPhotoIfNeeded(this.pet!.id),
      error: () => this.loading.set(false)
    });
  }

  private uploadPhotoIfNeeded(petId: number) {
    if (!this.selectedFile) {
      this.finish();
      return;
    }

    this.petService.uploadPhoto(petId, this.selectedFile).subscribe({
      next: () => this.finish(),
      error: () => this.loading.set(false)
    });
  }

  private finish() {
    this.loading.set(false);
    this.saved.emit();
    this.close.emit();
  }
}
