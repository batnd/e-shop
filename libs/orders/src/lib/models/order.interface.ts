import { User } from '@ltviz/users';
import { OrderItem } from './order-item.interface';

export interface Order {
  id?: string,
  orderItems: OrderItem[],
  shippingAddress1?: string,
  shippingAddress2?: string,
  city?: string,
  zip?: string,
  country?: string,
  phone?: string,
  status: string,
  totalPrice: number,
  user: User,
  dateOrdered?: string
}
