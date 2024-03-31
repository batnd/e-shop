import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavComponent } from '../nav/nav.component';
import { ProductsSearchComponent } from '@ltviz/products';
import { CartIconComponent } from '@ltviz/orders';

@Component({
  selector: 'e-shop-header',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    RouterLink,
    ProductsSearchComponent,
    CartIconComponent
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
