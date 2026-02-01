import { Component , signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuSuperior } from '../shared/menu-superior/menu-superior';
import { Router, RouterOutlet } from '@angular/router';
import { dashboardFilter } from './dashboard-state';
import { PetFormModal } from '../pet/components/pet-form-modal/pet-form-modal';
import { Pet } from '../pet/pet';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PetFormModal,    
    CommonModule,
    MenuSuperior,
    RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
 constructor(private readonly router: Router) {}
  activeTab = signal<'pets' | 'tutores'>('pets');
  filterText = signal('');
  selectedPet = signal<Pet | null>(null);
  formMode = signal<'create' | 'edit'>('create');
  showPetForm = signal(false);

onTabChange(tab: 'pets' | 'tutores') {
  this.activeTab.set(tab);
  this.filterText.set('');

  this.router.navigate([tab === 'pets' ? '/pets' : '/tutors']);
}

  onFilterChange(value: string) {
    console.log('Filter changed to:', value);
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

}
