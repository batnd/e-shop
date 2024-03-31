import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ltviz-products-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-search.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSearchComponent {}
