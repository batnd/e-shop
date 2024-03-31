import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

export const authGuard: CanActivateFn = (): boolean => {
  const router: Router = inject(Router);
  const localStorageService: LocalStorageService = inject(LocalStorageService);

  const token: string | null = localStorageService.getToken();

  if (token) {
    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    if (tokenDecode.isAdmin && !tokenExpired(tokenDecode.exp)) return true;
  }

  router.navigate(['/login']);
  return false;
};

const tokenExpired = (expiration: number): boolean => {
  return Math.floor(new Date().getTime() / 1000) >= expiration;
}
