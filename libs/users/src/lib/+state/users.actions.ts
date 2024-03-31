import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../models/user.interface';

export const usersActions = createActionGroup({
  source: 'Users',
  events: {
    'Build user session': emptyProps(),
    'Build user session success': props<{ user: User }>(),
    'Build user session failure': emptyProps()
  }
});
