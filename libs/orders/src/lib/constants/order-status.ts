import { OrderStatus } from '../models/order-status.interface';

export const ORDER_STATUS: OrderStatus = {
  '0' : {
    label: 'Pending',
    color: 'primary'
  },
  '1' : {
    label: 'Processed',
    color: 'warning'
  },
  '2' : {
    label: 'Shipped',
    color: 'warning'
  },
  '3' : {
    label: 'Delivered',
    color: 'success'
  },
  '4' : {
    label: 'Failed',
    color: 'danger'
  }
}
