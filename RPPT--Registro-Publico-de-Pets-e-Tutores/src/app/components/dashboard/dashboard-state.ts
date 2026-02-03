import { signal } from '@angular/core';
import { IPet } from '../../interfaces/pet.interfaces';
import { ITutor, ITutorContent } from '../../interfaces/tutor.interfaces';

export const dashboardFilter = signal('');

/* ---------------- PET ---------------- */
export const selectedPet = signal<IPet | null>(null);
export const showPetDetail = signal(false);

/* ---------------- TUTOR ---------------- */
export const selectedTutor = signal<ITutor | null>(null);
export const showTutorDetail = signal(false);

/* ---------- Helpers (opcional, mas recomendado) ---------- */

export function openPetDetail(pet: IPet) {
  selectedPet.set(pet);
  showPetDetail.set(true);
}

export function closePetDetail() {
  selectedPet.set(null);
  showPetDetail.set(false);
}

export function openTutorDetail(tutor: ITutor) {
  selectedTutor.set(tutor);
  showTutorDetail.set(true);
}

export function closeTutorDetail() {
  selectedTutor.set(null);
  showTutorDetail.set(false);
}
