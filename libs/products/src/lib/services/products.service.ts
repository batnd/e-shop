import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env';
import { Product } from '../models/product.interface';
import { ProductDeleteResponse } from '../models/product-delete-response.interface';
import { ProductCount } from '../models/product-count.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http: HttpClient = inject(HttpClient);
  private apiURLProducts: string = environment.apiUrl + 'products';

  public getProducts(categoriesFilter?: string[]): Observable<Product[]> {
    let params: HttpParams = new HttpParams();
    if (categoriesFilter && categoriesFilter.length) {
      params = params.append('categories', categoriesFilter.join(','));
    }
    return this.http.get<Product[]>(this.apiURLProducts, { params: params });
  }

  public createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiURLProducts, productData);
  }

  public getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
  }

  public updateProduct(productData: FormData, productId: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiURLProducts}/${productId}`, productData);
  }

  public deleteProduct(productId: string): Observable<ProductDeleteResponse> {
    return this.http.delete<ProductDeleteResponse>(`${this.apiURLProducts}/${productId}`);
  }

  public getProductsCount(): Observable<number> {
    return this.http.get<ProductCount>(`${this.apiURLProducts}/get/count`)
      .pipe(
        map((count: ProductCount) => count.productCount)
      );
  }

  public getFeaturedProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
  }
}
