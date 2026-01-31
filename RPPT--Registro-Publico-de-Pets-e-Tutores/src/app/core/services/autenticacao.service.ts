import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { mapTo, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Credentials } from '../../interfaces/credentials.interfaces';


@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private readonly TOKEN_KEY = 'access_token';
  private _token: string | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}
 
login(credentials: Credentials): Observable<void> {
  return this.http
    .post<{ access_token: string }>(
      `${environment.NG_APP_API_URL}autenticacao/login`,
      credentials
    )
    .pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
        }
        this.router.navigate(['/pets']);
      }),
      mapTo(void 0)
    );
}

 get token(): string | null {
    return this._token;
  }

  isAuthenticated(): boolean {
    return !!this._token;
  }

    private loadTokenFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('access_token');
    this._token = token;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.router.navigate(['/login']);
  }
}
