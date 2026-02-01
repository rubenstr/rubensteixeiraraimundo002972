import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PetContent, PetListInterface } from '../interfaces/pet.interfaces';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class PetService {
   
  baseURI = environment.NG_APP_API_URL + 'v1/pets?';
  token: string | null ='';
  headers: any;

  constructor(private readonly _http: HttpClient) {} 


getPets(page: number, size: number): Observable<PetListInterface> {
  return this._http.get<PetListInterface>(
    `${environment.NG_APP_API_URL}v1/pets`,
    {
      params: {
        page,
        size
      }
    }
  );
}

getPetById(id: number): Observable<PetContent> {
  return this._http.get<PetContent>(
    `${environment.NG_APP_API_URL}v1/pets/${id}`
  );
}

}
