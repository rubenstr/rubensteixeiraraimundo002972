import { Component, computed, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPet, IPetContent, IPetListInterface } from '../../interfaces/pet.interfaces';
import { PetService } from '../../services/pet.service';
import { dashboardFilter } from '../dashboard/dashboard-state';
import { Pagination } from '../shared/pagination/pagination';
import { PetDetailModal } from './components/pet-detail-modal/pet-detail-modal';

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

  constructor(private readonly _petService: PetService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this._petService.getPets(this.page(), this.size()).subscribe({
      next: (response: IPetListInterface) => {
        this.petsList.set(response.content);
        this.total.set(response.total);
        this.pageCount.set(response.pageCount);
      },
      error: (err:any) => {
        console.error('Erro ao buscar pets', err);
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

// openPetDetail(id: number) {
//   this.selectedPetId.set(id);
//   this.loadingDetail.set(true);

//   this._petService.getPetById(id).subscribe({
//     next: pet => {
//       this.petDetail.set(pet);
//       this.loadingDetail.set(false);
//     },
//     error: () => {
//       this.petDetail.set(null);
//       this.loadingDetail.set(false);
//     }
//   });
// }

closePetDetail() {
  this.selectedPetId.set(null);
  this.petDetail.set(null);
}



}
