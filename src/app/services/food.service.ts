import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FoodService {
  constructor(private http: HttpClient, private router: Router) {}

  getAllFoods(): Observable<{ name: string; price: number }[]> {
    return this.http
      .get<{ name: string; price: number }[]>('http://localhost:8000/api/food')
      .pipe(tap(console.log));
  }
}
