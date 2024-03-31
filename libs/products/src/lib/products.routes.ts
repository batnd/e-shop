import { Route } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const productsRoutes: Route[] = [
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'products/:productId',
    component: ProductDetailComponent
  },
  {
    path: 'category/:categoryId',
    component: ProductsListComponent
  }
];
