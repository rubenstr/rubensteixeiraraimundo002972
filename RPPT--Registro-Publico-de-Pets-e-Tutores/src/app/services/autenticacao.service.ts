import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Credentials } from '../interfaces/credentials.interfaces';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class Autenticacao {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private token: string | null = null;
  private readonly autenticacaoURI = "autenticacao/login";

  login(credentials: Credentials): Observable<any> {
    console.log('chamou login - ', credentials);
    console.log(environment.NG_APP_API_URL + this.autenticacaoURI);
    return this.http.post<any>(environment.NG_APP_API_URL + this.autenticacaoURI, credentials).pipe(
      tap(response => {
        console.log('****response', response);
        this.token = response.access_token;
        localStorage.setItem('access_token', response.access_token);
        this.router.navigate(['/pets']);
      })
    );

  }

  getToken(): string | null {
    return this.token;
  }

  // logout(): void {
  //   this.token = null;
  //   localStorage.removeItem('authToken');
  // }

  // isLoggedIn(): boolean {
  //   return !!this.token;
  // }

}
