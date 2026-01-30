import { Component , signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuSuperior } from '../shared/menu-superior/menu-superior';
import { Pet } from '../pet/pet';
import { Tutor } from '../tutor/tutor';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [    
    CommonModule,
    MenuSuperior,
    Pet,
    Tutor],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  
  activeTab = signal<'pets' | 'tutores'>('pets');
  filterText = signal('');

  onTabChange(tab: 'pets' | 'tutores') {
    this.activeTab.set(tab);
    this.filterText.set('');
  }

  onFilterChange(value: string) {
    this.filterText.set(value);
  }

}
