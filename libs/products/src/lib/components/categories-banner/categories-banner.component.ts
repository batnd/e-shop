import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.interface';
import { CategoriesService } from '../../services/categories.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ltviz-products-categories-banner',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './categories-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesBannerComponent implements OnInit {
  private categoriesService: CategoriesService = inject(CategoriesService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public categories: Category[] = [];

  ngOnInit(): void {
    this.categoriesService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((categories: Category[]): void => {
        this.categories = categories;
        this.cdr.markForCheck();
      });
  }
}
