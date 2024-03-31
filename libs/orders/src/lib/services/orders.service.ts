import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '@env';
import { Order } from '../models/order.interface';
import { OrderCount } from '../models/order-count.interface';
import { OrderTotalsales } from '../models/order-totalsales.interface';
import { OrderRequest } from '../models/order-request.interface';
import { OrderItemRequest } from '../models/order-item-request.interface';
import { StripeService } from 'ngx-stripe';
import { StripeError } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http: HttpClient = inject(HttpClient);
  private stripeService: StripeService = inject(StripeService);
  private apiURLOrders: string = environment.apiUrl + 'orders';
  private apiURLProducts: string = environment.apiUrl + 'products';

  public getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURLOrders);
  }

  public getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURLOrders}/${id}`);
  }

  public createOrder(order: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrders, order);
  }

  public updateOrder(orderStatus: { status: string }, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStatus);
  }

  public deleteOrder(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLOrders}/${categoryId}`);
  }

  public getOrdersCount(): Observable<number> {
    return this.http.get<OrderCount>(`${this.apiURLOrders}/get/count`)
      .pipe(
        map((count: OrderCount) => count.orderCount)
      );
  }

  public getTotalSales(): Observable<number> {
    return this.http.get<OrderTotalsales>(`${this.apiURLOrders}/get/totalsales`)
      .pipe(
        map((count: OrderTotalsales) => count.totalSales)
      );
  }

  public getProduct(productId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
  }

  public createCheckoutSession(orderItems: OrderItemRequest[]): Observable<{error: StripeError}> {
    return this.http.post<{ id: string }>(`${this.apiURLOrders}/create-checkout-session`, orderItems)
      .pipe(
        switchMap((session: { id: string }) => {
          return this.stripeService.redirectToCheckout({ sessionId: session.id })
        })
      );
  }

  public cacheOrderData(order: OrderRequest): void {
    localStorage.setItem('orderData', JSON.stringify(order));
  }

  public getCachedOrderData(): OrderRequest | null {
    const orderData: string | null = localStorage.getItem('orderData');
    if (orderData) return JSON.parse(orderData);
    else return null;
  }

  public removeCachedOrderData(): void {
    localStorage.removeItem('orderData');
  }
}
