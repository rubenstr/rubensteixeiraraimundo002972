import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PetContent, PetListInterface, Pet} from '../interfaces/pet.interfaces';
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

create(payload: any) {
  return this._http.post<Pet>(`${environment.NG_APP_API_URL}/v1/pets`, payload);
}

update(id: number, payload: any) {
  return this._http.put(`/v1/pets/${id}`, payload);
}

uploadPhoto(id: number, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return this._http.post(`${environment.NG_APP_API_URL}v1/pets/${id}/fotos`, formData);
}

}
