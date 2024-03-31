import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ProductsService } from '../../services/products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'ltviz-products-featured-products',
  standalone: true,
  imports: [CommonModule, ProductItemComponent],
  templateUrl: './featured-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedProductsComponent implements OnInit {
  private productsService: ProductsService = inject(ProductsService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public featuredProducts: Product[] = [];

  ngOnInit(): void {
    this._getFeaturedProducts();
  }

  private _getFeaturedProducts(): void {
    this.productsService.getFeaturedProducts(4)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products: Product[]): void => {
        this.featuredProducts = products;
        this.cdr.markForCheck();
      });
  }
}
