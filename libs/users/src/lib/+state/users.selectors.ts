import { createFeatureSelector, createSelector } from '@ngrx/store';
import { usersReducer, UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>(usersReducer.name);

export const selectUser = createSelector(
  selectUsersState,
  (state: UsersState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectUsersState,
  (state: UsersState) => state.isAuthenticated
)
