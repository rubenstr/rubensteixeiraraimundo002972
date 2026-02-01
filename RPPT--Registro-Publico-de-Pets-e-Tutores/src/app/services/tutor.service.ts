import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TutorService {

  constructor(private readonly _http: HttpClient) {} 
  getTutorById(id: number) {
  return this._http.get(
    `${environment.NG_APP_API_URL}v1/tutores/${id}`
  );
}
}
