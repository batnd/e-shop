import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Product, ProductsService } from '@ltviz/products';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const UX_MODULE = [
  ButtonModule,
  CardModule,
  ConfirmDialogModule,
  TableModule,
  ToastModule,
  ToolbarModule,
  SharedModule,
  ProgressSpinnerModule
];

@Component({
  selector: 'admin-e-shop-products-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ...UX_MODULE
    ,
  ],
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .product-img {
      width: 100px;
      aspect-ratio: auto;
    }
  `,
})
export class ProductsListComponent implements OnInit {
  private productsService: ProductsService = inject(ProductsService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private router: Router = inject(Router);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private messageService: MessageService = inject(MessageService);
  private destroyRef: DestroyRef = inject(DestroyRef);


  public products: Product[] = [];

  ngOnInit(): void {
    this._getProducts();
  }

  private _getProducts(): void {
    this.productsService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products: Product[]): void => {
        this.products = products;
        this.cd.markForCheck();
      });
  }

  public onDeleteProduct(productId: string, productName: string): void {
    this.confirmationService.confirm({
      message: `Do you want to delete <b>${productName}</b> product?`,
      header: 'Delete product',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      rejectButtonStyleClass: 'p-button-text',
      dismissableMask: true,
      accept: (): void => {
        this.productsService.deleteProduct(productId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (): void => {
              this._getProducts();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product is deleted'
              });
            },
            error: (): void => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Product is not deleted'
              });
            }
          });
      }
    });
  }

  public onUpdateProduct(productId: string): void {
    this.router.navigateByUrl(`products/form/${productId}`);
  }
}
