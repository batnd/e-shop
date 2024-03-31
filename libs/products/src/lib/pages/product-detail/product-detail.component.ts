import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.interface';
import { ProductsService } from '../../services/products.service';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { GalleryComponent } from '@ltviz/ui';
import { CartItem, CartService } from '@ltviz/orders';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

const UX_MODULES = [
  RatingModule,
  InputNumberModule,
  ButtonModule,
  ToastModule
];

@Component({
  selector: 'ltviz-products-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GalleryComponent,
    ...UX_MODULES,
  ],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private productsService: ProductsService = inject(ProductsService);
  private cartService: CartService = inject(CartService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private messageService: MessageService = inject(MessageService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public product: Product | undefined;
  public quantity: number = 1;

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params): void => {
        if (params['productId']) {
          this._getProduct(params['productId']);
        }
      });
  }

  private _getProduct(productId: string): void {
    this.productsService.getProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((product: Product): void => {
        this.product = product;
        this.cdr.markForCheck();
      });
  }

  public buyNow(): void {

  }

  public addProductToCart(): void {
    if (this.product) {
      const cartItem: CartItem = {
        productId: this.product?.id,
        quantity: Number(this.quantity)
      }
      this.cartService.setCartItem(cartItem);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product added successfully'
      })
    }
  }
}
