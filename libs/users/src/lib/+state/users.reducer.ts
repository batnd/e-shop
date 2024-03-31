import { createReducer, on, createFeature, FeatureConfig } from '@ngrx/store';

import { User } from '../models/user.interface';
import { usersActions } from './users.actions';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState {
  user: User | null,
  isAuthenticated: boolean
}

// export interface UsersPartialState {
//   readonly [USERS_FEATURE_KEY]: UsersState;
// }

export const initialUsersState: UsersState = {
  user: null,
  isAuthenticated: false,
};

export const usersReducer: FeatureConfig<string, UsersState> = createFeature({
  name: USERS_FEATURE_KEY,
  reducer: createReducer(
    initialUsersState,
    on(usersActions.buildUserSession, (state: UsersState): UsersState => ({ ...state })),
    on(usersActions.buildUserSessionSuccess, (state: UsersState, { user }: { user: User }): UsersState => ({
        ...state,
        user,
        isAuthenticated: true,
      }),
    ),
    on(usersActions.buildUserSessionFailure, (state: UsersState): UsersState => ({
      ...state,
      user: null,
      isAuthenticated: false
    }))
  ),
});
