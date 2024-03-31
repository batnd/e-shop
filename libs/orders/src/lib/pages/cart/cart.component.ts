import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Cart } from '../../models/cart.interface';
import { CartItem } from '../../models/cart-item.interface';
import { OrdersService } from '../../services/orders.service';
import { CartItemDetailed } from '../../models/cart-item-detailed.interface';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';
import { FormsModule } from '@angular/forms';

const UX_MODELS = [
  ButtonModule,
  InputNumberModule,
  ToastModule,
];

@Component({
  selector: 'ltviz-orders-cart',
  standalone: true,
  imports: [
    CommonModule,
    OrderSummaryComponent,
    FormsModule,
    ...UX_MODELS,
  ],
  templateUrl: './cart.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  private router: Router = inject(Router);
  private cartService: CartService = inject(CartService);
  private ordersService: OrdersService = inject(OrdersService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private messageService: MessageService = inject(MessageService);

  public cartItemsDetailed: CartItemDetailed[] = [];
  public cartCount: Observable<number> = this.cartService.cartItemsQuantity$;

  ngOnInit(): void {
    this._getCartDetails();
  }

  private _getCartDetails(): void {
    this.cartService.cart$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.cartItemsDetailed = [];
        }),
        switchMap((cart: Cart): Observable<(CartItemDetailed | null)[]> => {
          if (cart.items.length === 0) return of([]);

          const requests: Observable<CartItemDetailed | null>[] = cart.items.map((cartItem: CartItem) => {
            return this.ordersService.getProduct(cartItem.productId)
              .pipe(
                map((product): CartItemDetailed => {
                  return {
                    product,
                    quantity: cartItem.quantity,
                  };
                }),
                catchError(() => {
                  return of(null);
                }),
              );
          });

          return forkJoin(requests);
        }),
        map((results: (CartItemDetailed | null)[]) => {
          return results.filter((result: CartItemDetailed | null): boolean => result !== null) as CartItemDetailed[];
        }),
      )
      .subscribe((cartItemsDetailed: CartItemDetailed[]): void => {
        this.cartItemsDetailed = cartItemsDetailed;
        this.cdr.markForCheck();
      });
  }

  public backToShop(): void {
    this.router.navigate(['products']);
  }

  public deleteCartItem(cartItem: CartItemDetailed): void {
    this.cartService.deleteCartItem(cartItem.product.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product is deleted',
    });
  }

  public trackByFn(index: number, item: any) {
    return item.product.id;
  }

  public updateCartItemQuantity(event: any, cartItem: CartItemDetailed): void {
    this.cartService.setCartItem({
      productId: cartItem.product.id,
      quantity: event.value,
    }, true);
  }
}
