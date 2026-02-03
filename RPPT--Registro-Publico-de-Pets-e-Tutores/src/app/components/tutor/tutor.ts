import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { ITutorContent, ITutorListInterface } from '../../interfaces/tutor.interfaces';
import { TutorService } from '../../services/tutor.service';
import { TutorCard } from './components/tutor-card/tutor-card';
import { openTutorDetail } from '../dashboard/dashboard-state';

@Component({
  selector: 'app-tutor',
  imports: [TutorCard],
  templateUrl: './tutor.html',
  styleUrl: './tutor.css',
})
export class Tutor implements OnInit {

  tutoresList = signal<ITutorContent[]>([]);
  loading = signal(false);

  page = signal(0);
  size = signal(10);
  total = signal(0);
  pageCount = signal(0);

    constructor(
    private readonly _tutorService: TutorService, 
    private readonly router: Router,
    private readonly authService: AutenticacaoService
  ) {}

    ngOnInit() {
  
      this.loadTutores();
    if (!this.authService.isAuthenticated()) {
      console.log('🔴 Sem token válido, redirecionando para login');
      this.router.navigate(['/login']);
    } else {
      console.log('🟢 Token válido, carregando componente');
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
    openTutorDetail(tutor as any);
  }

}
