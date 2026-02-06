import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { ITutorContent, ITutorListInterface } from '../../interfaces/tutor.interfaces';
import { TutorService } from '../../services/tutor.service';
import { TutorCard } from './components/tutor-card/tutor-card';
import { openTutorDetail } from '../dashboard/dashboard-state';
import { IPet } from '../../interfaces/pet.interfaces';
import { Dashboard } from '../dashboard/dashboard';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-tutor',
  imports: [TutorCard],
  templateUrl: './tutor.html',
  styleUrl: './tutor.css',
})
export class Tutor implements OnInit {
  tutoresList = signal<ITutorContent[]>([]);
  loading = signal(false);
  petsDisponiveis = signal<IPet[]>([]);
  page = signal(0);
  size = signal(100);
  total = signal(0);
  pageCount = signal(0);

    constructor(
    private readonly _tutorService: TutorService, 
    private readonly _petService: PetService,
    private readonly _dashboard: Dashboard,
    private readonly router: Router,
    private readonly authService: AutenticacaoService
  ) {}

    ngOnInit() {
  
      this.loadTutores();
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
    }
  }
  
    loadTutores(): void {
      this._tutorService.getTutores(this.page(), this.size()).subscribe({
        next: (response: ITutorListInterface) => {
          this.tutoresList.set(response.content);
          this.total.set(response.total);
          this.pageCount.set(response.pageCount);
        },
        error: (err:any) => {
          this.tutoresList.set([]);
        }
      });
    }

 onSelectTutor(tutor: ITutorContent) {
  this._tutorService.getTutorById(tutor.id).subscribe({
    next: tutorCompleto => {
      openTutorDetail(tutorCompleto);
      this.loadPetsDisponiveis(tutorCompleto.pets ?? []);
      this._dashboard.openTutorDetail(tutor);
    },
    error: () => {
      console.error('Erro ao carregar tutor completo');
    }
  });
}

private loadPetsDisponiveis(petsVinculados: IPet[]) {
  this._petService.getPets(0, 1000).subscribe({
    next: response => {
      const todos = response.content ?? [];
      const vinculadosIds = new Set(
        petsVinculados.map(p => p.id)
      );

      const disponiveis = todos.filter(
        pet => !vinculadosIds.has(pet.id)
      );

      this.petsDisponiveis.set(disponiveis);
    }
  });
}

}
