import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from '@abacritt/angularx-social-login';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { counterReducer } from './store/counter/counter.reducer';
import { productReducer } from './store/product/product.reducer';
import { ProductEffects } from './store/product/product.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideStore({
      counter: counterReducer,
      product: productReducer
    }),
    provideEffects([ProductEffects]),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '363830819140-1n88f6d2jlbqlha6tc1vf4dd1gkmlf9m.apps.googleusercontent.com',
              {
                scopes: 'openid email profile ',
              }
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1704755553746951'), // Replace with your App ID
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
