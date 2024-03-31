import { inject, Injectable } from '@angular/core';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { LoginRequest } from '../models/login-request.interface';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private localStorageService: LocalStorageService = inject(LocalStorageService);
  private router: Router = inject(Router);
  private apiURLAuth: string = environment.apiUrl + 'users';

  public login(loginData: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiURLAuth}/login`, loginData);
  }

  public logout(): void {
    this.localStorageService.removeToken();
    this.router.navigate(['/login']);
  }
}
