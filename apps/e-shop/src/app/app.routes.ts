import { Route } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { productsRoutes } from '@ltviz/products';
import { ordersRoutes } from '@ltviz/orders';
import { usersRoutes } from '@ltviz/users';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomePageComponent,

  },
  ...productsRoutes,
  ...ordersRoutes,
  ...usersRoutes
];
