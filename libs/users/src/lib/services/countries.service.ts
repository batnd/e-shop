import { Injectable } from '@angular/core';
import { Country } from '../models/country.interface';
import * as countriesLib from 'i18n-iso-countries';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  public async initLocales(): Promise<void> {
    const locale: any = await import('i18n-iso-countries/langs/en.json');
    countriesLib.registerLocale(locale);
  }

  public getCountries(): Country[] {
    return Object.entries(countriesLib.getNames('en', { select: 'official' }))
      .map((entry: [string, string]): { id: string, name: string } => {
        return {
          id: entry[0],
          name: entry[1]
        }
      });
  }

  public getCountry(countryKey: string): string {
    const country: string | undefined = countriesLib.getName(countryKey, 'en');
    return country ?? 'unknown';
  }
}
