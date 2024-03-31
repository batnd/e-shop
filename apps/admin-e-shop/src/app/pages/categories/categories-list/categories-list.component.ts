import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@ltviz/products';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const UX_MODULE = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  ToastModule,
  ConfirmDialogModule,
  ProgressSpinnerModule
];

@Component({
  selector: 'admin-e-shop-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ...UX_MODULE
  ],
  templateUrl: './categories-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent implements OnInit {
  private categoriesService: CategoriesService = inject(CategoriesService);
  private messageService: MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private router: Router = inject(Router);
  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef: DestroyRef = inject(DestroyRef);
  public categories: Category[] = [];

  ngOnInit(): void {
    this._getCategories();
  }

  public onDeleteCategory(categoryId: string, categoryName: string): void {
    this.confirmationService.confirm({
      message: `Do you want to delete <b>${categoryName}</b> category?`,
      header: 'Delete category',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check mr-1',
      rejectIcon: 'pi pi-times mr-1',
      rejectButtonStyleClass: 'p-button-text',
      dismissableMask: true,
      accept: (): void => {
        this.categoriesService.deleteCategory(categoryId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (): void => {
              this._getCategories();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Category is deleted'
              });
            },
            error: (): void => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Category is not deleted'
              });
            }
          });
      }
    });
  }

  public onUpdateCategory(categoryId: string): void {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }

  private _getCategories(): void {
    this.categoriesService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories: Category[]): void => {
        this.categories = categories;
        this.cd.markForCheck();
      });
  }
}
