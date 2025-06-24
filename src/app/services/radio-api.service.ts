// src/app/services/radio-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RadioApiService {
  private baseUrl = 'https://de1.api.radio-browser.info/json';

  constructor(private http: HttpClient) {}

  getAllCountries(): Observable<{ name: string; stationcount: number }[]> {
    return this.http.get<{ name: string; stationcount: number }[]>(
      `${this.baseUrl}/countries`
    );
  }

  getTopStationsByCountry(country: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/stations/bycountry/${country}`
    );
  }

  searchStationsByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stations/search?name=${name}`);
  }
}
