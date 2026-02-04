import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuSuperior } from '../shared/menu-superior/menu-superior';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { dashboardFilter, selectedTutor } from './dashboard-state';
import { PetFormModal } from '../pet/components/pet-form-modal/pet-form-modal';
import { PetDetailModal } from '../pet/components/pet-detail-modal/pet-detail-modal';
import { PetService } from '../../services/pet.service';
import { IPet } from '../../interfaces/pet.interfaces';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { TutorDetailModal } from '../tutor/components/tutor-detail-modal/tutor-detail-modal';
import { ITutor } from '../../interfaces/tutor.interfaces';
import { TutorService } from '../../services/tutor.service';
import { Observable } from 'rxjs';
import { TutorFormModal } from '../tutor/components/tutor-form-modal/tutor-form-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PetFormModal,
    TutorFormModal,
    TutorDetailModal,
    PetDetailModal,
    CommonModule,
    MenuSuperior,
    RouterOutlet
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly petService: PetService,
    private readonly tutorService: TutorService,
    private readonly authService: AutenticacaoService
  ) { }

  //******* */ Signals PET **********-- >
  activeTab = signal<'pets' | 'tutores'>('pets');
  filterText = signal('');
  selectedPet = signal<IPet | null>(null);

  formMode = signal<'create' | 'edit'>('create');
  showPetForm = signal(false);
  showTutorForm = signal(false);

  showPetDetail = signal(false);
  loading = signal(false);

  //******* */ Signals TUTOR **********-- >
  selectedTutor = selectedTutor;
  petsDoTutor = signal<IPet[]>([]);
  petsSemTutor = signal<IPet[]>([]);
  showTutorDetail = signal(false);
  loadingTutor = signal(false);

  ngOnInit(): void {
    // Verifica token ao iniciar Dashboard
    if (!this.authService.isAuthenticated()) {
      console.log('🔴 Sem token válido, redirecionando para login');
      this.router.navigate(['/login']);
    }
  }

  onTabChange(tab: 'pets' | 'tutores') {
    this.activeTab.set(tab);
    this.filterText.set('');

    // Navegação relativa para rotas filhas do Dashboard
    this.router.navigate([tab], { relativeTo: this.route });
  }

  onFilterChange(value: string) {
    dashboardFilter.set(value);
  }

  openCreatePet() {
    this.selectedPet.set(null);
    this.formMode.set('create');
    this.showPetForm.set(true);
  }

  openCreateTutor(){
    this.selectedTutor.set(null);
    this.formMode.set('create');
    this.showTutorForm.set(true);
  }

  closeForm() {
    this.showPetForm.set(false);
  }

  closeTutorForm() {
    this.showTutorForm.set(false);
  }


  closeDetail() {
    this.showPetDetail.set(false);
    this.selectedPet.set(null);
  }

  // metoodos para gerenciar tutor
  openTutorDetail(tutor: ITutor) {
    this.selectedTutor.set(tutor);
    this.showTutorDetail.set(true);
    this.loadTutorRelations(tutor.id!);
  }


  closeTutorDetail() {
    this.showTutorDetail.set(false);
    this.selectedTutor.set(null);
    this.petsDoTutor.set([]);
    this.petsSemTutor.set([]);
  }

  private loadTutorRelations(tutorId: number) {
    this.loadingTutor.set(true);

    this.tutorService.getTutorById(tutorId).subscribe({
      next: (tutor: any) => {
        this.petsDoTutor.set(tutor.pets ?? []);
      },
      complete: () => this.loadingTutor.set(false),
    });

    this.petService.getPetsSemTutor().subscribe({
      next: (pets: any) => this.petsSemTutor.set(pets),
    });
  }




  updateTutor(event: any) {
    console.log('****dash Updating tutor with data:', event);
    const current = this.selectedTutor();
    if (!current?.id) return;

    this.tutorService.update(current.id, event).subscribe({
      next: updated => {
        this.selectedTutor.set({ ...current, ...updated });
      }
    });
  }

  vincularPet(petId: number) {
    const tutor = this.selectedTutor();
    if (!tutor?.id) return;

    this.tutorService.vincularPet(tutor.id, petId).subscribe({
      next: () => {
        const pet = this.petsSemTutor().find(p => p.id === petId);
        if (!pet) return;

        this.petsSemTutor.set(
          this.petsSemTutor().filter(p => p.id !== petId)
        );

        this.petsDoTutor.set([...this.petsDoTutor(), pet]);
      }
    });
  }

  desvincularPet(petId: number) {
    const tutor = this.selectedTutor();
    if (!tutor?.id) return;

    this.tutorService.desvincularPet(tutor.id, petId).subscribe({
      next: () => {
        const pet = this.petsDoTutor().find(p => p.id === petId);
        if (!pet) return;

        this.petsDoTutor.set(
          this.petsDoTutor().filter(p => p.id !== petId)
        );

        this.petsSemTutor.set([...this.petsSemTutor(), pet]);
      }
    });
  }

  uploadFotoTutor(file: File) {
    const tutor = this.selectedTutor();
    if (!tutor?.id) return;

    this.tutorService.uploadPhoto(tutor.id, file).subscribe({
      next: (foto: any) => {
        this.selectedTutor.set({
          ...tutor,
          fotoUrl: foto.url
        });
      }
    });
  }

}