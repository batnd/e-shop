import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { OrderRequest } from '../../models/order-request.interface';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CartService } from '../../services/cart.service';

const UX_MODULES = [
  ButtonModule,
  ToastModule
]

@Component({
  selector: 'ltviz-orders-thank-you',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ...UX_MODULES,
  ],
  templateUrl: './thank-you.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankYouComponent implements OnInit {
  private ordersService: OrdersService = inject(OrdersService);
  private messageService: MessageService = inject(MessageService);
  private cartService: CartService = inject(CartService);

  ngOnInit(): void {
    const orderData: OrderRequest | null = this.ordersService.getCachedOrderData();

    if (orderData) {
      this.ordersService.createOrder(orderData)
        .subscribe({
          next: (): void => {
            this.cartService.emptyCart();
            this.ordersService.removeCachedOrderData();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `You order was created successfully`,
            });
          }
        });
    }
  }
}
