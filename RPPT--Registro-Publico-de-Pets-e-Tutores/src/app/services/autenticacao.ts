import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Credentials } from '../interfaces/credentials.interfaces';


@Injectable({
  providedIn: 'root',
})
export class Autenticacao {
   private http = inject(HttpClient);
    private token: string | null = null;
    private readonly autenticacaoURI = "autenticacao/login";

   // constructor(private readonly http: HttpClient) {
   // this.token = localStorage.getItem('authToken');
  //   console.log('token:',this.token);
  //   console.log('environment:',environment.NG_APP_API_URL);
  // }

  login(credentials: Credentials): Observable<any> {
    console.log('chamou login - ', credentials);
    console.log(environment.NG_APP_API_URL + this.autenticacaoURI);
    return this.http.post<any>(environment.NG_APP_API_URL + this.autenticacaoURI, credentials).pipe(
      tap(response => {
        console.log('****response',response);
        this.token = response.access_token;
        localStorage.setItem('access_token', response.access_token);
      })
    );
    
  }

  // getToken(): string | null {
  //   return this.token;
  // }

  // logout(): void {
  //   this.token = null;
  //   localStorage.removeItem('authToken');
  // }

  // isLoggedIn(): boolean {
  //   return !!this.token;
  // }
  
}
