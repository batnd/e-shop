import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { usersActions } from './users.actions';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { selectIsAuthenticated, selectUser } from './users.selectors';

@Injectable({
  providedIn: 'root'
})
export class UsersFacade {
  private readonly store: Store = inject(Store);

  public currentUser$: Observable<User | null> = this.store.select(selectUser);
  public isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);

  public buildUserSession(): void {
    this.store.dispatch(usersActions.buildUserSession());
  }
}
