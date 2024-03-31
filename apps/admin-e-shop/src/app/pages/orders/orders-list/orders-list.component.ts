import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService, SharedModule, SortEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Order, ORDER_STATUS, OrdersService } from '@ltviz/orders';
import { TagModule } from 'primeng/tag';
import { OrderStatus } from '@ltviz/orders';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const UX_MODULES = [
  ButtonModule,
  CardModule,
  ConfirmDialogModule,
  SharedModule,
  TableModule,
  ToastModule,
  ToolbarModule,
  TagModule,
  ProgressSpinnerModule
];

@Component({
  selector: 'admin-e-shop-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ...UX_MODULES
  ],
  templateUrl: './orders-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersListComponent implements OnInit {
  private ordersService: OrdersService = inject(OrdersService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private router: Router = inject(Router);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  public orders: Order[] = [];
  public orderStatus: OrderStatus = ORDER_STATUS;

  ngOnInit(): void {
    this._getOrders();
  }

  private _getOrders(): void {
    this.ordersService.getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders: Order[]): void => {
        this.orders = orders;
        this.cdr.markForCheck();
      });
  }

  public deleteOrder(orderId: string): void {
    this.confirmationService.confirm({
      message: 'Do you want to delete this order?',
      header: 'Delete order',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      rejectButtonStyleClass: 'p-button-text',
      dismissableMask: true,
      accept: (): void => {
        this.ordersService.deleteOrder(orderId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (): void => {
              this._getOrders();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Order is deleted'
              });
            },
            error: (): void => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Order is not deleted'
              });
            }
          });
      }
    });
  }

  public showOrder(orderId: string): void {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  public customSort(event: SortEvent): void {
    if (event.data && event.data.length > 0) {
      event.data.sort((data1: Order, data2: Order) => {
        let value1: any;
        let value2: any;

        if (event.field === 'user') {
          value1 = (data1.user && data1.user.name) ? data1.user.name : '';
          value2 = (data2.user && data2.user.name) ? data2.user.name : '';
        } else {
          const field: keyof Order = event.field as keyof Order;
          value1 = data1[field];
          value2 = data2[field];
        }

        let result: number | null;

        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
        else result = value1 < value2 ? -1 : (value1 > value2 ? 1 : 0);

        return (event.order || 1) * result;
      });
    }
  }
}
