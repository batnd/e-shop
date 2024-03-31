import { OrderStatusColor } from './order-status-color.type';
import { OrderStatusLabel } from './order-status-label.type';

export interface OrderStatus {
  [key: string]: {
    label: OrderStatusLabel,
    color: OrderStatusColor;
  }
}
