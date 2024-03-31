import { OrderItemRequest } from './order-item-request.interface';

export interface OrderRequest {
  orderItems: OrderItemRequest[],
  shippingAddress1: string,
  shippingAddress2: string,
  city: string,
  zip: string,
  country: string,
  phone: string,
  user: string,
  status: number,
  dateOrdered: string
}
