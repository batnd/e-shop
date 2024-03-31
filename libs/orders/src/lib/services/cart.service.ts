import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.interface';
import { Cart } from '../models/cart.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey: string = 'cart';
  public cartItemsQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public cartItemsQuantity$: Observable<number> = this.cartItemsQuantity.asObservable();
  public cart: BehaviorSubject<Cart> = new BehaviorSubject<Cart>({ items: [] });
  public cart$: Observable<Cart> =  this.cart.asObservable();

  public initCartLocalStorage(): void {
    const cart: Cart = this.getCart();
    if (!cart.items.length) {
      const initialCartJson: string = JSON.stringify(cart);
      localStorage.setItem(this.cartKey, initialCartJson);
    }
    this.cartItemsQuantity.next(cart.items.length);
    this.cart.next(cart);
  }

  public setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart: Cart = this.getCart();
    const cartItemExist: CartItem | undefined = cart.items.find((item: CartItem): boolean => item.productId === cartItem.productId);
    if (cartItemExist) {
      cart.items.map((item: CartItem): CartItem => {
        if (item.productId === cartItem.productId) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity;
          } else {
            item.quantity = item.quantity + cartItem.quantity;
          }
        }
        return item;
      });
    } else {
      cart.items.push(cartItem);
    }

    const newCartJson: string = JSON.stringify(cart);
    localStorage.setItem(this.cartKey, newCartJson);
    this.cartItemsQuantity.next(cart.items.length);
    this.cart.next(cart);

    return cart;
  }

  public deleteCartItem(productId: string): void {
    const cart: Cart =  this.getCart();
    const newCart: CartItem[] = cart.items.filter((cartItem: CartItem): boolean => cartItem.productId !== productId);
    cart.items = newCart;

    const cartJson: string = JSON.stringify(cart);
    localStorage.setItem(this.cartKey, cartJson);

    this.cartItemsQuantity.next(cart.items.length);
    this.cart.next(cart);
  }

  public getCart(): Cart {
    let currentCart: Cart = { items: [] };
    const cartJson: string | null = localStorage.getItem(this.cartKey);

    if (cartJson) currentCart = JSON.parse(cartJson);

    return currentCart;
  }

  public emptyCart(): void {
    const initialCart: Cart = { items: [] };
    const initialCartJson: string = JSON.stringify(initialCart);
    localStorage.setItem(this.cartKey, initialCartJson);

    this.cartItemsQuantity.next(initialCart.items.length);
    this.cart.next(initialCart);
  }
}
