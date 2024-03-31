import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CategoriesService } from '../../services/categories.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Category } from '../../models/category.interface';
import { CategoryVm } from '../../models/category-vm.interface';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, EMPTY, Subject, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';

const UX_MODULES = [
  ProgressSpinnerModule,
  CheckboxModule,
  ButtonModule,
  ToastModule
];

@Component({
  selector: 'ltviz-products-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductItemComponent,
    FormsModule,
    ...UX_MODULES
  ],
  templateUrl: './products-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {
  private productsService: ProductsService = inject(ProductsService);
  private categoriesService: CategoriesService = inject(CategoriesService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public products: Product[] = [];
  public categories: CategoryVm[] = [];
  private categoryFilterSubject: Subject<string[]> = new Subject<string[]>();
  public loadingProducts: boolean = true;
  public isCategoryPage: boolean | undefined;
  public displayedText: string = 'Sorry! We don\'t have products of this category yet!';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      if (params['categoryId']) {
        this.isCategoryPage = true;
        this._getProducts([params['categoryId']]);
      } else {
        this.isCategoryPage = false;
        this._initCategoryFilterSubscription();
        this._getCategories();
      }
    });
  }

  private _initCategoryFilterSubscription(): void {
    this.categoryFilterSubject.pipe(
      debounceTime(333),
      switchMap((selectedCategories: string[]) => {
        return this.productsService.getProducts(selectedCategories);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((products: Product[]): void => {
      this.products = products;
      this.loadingProducts = false;
      this.cdr.markForCheck();
    });

    this.categoryFilterSubject.next([]);
  }

  private _getProducts(categoriesFilter?: string[]): void {
    this.productsService.getProducts(categoriesFilter)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.loadingProducts = false;
          this.displayedText = error.error.message;
          this.cdr.markForCheck();
          return EMPTY;
        })
      )
      .subscribe((products: Product[]): void => {
        this.products = products;
        this.loadingProducts = false;
        this.cdr.markForCheck();
      });
  }

  private _getCategories(): void {
    this.categoriesService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories: Category[]): void => {
        this.categories = this._categoryAdapterDtoToVm(categories);
        this.cdr.markForCheck();
      });
  }

  public categoryFilter(): void {
    const selectedCategories: string[] = this.categories
      .filter((category: CategoryVm) => category.checked)
      .map((category: CategoryVm) => category.id);

    this.categoryFilterSubject.next(selectedCategories);
  }

  public resetFilter(): void {
    this.categories = this.categories.map((category: CategoryVm): CategoryVm => ({ ...category, checked: false }));
    this.categoryFilterSubject.next([]);
  }

  private _categoryAdapterDtoToVm(categories: Category[]): CategoryVm[] {
    return categories.map((category: Category): CategoryVm => ({ ...category, checked: false }));
  }

  public trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
