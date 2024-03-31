import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { UsersService } from '@ltviz/users';
import { ProductsService } from '@ltviz/products';
import { OrdersService } from '@ltviz/orders';
import { combineLatest } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const UX_MODULES = [
  CardModule,
  ProgressSpinnerModule,
];

@Component({
  selector: 'admin-e-shop-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ...UX_MODULES,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private userService: UsersService = inject(UsersService);
  private productsService: ProductsService = inject(ProductsService);
  private ordersService: OrdersService = inject(OrdersService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef: DestroyRef = inject(DestroyRef);

  public statistics: number[] = [];

  ngOnInit(): void {
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productsService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales(),
    ]).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values: number[]): void => {
        this.statistics = values;
        this.cdr.markForCheck();
      });
  }
}
