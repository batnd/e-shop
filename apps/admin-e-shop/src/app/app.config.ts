import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { appRoutes } from './app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CountriesService, jwtInterceptor } from '@ltviz/users';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideNgxStripe } from 'ngx-stripe';

export const initializeCountries = (countriesService: CountriesService) => {
  return (): Promise<void> => countriesService.initLocales();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideStore(),
    provideEffects(),
    provideNgxStripe('pk_test_51P0IgsRuVCaIpQgcCrJpIpLHzvqb681WcvblOK8iw6B2vyrzp9TkcIaSDLcmeMDPh807qkNF2ter65BvDlZZz0Rt00Mg1HtNUY'),
    MessageService,
    ConfirmationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCountries,
      deps: [CountriesService],
      multi: true
    }
  ],
};
