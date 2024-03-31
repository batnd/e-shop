import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.interface';
import { Observable } from 'rxjs';
import { CategoryDeleteResponse } from '../models/category-delete-response.interface';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private http: HttpClient = inject(HttpClient);
  private apiURLCategories: string = environment.apiUrl + 'categories';

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURLCategories);
  }

  public getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURLCategories}/${id}`);
  }

  public createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURLCategories, category);
  }

  public updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiURLCategories}/${category.id}`, category);
  }

  public deleteCategory(categoryId: string): Observable<CategoryDeleteResponse> {
    return this.http.delete<CategoryDeleteResponse>(`${this.apiURLCategories}/${categoryId}`);
  }
}
