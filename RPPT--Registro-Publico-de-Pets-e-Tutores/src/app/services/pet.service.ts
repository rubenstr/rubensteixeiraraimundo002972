import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticacao } from './autenticacao.service';
import { environment } from '../../environments/environment.development';
import { PetListInterface } from '../interfaces/pet.interfaces';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class PetService {
   
  baseURI = environment.NG_APP_API_URL + 'v1/pets?';
  token: string | null ='';
  headers: any;

  constructor(private readonly _http: HttpClient, private readonly _aut: Autenticacao) {} 


  getPets(page: number, size: number): Observable<PetListInterface> {
    this.token = this._aut.getToken();
    console.log('**** getPets chamado', this.token );
    this.headers = {
      'Authorization': `Bearer ${this.token}`,
    };
    return this._http.get<PetListInterface>(this.baseURI, { headers: this.headers });
  }
}
