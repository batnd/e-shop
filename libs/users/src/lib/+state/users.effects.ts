import { inject } from '@angular/core';
import { createEffect, Actions, ofType, FunctionalEffect } from '@ngrx/effects';
import { catchError, of, map, switchMap } from 'rxjs';
import { usersActions } from './users.actions';
import { LocalStorageService } from '../services/local-storage.service';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.interface';

export const buildUserSession$: FunctionalEffect = createEffect(
  (
    actions$: Actions = inject(Actions),
    localStorageService: LocalStorageService = inject(LocalStorageService),
    usersService: UsersService = inject(UsersService)
  ) => {
    return actions$.pipe(
      ofType(usersActions.buildUserSession),
      switchMap(() => {
        const isCurrentTokenValid: boolean = localStorageService.isValidToken();
        const userId: string | null = isCurrentTokenValid ?  localStorageService.getUserIdFromToken() : null;

        if (userId) {
          return usersService.getUser(userId).pipe(
            map((user: User) => usersActions.buildUserSessionSuccess({ user })),
            catchError(() => of(usersActions.buildUserSessionFailure()))
          )
        } else {
          return of(usersActions.buildUserSessionFailure());
        }
      }),
    );
  },
  { functional: true },
);
