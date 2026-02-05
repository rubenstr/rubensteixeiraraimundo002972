import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { mapTo, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Credentials } from '../../interfaces/credentials.interfaces';


@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private _token: string | null = null;
  private _refreshToken: string | null = null;

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(credentials: Credentials): Observable<void> {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${environment.NG_APP_API_URL}autenticacao/login`,
      credentials
    ).pipe(
      tap(res => this.setTokens(res.access_token, res.refresh_token)),
      mapTo(void 0)
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    this._token = accessToken;
    this._refreshToken = refreshToken;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_KEY, refreshToken);
    }
  }

  loadTokenFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._token = localStorage.getItem(this.TOKEN_KEY);
    this._refreshToken = localStorage.getItem(this.REFRESH_KEY);
  }

  isAuthenticated(): boolean {
    return !!this._token;
  }

  get token(): string | null {
    return this._token;
  }

  get refreshToken(): string | null {
    return this._refreshToken;
  }

  refreshTokenRequest(): Observable<void> {
    if (!this._refreshToken) return throwError(() => new Error('Refresh token ausente'));
    
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${environment.NG_APP_API_URL}autenticacao/refresh`,
      null,
      { headers: { Authorization: `Bearer ${this._refreshToken}` } }
    ).pipe(
      tap(res => this.setTokens(res.access_token, res.refresh_token)),
      mapTo(void 0)
    );
  }

  logout(): void {
    this._token = null;
    this._refreshToken = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
    }
    this.router.navigate(['/login']);
  }
}
