import { Component, computed, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPet, IPetContent, IPetListInterface } from '../../interfaces/pet.interfaces';
import { PetService } from '../../services/pet.service';
import { dashboardFilter } from '../dashboard/dashboard-state';
import { Pagination } from '../shared/pagination/pagination';
import { PetDetailModal } from './components/pet-detail-modal/pet-detail-modal';
import { UpdatePetDTO } from '../../interfaces/update-pet.dto';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../core/services/autenticacao.service';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [CommonModule, Pagination, PetDetailModal],
  templateUrl: './pet.html',
})
export class Pet implements OnInit {

  petsList = signal<IPetContent[]>([]);

  page = signal(0);
  size = signal(10);
  total = signal(0);
  pageCount = signal(0);

 selectedPetId = signal<number | null>(null);
 petDetail = signal<IPet | null>(null);
 loadingDetail = signal(false);

  constructor(
    private readonly _petService: PetService, 
    private readonly router: Router,
    private readonly authService: AutenticacaoService
  ) {}



  ngOnInit() {

    this.loadPets();
  if (!this.authService.isAuthenticated()) {
    console.log('🔴 Sem token válido, redirecionando para login');
    this.router.navigate(['/login']);
  } else {
    console.log('🟢 Token válido, carregando componente');
  }
}

  loadPets(): void {
    this._petService.getPets(this.page(), this.size()).subscribe({
      next: (response: IPetListInterface) => {
        this.petsList.set(response.content);
        this.total.set(response.total);
        this.pageCount.set(response.pageCount);
      },
      error: (err:any) => {
        this.petsList.set([]);
      }
    });
  }

  trackByPetId = (_: number, pet: IPetContent) => pet.id;


filteredPets = computed<IPetContent[]>(() => {
  const text = dashboardFilter().toLowerCase();

  if (!text) {
    return this.petsList(); 
  }

  return this.petsList().filter(pet =>
    pet.nome.toLowerCase().includes(text)
  );
});

  onPageChange(newpage: number) {
    this.page.set(newpage);
    this.loadPets();
  }

  onSizeChange(newSize: number) {
  this.size.set(newSize);
  this.page.set(0);     
  this.loadPets();
}

openPetDetail(petId: number) {
  this.selectedPetId.set(petId);
  this.loadingDetail.set(true);

  this._petService.getPetById(petId).subscribe({
    next: pet => {
      this.petDetail.set(pet);
      this.loadingDetail.set(false);
    },
    error: () => {
      this.loadingDetail.set(false);
    }
  });
}

onSavePet(payload: UpdatePetDTO) {
  const pet = this.petDetail();
  if (!pet || !pet.id) return;

  this.loadingDetail.set(true);

  this._petService.updatePet(pet.id, payload).subscribe({
    next: updatedPet => {
      this.petDetail.set(updatedPet);
      this.loadingDetail.set(false);
    },
    error: err => {
      console.error('🔴 erro ao atualizar pet:', err);
      this.loadingDetail.set(false);
    }
  });
}

closePetDetail() {
  this.selectedPetId.set(null);
  this.petDetail.set(null);
}



}
