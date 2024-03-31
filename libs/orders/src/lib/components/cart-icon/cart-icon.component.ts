import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { BadgeModule } from 'primeng/badge';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ltviz-orders-cart-icon',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './cart-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartIconComponent {
  private cartService: CartService = inject(CartService);
  public cart$: Observable<number> = this.cartService.cartItemsQuantity$;
}
