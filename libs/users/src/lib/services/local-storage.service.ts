import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private TOKEN: string = 'jwtToken';
  public setToken(data: string): void {
    localStorage.setItem(this.TOKEN, data);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN);
  }

  public removeToken(): void {
    localStorage.removeItem(this.TOKEN);
  }

  public isValidToken(): boolean {
    const token: string | null = this.getToken();
    if (!token) return false;

    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    return !this._tokenExpired(tokenDecode.exp);
  }

  public getUserIdFromToken(): string | null {
    const token: string | null = this.getToken();
    if (!token) return null;

    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    if (tokenDecode) return tokenDecode.userId;
    else return null;
  }

  private _tokenExpired(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
