import { Component, ViewChild, AfterViewInit, Directive } from '@angular/core';
import { PetService } from '../../services/pet.service';
import { PetListInterface } from '../../interfaces/pet.interfaces';
import { CommonModule, JsonPipe } from '@angular/common';


@Component({
  selector: 'app-pet',
  imports: [JsonPipe, CommonModule],
  standalone: true,
  templateUrl: './pet.html',
  styleUrl: './pet.css',
})

export class Pet implements AfterViewInit{
  
  constructor(private _petService: PetService) {}
 
  petsList: PetListInterface[] = [];

   ngAfterViewInit() {
    this._petService.getPets().subscribe((data: PetListInterface[])=> {
      console.log("****Data: ", data.content);
      this.petsList  = data;
    }) ;
 
  }





}
