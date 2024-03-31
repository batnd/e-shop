import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '@ltviz/ui';
import { CategoriesBannerComponent, FeaturedProductsComponent } from '@ltviz/products';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'e-shop-home-page',
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    CategoriesBannerComponent,
    FeaturedProductsComponent,
    ToastModule,
  ],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
