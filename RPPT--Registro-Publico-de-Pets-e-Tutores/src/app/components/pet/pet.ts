import { Component, computed, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetContent, PetListInterface } from '../../interfaces/pet.interfaces';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet.html',
})
export class Pet implements OnInit {

  petsList = signal<PetContent[]>([]);
  filter = input<string>('');

  page = signal(1);
  size = signal(100);
  total = signal(0);
  pageCount = signal(0);

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.petService.getPets(this.page(), this.size()).subscribe({
      next: (response: PetListInterface) => {
        this.petsList.set(response.content);
        this.total.set(response.total);
        this.pageCount.set(response.pageCount);
      },
      error: (err) => {
        console.error('Erro ao buscar pets', err);
        this.petsList.set([]);
      }
    });
  }

  trackByPetId = (_: number, pet: PetContent) => pet.id;


filteredPets = computed<PetContent[]>(() => {
  const text = this.filter().toLowerCase();

  if (!text) {
    return this.petsList(); 
  }

  return this.petsList().filter(pet =>
    pet.nome.toLowerCase().includes(text)
  );
});



}
