import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CartService } from '@ltviz/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CountriesService, jwtInterceptor, usersReducer } from '@ltviz/users';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '@env';
import { provideEffects } from '@ngrx/effects';
import { usersEffects } from '@ltviz/users';
import { provideNgxStripe } from 'ngx-stripe';

export const initializeCart = (cartService: CartService) => {
  return (): void => cartService.initCartLocalStorage();
};

export const initializeCountries = (countriesService: CountriesService) => {
  return (): Promise<void> => countriesService.initLocales();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideStore({
      [usersReducer.name]: usersReducer.reducer,
    }),
    provideEffects(),
    provideEffects([usersEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
    MessageService,
    ConfirmationService,
    provideNgxStripe('pk_test_51P0IgsRuVCaIpQgcCrJpIpLHzvqb681WcvblOK8iw6B2vyrzp9TkcIaSDLcmeMDPh807qkNF2ter65BvDlZZz0Rt00Mg1HtNUY'),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCart,
      deps: [CartService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCountries,
      deps: [CountriesService],
      multi: true
    }
  ],
};
