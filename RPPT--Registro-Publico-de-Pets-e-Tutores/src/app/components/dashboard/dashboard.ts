import { Component , signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuSuperior } from '../shared/menu-superior/menu-superior';
import { Router, RouterOutlet } from '@angular/router';
import { dashboardFilter } from './dashboard-state';
import { PetFormModal } from '../pet/components/pet-form-modal/pet-form-modal';
import { PetDetailModal } from '../pet/components/pet-detail-modal/pet-detail-modal';
import { PetService } from '../../services/pet.service';
import { IPet } from '../../interfaces/pet.interfaces';
import { UpdatePetDTO } from '../../interfaces/update-pet.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PetFormModal,
    PetDetailModal,    
    CommonModule,
    MenuSuperior,
    RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private readonly router: Router, private readonly petService: PetService) {}

  activeTab = signal<'pets' | 'tutores'>('pets');
  filterText = signal('');
  selectedPet = signal<IPet | null>(null);

  formMode = signal<'create' | 'edit'>('create');
  showPetForm = signal(false);

  showPetDetail = signal(false);
  loading = signal(false);

  onTabChange(tab: 'pets' | 'tutores') {
    this.activeTab.set(tab);
    this.filterText.set('');
    this.router.navigate([tab === 'pets' ? '/pets' : '/tutors']);
  }

  onFilterChange(value: string) {
    dashboardFilter.set(value);
  }

  openCreatePet() {
    this.selectedPet.set(null);
    this.formMode.set('create');
    this.showPetForm.set(true);
  }

  closeForm() {
    this.showPetForm.set(false);
  }

  closeDetail() {
    this.showPetDetail.set(false);
    this.selectedPet.set(null);
  }

updatePet(payload: UpdatePetDTO) {
   console.log('🟢 updatePet RECEBEU:', payload);
  const pet = this.selectedPet();

  if (!pet || pet.id === undefined){ console.log('🔴 selectedPet é null'); return;}

  this.loading.set(true);

  this.petService.updatePet(pet.id, payload).subscribe({
    next: updatedPet => {
      console.log('🟢 pet atualizado:', updatedPet);
      this.selectedPet.set(updatedPet);
      this.loading.set(false);
    },
        error: err => {
      console.error('🔴 erro updatePet', err);
      this.loading.set(false);
    }
  });
}

}