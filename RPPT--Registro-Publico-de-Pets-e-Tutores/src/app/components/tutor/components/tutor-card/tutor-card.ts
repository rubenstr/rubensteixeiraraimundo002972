import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITutorContent } from '../../../../interfaces/tutor.interfaces';

@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutor-card.html',
})
export class TutorCard {
  @Input({ required: true }) tutor!: ITutorContent;
  @Output() select = new EventEmitter<ITutorContent>();

  onClick() {
    this.select.emit(this.tutor);
  }
}
