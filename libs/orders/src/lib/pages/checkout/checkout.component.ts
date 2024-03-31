import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountriesService, Country, User, UsersService } from '@ltviz/users';
import { CartItem } from '../../models/cart-item.interface';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';
import { OrderRequest } from '../../models/order-request.interface';
import { Cart } from '../../models/cart.interface';
import { OrderItemRequest } from '../../models/order-item-request.interface';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StripeService } from 'ngx-stripe';
import { StripeError } from '@stripe/stripe-js';

const UX_MODULES = [
  ButtonModule,
  DropdownModule,
  InputMaskModule,
  InputSwitchModule,
  InputTextModule,
  PaginatorModule,
  ToastModule,
];

@Component({
  selector: 'ltviz-orders-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OrderSummaryComponent,
    ...UX_MODULES,
  ],
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  private countriesService: CountriesService = inject(CountriesService);
  private router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private cartService: CartService = inject(CartService);
  private ordersService: OrdersService = inject(OrdersService);
  private messageService: MessageService = inject(MessageService);
  private usersService: UsersService = inject(UsersService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private stripeService: StripeService = inject(StripeService);

  public countries: Country[] = this.countriesService.getCountries();
  public checkoutFormGroup: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    street: ['', Validators.required],
    apartment: ['', Validators.required],
    zip: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
  });
  public isSubmitted: boolean = false;
  public orderItems: OrderItemRequest[] = [];
  public userId: string = '6607b210186643de7b4e156c';

  public get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

  ngOnInit(): void {
    this._autoFillUserData();
    this._getCartItems();
  }

  private _autoFillUserData(): void {
    this.usersService.observeCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: User | null): void => {
        if (user && user.id) {
          this.userId = user.id;
          this.checkoutForm['name'].setValue(user.name);
          this.checkoutForm['email'].setValue(user.email);
          this.checkoutForm['phone'].setValue(user.phone);
          this.checkoutForm['street'].setValue(user.street);
          this.checkoutForm['apartment'].setValue(user.apartment);
          this.checkoutForm['zip'].setValue(user.zip);
          this.checkoutForm['city'].setValue(user.city);
          this.checkoutForm['country'].setValue(user.country);
        }
      });
  }

  private _getCartItems(): void {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map((item: CartItem): OrderItemRequest => {
      return {
        product: item.productId,
        quantity: item.quantity,
      };
    });
  }

  public backToCart(): void {
    this.router.navigate(['cart']);
  }

  public placeOrder(): void {
    this.isSubmitted = true;
    this._markFormControlsAsDirty();
    if (this.checkoutFormGroup.invalid) return;

    const order: OrderRequest = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm['street'].value,
      shippingAddress2: this.checkoutForm['apartment'].value,
      city: this.checkoutForm['city'].value,
      zip: this.checkoutForm['zip'].value,
      country: this.checkoutForm['country'].value,
      phone: this.checkoutForm['phone'].value,
      user: this.userId,
      status: 0,
      dateOrdered: `${Date.now()}`,
    };
    this.ordersService.cacheOrderData(order);

    this.ordersService.createCheckoutSession(this.orderItems)
      .subscribe((error: { error: StripeError }): void => {
        if (error) {
          console.log('error in redirect to payment')
        }
      });
  }

  private _markFormControlsAsDirty(): void {
    this.checkoutForm['name'].markAsDirty();
    this.checkoutForm['email'].markAsDirty();
    this.checkoutForm['phone'].markAsDirty();
    this.checkoutForm['street'].markAsDirty();
    this.checkoutForm['apartment'].markAsDirty();
    this.checkoutForm['zip'].markAsDirty();
    this.checkoutForm['city'].markAsDirty();
    this.checkoutForm['country'].markAsDirty();
  }
}
