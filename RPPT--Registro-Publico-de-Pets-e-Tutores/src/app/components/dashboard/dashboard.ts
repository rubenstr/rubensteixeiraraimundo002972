import { Component , signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuSuperior } from '../shared/menu-superior/menu-superior';
import { Pet } from '../pet/pet';
import { Tutor } from '../tutor/tutor';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [    
    CommonModule,
    MenuSuperior,
    RouterOutlet,
    Pet,
    Tutor],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
 constructor(private readonly router: Router) {}
  activeTab = signal<'pets' | 'tutores'>('pets');
  filterText = signal('');

onTabChange(tab: 'pets' | 'tutores') {
  this.activeTab.set(tab);
  this.filterText.set('');

  this.router.navigate([tab === 'pets' ? '/pets' : '/tutors']);
}

  onFilterChange(value: string) {
    console.log('Filter changed to:', value);
    this.filterText.set(value);
  }

}
