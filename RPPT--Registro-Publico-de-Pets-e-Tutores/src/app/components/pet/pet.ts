import { Component, computed, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetContent, PetListInterface } from '../../interfaces/pet.interfaces';
import { PetService } from '../../services/pet.service';
import { dashboardFilter } from '../dashboard/dashboard-state';
import { Pagination } from '../shared/pagination/pagination';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './pet.html',
})
export class Pet implements OnInit {

  petsList = signal<PetContent[]>([]);

  page = signal(0);
  size = signal(10);
  total = signal(0);
  pageCount = signal(0);

  constructor(private readonly _petService: PetService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this._petService.getPets(this.page(), this.size()).subscribe({
      next: (response: PetListInterface) => {
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

  trackByPetId = (_: number, pet: PetContent) => pet.id;


filteredPets = computed<PetContent[]>(() => {
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



}
