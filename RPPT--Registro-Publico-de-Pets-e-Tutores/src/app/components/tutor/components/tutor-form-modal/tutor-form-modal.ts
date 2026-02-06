import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TutorService } from '../../../../services/tutor.service';
import { NgxMaskDirective, provideNgxMask, } from 'ngx-mask';

@Component({
  selector: 'app-tutor-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './tutor-form-modal.html',
})
export class TutorFormModal implements OnInit {

  @Input() tutor?: any;
  @Input() mode: 'create' | 'edit' = 'create';

  close = output<void>();
  saved = output<void>();

  loading = signal(false);
  selectedFile?: File;

  title = computed(() =>
    this.mode === 'create' ? 'Novo tutor' : 'Editar tutor'
  );

  private readonly fb = inject(FormBuilder);
  private readonly tutorService = inject(TutorService);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
    endereco: ['', Validators.required],
    cpf: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.mode === 'edit' && this.tutor) {
      this.form.patchValue({
        nome: this.tutor.nome,
        email: this.tutor.email,
        telefone: this.tutor.telefone,
        endereco: this.tutor.endereco,
        cpf: this.tutor.cpf?.toString() ?? ''
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
      this.createTutor(payload);
    } else {
      this.updateTutor(payload);
    }
  }

  private createTutor(payload: any) {
    this.tutorService.create(payload).subscribe({
      next: tutor => this.uploadPhotoIfNeeded(tutor.id!),
      error: () => this.loading.set(false),
    });
  }

  private updateTutor(payload: any) {
    if (!this.tutor?.id) return;
    this.tutorService.update(this.tutor.id, payload).subscribe({
      
      next: () => this.uploadPhotoIfNeeded(this.tutor!.id),
      error: () => this.loading.set(false),
    });
  }

  private uploadPhotoIfNeeded(tutorId: number) {
    if (!this.selectedFile) {
      this.finish();
      return;
    }

    this.tutorService.uploadPhoto(tutorId, this.selectedFile).subscribe({
      next: () => this.finish(),
      error: () => this.loading.set(false),
    });
  }

  private finish() {
    this.loading.set(false);
    this.saved.emit();
    this.close.emit();
  }

  onCancel(): void {
  this.close.emit();
}
}
