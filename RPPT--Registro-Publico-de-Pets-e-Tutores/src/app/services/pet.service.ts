import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IPetContent, IPetListInterface, IPet} from '../interfaces/pet.interfaces';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class PetService {
   
  baseURI = environment.NG_APP_API_URL + 'v1/pets';
  token: string | null ='';
  headers: any;

  constructor(private readonly _http: HttpClient) {} 


getPets(page: number, size: number): Observable<IPetListInterface> {
  return this._http.get<IPetListInterface>(
    `${environment.NG_APP_API_URL}v1/pets`,
    {
      params: {
        page,
        size
      }
    }
  );
}

getPetById(id: number): Observable<IPetContent> {
  return this._http.get<IPetContent>(
    `${environment.NG_APP_API_URL}v1/pets/${id}`
  );
}

getAllPets(): Observable<IPetListInterface> {
  return this._http.get<IPetListInterface>(
    `${environment.NG_APP_API_URL}v1/pets`
  );
}

create(payload: any) {
  return this._http.post<IPet>(`${environment.NG_APP_API_URL}v1/pets`, payload);
}

update(id: number, payload: any) {
  return this._http.put(`/v1/pets/${id}`, payload);
}

uploadPhoto(id: number, file: File) {
  const formData = new FormData();
  formData.append('foto', file);
  return this._http.post(`${environment.NG_APP_API_URL}v1/pets/${id}/fotos`, formData);
}

updatePet(
  id: number,
  payload: Partial<{
    nome: string;
    raca: string;
    idade: number;
  }>
) {
  return this._http.put<IPet>(
    `${this.baseURI}/${id}`,
    payload
  );
}

 getPetsSemTutor(): Observable<IPet[]> {
    return this._http.get<IPet[]>(`${this.baseURI}`, {
      params: {
        semTutor: true,
      },
    });
  }

}
