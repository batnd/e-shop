import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Cart } from '../../models/cart.interface';
import { CartItem } from '../../models/cart-item.interface';
import { OrdersService } from '../../services/orders.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

const UX_MODULES = [
  ButtonModule
]

@Component({
  selector: 'ltviz-orders-order-summary',
  standalone: true,
  imports: [
    CommonModule,
    ...UX_MODULES
  ],
  templateUrl: './order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryComponent implements OnInit {
  private cartService: CartService = inject(CartService);
  private ordersService: OrdersService = inject(OrdersService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);

  public totalPrice: number = 0;
  public isCheckout: boolean = false;

  ngOnInit(): void {
    this.router.url.includes('checkout') ? this.isCheckout = true : this.isCheckout = false;
    this._getOrderSummary();
  }

  private _getOrderSummary(): void {
    this.cartService.cart$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((cart: Cart): void => {
        this.totalPrice = 0;
        if (cart && cart.items.length) {
          cart.items.map((item: CartItem): void => {
            this.ordersService.getProduct(item.productId)
              .pipe(
                takeUntilDestroyed(this.destroyRef),
                take(1)
              )
              .subscribe((product): void => {
                this.totalPrice += product.price * item.quantity;
                this.cdr.markForCheck();
              })
          })
        }
      })
  }

  public navigateToCheckout(): void {
    this.router.navigate(['checkout']);
  }
}
