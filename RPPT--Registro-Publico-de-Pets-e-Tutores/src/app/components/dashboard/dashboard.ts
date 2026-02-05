import { Component, signal, OnInit, computed } from '@angular/core';
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
import { IPetResumo, ITutor, ITutorContent } from '../../interfaces/tutor.interfaces';
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
  petsVinculados = signal<IPet[]>([]);
  petsDisponiveis = signal<IPet[]>([]);
  showTutorDetail = signal(false);
  allPets = signal<IPet[]>([])
  loadingTutor = signal(false);

  

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  onTabChange(tab: 'pets' | 'tutores') {
    this.activeTab.set(tab);
    this.filterText.set('');
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

openTutorDetail(tutorResumo: ITutorContent) {
  this.loadingTutor.set(true);
  this.tutorService.getTutorById(tutorResumo.id!).subscribe({
    next: (tutorCompleto) => {
      this.selectedTutor.set(tutorCompleto);
      this.petsVinculados.set(tutorCompleto.pets ?? []);

      this.loadPetsDisponiveis(tutorCompleto.pets ?? []);
      this.showTutorDetail.set(true);
    },
    complete: () => this.loadingTutor.set(false),
  });
}


private loadPetsDisponiveis(petsVinculados: IPet[]) {
  this.petService.getAllPets().subscribe({
    next: response => {
      const todosPets = response.content ?? [];
      const petsVinculadosIds = new Set(
        petsVinculados.map(p => p.id)
      );
      const disponiveis = todosPets.filter(
        pet => !petsVinculadosIds.has(pet.id));
      this.petsDisponiveis.set(disponiveis);
    }
  });
}



  closeTutorDetail() {
    this.showTutorDetail.set(false);
    this.selectedTutor.set(null);
    this.petsVinculados.set([]);
    this.allPets.set([]);
  }

  updateTutor(event: any) {
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
      const pet = this.petsDisponiveis().find(p => p.id === petId);
      if (!pet) return;
      this.petsDisponiveis.set(
        this.petsDisponiveis().filter(p => p.id !== petId)
      );
      const novosVinculados = [...this.petsVinculados(), pet];
      this.petsVinculados.set(novosVinculados);
      this.selectedTutor.set({
        ...tutor,
        pets: novosVinculados.map(p => this.toPetResumo(p))

      });
    }
  });
}


desvincularPet(petId: number) {
  const tutor = this.selectedTutor();
  if (!tutor?.id) return;

  this.tutorService.desvincularPet(tutor.id, petId).subscribe({
    next: () => {
      const pet = this.petsVinculados().find(p => p.id === petId);
      if (!pet) return;

      const novosVinculados = this.petsVinculados().filter(
        p => p.id !== petId
      );

      this.petsVinculados.set(novosVinculados);
      this.petsDisponiveis.set([...this.petsDisponiveis(), pet]);

      // 🔑 sincroniza o tutor usado pelo card
      this.selectedTutor.set({
        ...tutor,
        pets: novosVinculados.map(p => this.toPetResumo(p))
      });
    }
  });
}

private toPetResumo(pet: IPet): any {
  return {
    id: pet.id!,          // aqui você garante que existe
    nome: pet.nome,
    especie: pet.especie
    // inclua apenas o que IPetResumo define
  };
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