import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { Order, ORDER_STATUS, OrdersService } from '@ltviz/orders';
import { ActivatedRoute, Params } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { OrderStatusVm } from '../models/order-status-vm.interface';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const UX_MODULES = [
  CardModule,
  ToastModule,
  FieldsetModule,
  DropdownModule,
  ProgressSpinnerModule,
];

@Component({
  selector: 'admin-e-shop-orders-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ...UX_MODULES,
  ],
  templateUrl: './orders-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersDetailComponent implements OnInit {
  private orderService: OrdersService = inject(OrdersService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private messageService: MessageService = inject(MessageService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  public order: Order | undefined;
  public orderStatuses: OrderStatusVm[] = [];
  public selectedStatus: string = '0';

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  private _mapOrderStatus(): void {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key: string): OrderStatusVm => {
      return {
        id: key,
        name: ORDER_STATUS[key].label,
      };
    });
  }

  private _getOrder(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params): void => {
        if (params['id']) {
          this.orderService.getOrder(params['id'])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((order: Order): void => {
              this.order = order;
              this.selectedStatus = order.status;
              this.cdr.markForCheck();
            });
        }
      });
  }

  public onStatusChange(event: DropdownChangeEvent): void {
    if (this.order?.id) {
      this.orderService.updateOrder({ status: event.value }, this.order.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (): void => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Order is updated!',
            });
          },
          error: (): void => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Order is not updated!',
            });
          }
        });
    }
  }
}
