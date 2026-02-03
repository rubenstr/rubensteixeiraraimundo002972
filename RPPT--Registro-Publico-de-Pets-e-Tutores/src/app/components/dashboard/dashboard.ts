import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuSuperior } from '../shared/menu-superior/menu-superior';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { dashboardFilter } from './dashboard-state';
import { PetFormModal } from '../pet/components/pet-form-modal/pet-form-modal';
import { PetDetailModal } from '../pet/components/pet-detail-modal/pet-detail-modal';
import { PetService } from '../../services/pet.service';
import { IPet } from '../../interfaces/pet.interfaces';
import { AutenticacaoService } from '../../core/services/autenticacao.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PetFormModal,
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
    private readonly authService: AutenticacaoService
  ) {}

  activeTab = signal<'pets' | 'tutores'>('pets');
  filterText = signal('');
  selectedPet = signal<IPet | null>(null);

  formMode = signal<'create' | 'edit'>('create');
  showPetForm = signal(false);

  showPetDetail = signal(false);
  loading = signal(false);

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

  closeForm() {
    this.showPetForm.set(false);
  }

  closeDetail() {
    this.showPetDetail.set(false);
    this.selectedPet.set(null);
  }
}