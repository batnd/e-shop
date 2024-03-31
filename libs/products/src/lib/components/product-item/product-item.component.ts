import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CartItem, CartService } from '@ltviz/orders';
import { Product } from '../../models/product.interface';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

const UX_MODULES = [
  ButtonModule,
  TooltipModule
];

@Component({
  selector: 'ltviz-products-product-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ...UX_MODULES
  ],
  templateUrl: './product-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent {
  private messageService: MessageService = inject(MessageService);
  private cartService: CartService = inject(CartService);

  public addedProductToCart: boolean = false;

  @Input()
  public product: Product | undefined;

  public addProductToCart(): void {
    if (this.product) {
      const cartItem: CartItem = {
        productId: this.product.id,
        quantity: 1
      }
      this.cartService.setCartItem(cartItem);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product added successfully'
      });
    }
  }
}
