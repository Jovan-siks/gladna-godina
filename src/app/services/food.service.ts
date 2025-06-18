import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FoodService {
  constructor(private http: HttpClient, private router: Router) {}

  // Get all foods
  getAllFoods(): Observable<{ name: string; price: number }[]> {
    return this.http.get<{ name: string; price: number }[]>(
      'http://localhost:8000/api/food'
    );
  }

  // Add a new food
  addFood(payload: { name: string; price: number }) {
    return this.http.post('http://localhost:8000/api/food', payload);
  }

  // Edit a food
  editFood(payload: { _id: string; name: string; price: number }) {
    return this.http.patch(
      `http://localhost:8000/api/food/${payload._id}`,
      payload
    );
  }

  // Delete a food
  deleteFood(payload: { _id: string }) {
    return this.http.delete(`http://localhost:8000/api/food/${payload._id}`, {
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
    return this.http.post('http://localhost:8000/api/food-entries', payload);
  }

  // Get user food entries
  getUserFoodEntrys(userId: string) {
    return this.http
      .get<{ userID: string }[]>(
        `http://localhost:8000/api/food-entries/${userId}`
      )
      .pipe(tap(console.log));
  }

  updateFoodEntry(payload: {
    // _id: string;
    userId: string;
    entries: { day: string; foodName: string; price: number }[];
    weekStartDate: string;
    weekLabel: string;
  }) {
    return this.http.patch(
      `http://localhost:8000/api/food-entries/${payload.userId}`,
      payload
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
