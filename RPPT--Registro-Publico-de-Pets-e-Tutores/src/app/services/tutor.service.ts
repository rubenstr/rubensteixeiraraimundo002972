import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ITutor, ITutorListInterface } from '../interfaces/tutor.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TutorService {

  baseURI = environment.NG_APP_API_URL + 'v1/tutores';
  token: string | null ='';
  headers: any;

  constructor(private readonly _http: HttpClient) {} 


getTutores(page: number, size: number): Observable<ITutorListInterface> {
  return this._http.get<ITutorListInterface>(
    `${environment.NG_APP_API_URL}v1/tutores`,
    {
      params: {
        page,
        size
      }
    }
  );
}

getTutorById(id: number) {
  return this._http.get(
    `${environment.NG_APP_API_URL}v1/tutores/${id}`
  );
}

create(payload: any) {
  return this._http.post<ITutor>(`${environment.NG_APP_API_URL}v1/tutores`, payload);
}

update(id: number, payload: any) {
  return this._http.put(`/v1/tutores/${id}`, payload);
}

uploadPhoto(id: number, file: File) {
  const formData = new FormData();
  formData.append('foto', file);
  return this._http.post(`${environment.NG_APP_API_URL}v1/tutores/${id}/fotos`, formData);
}

updateTutor(
  id: number,
  payload: Partial<{
    nome: string;
    raca: string;
    idade: number;
  }>
) {
  return this._http.put<ITutor>(
    `${this.baseURI}/${id}`,
    payload
  );
}

  vincularPet(tutorId: number, petId: number): Observable<void> {
    return this._http.post<void>(
      `${this.baseURI}/${tutorId}/pets/${petId}`,
      {}
    );
  }

  desvincularPet(tutorId: number, petId: number): Observable<void> {
    return this._http.delete<void>(
      `${this.baseURI}/${tutorId}/pets/${petId}`
    );
  }



  
}



