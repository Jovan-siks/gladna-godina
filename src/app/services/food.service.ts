import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FoodService {
  constructor(private http: HttpClient, private router: Router) {}

  // Get all foods
  getAllFoods(): Observable<{ name: string; price: number }[]> {
    return this.http.get<{ name: string; price: number }[]>(
      `${environment.API_URL}/food`
    );
  }

  // Add a new food
  addFood(payload: { name: string; price: number }) {
    return this.http.post(`${environment.API_URL}/food`, payload);
  }

  // Edit a food
  editFood(payload: { _id: string; name: string; price: number }) {
    return this.http.patch(
      `${environment.API_URL}/food/${payload._id}`,
      payload
    );
  }

  // Delete a food
  deleteFood(payload: { _id: string }) {
    return this.http.delete(`${environment.API_URL}/food/${payload._id}`, {
      body: payload,
    });
  }

  // Save food entries
  saveEntries(payload: {
    userId: string;
    entries: { day: string; foodName: string; price: number }[];
    weekStartDate: string;
    weekLabel: string;
  }) {
    return this.http.post(`${environment.API_URL}/food-entries`, payload);
  }

  // Get all entries for a week
  getAllEntriesForWeek(weekStartDate: string): Observable<WeeklyOrder> {
    return this.http.get<WeeklyOrder>(
      `${environment.API_URL}/food-entries/${weekStartDate}`
    );
  }

  // Get user food entries
  getUserFoodEntries(userId: string): Observable<WeeklyUserOrder[]> {
    return this.http.get<WeeklyUserOrder[]>(
      `${environment.API_URL}/food-entries/user/${userId}`
    );
  }

  getMonthlySummary(yearMonth: string): Observable<
    {
      name: string;
      total: number;
    }[]
  > {
    return this.http.get<{ name: string; total: number }[]>(
      `${environment.API_URL}/food-entries/monthly-summary/${yearMonth}`
    );
  }
  // Delete all entries for a month
  deleteAllEntriesForMonth(yearMonth: string) {
    return this.http.delete(
      `${environment.API_URL}/food-entries/month/${yearMonth}`
    );
  }

  // Calculate weekly total
  calculateWeeklyTotal(entries: { price: number }[]): number {
    return entries.reduce((sum, entry) => sum + entry.price, 0);
  }

  // Calculate monthly total
  calculateMonthlyTotal(weeks: { entries: { price: number }[] }[]): number {
    return weeks.reduce((monthSum, week) => {
      return monthSum + this.calculateWeeklyTotal(week.entries);
    }, 0);
  }
}

export interface WeeklyUserOrder {
  weekStartDate: string;
  weekLabel: string;
  entries: { day: string; foodName: string; price: number }[];
}
export interface WeeklyOrder {
  _id?: string;
  weekStartDate: string;
  weekLabel: string;
  orders: {
    userId: string;
    entries: {
      day: string;
      foodName: string;
      price: number;
    }[];
  }[];
}
