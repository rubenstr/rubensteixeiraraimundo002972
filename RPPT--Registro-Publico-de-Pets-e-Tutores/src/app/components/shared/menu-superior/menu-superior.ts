import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-menu-superior',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-superior.html',
  styleUrl: './menu-superior.css',
})
export class MenuSuperior {

  activeTab = input<'pets' | 'tutores'>('pets');

  tabChange = output<'pets' | 'tutores'>();
  filterChange = output<string>();

  selectTab(tab: 'pets' | 'tutores') {
    this.tabChange.emit(tab);
  }

  onFilterInput(event: Event) {
    console.log(event)
    const value = (event.target as HTMLInputElement).value;
    this.filterChange.emit(value);
  }
}
