import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div class="px-4 py-6 flex flex-col gap-4 justify-center items-center">
      <div
        class="mx-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md shadow-xl overflow-x-auto transition-all"
      >
        <table class="min-w-full text-sm text-[var(--foreground)]">
          <thead
            class="text-xs text-[var(--muted-foreground)] uppercase tracking-wider backdrop-blur-md bg-[var(--card)]/50 border-b border-[var(--border)]"
          >
            <tr>
              <th class="px-6 py-4 text-left border border-[var(--border)]">
                Zaposleni
              </th>
              <ng-container *ngFor="let day of days">
                <th class="px-6 py-4 text-left border border-[var(--border)]">
                  {{ day }}
                </th>
                <th class="px-6 py-4 text-left border border-[var(--border)]">
                  {{ day }} Cijena
                </th>
              </ng-container>
              <th
                class="px-6 py-4 text-left border border-[var(--border)] bg-red-600 text-white"
              >
                Weekly Total
              </th>
              <th
                class="px-6 py-4 text-left border border-[var(--border)] bg-green-600 text-white"
              >
                Monthly Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let user of users; trackBy: trackByUserId"
              class="hover:bg-[var(--muted)]/30 backdrop-blur transition-all"
            >
              <td class="px-6 py-3 border border-[var(--border)] font-semibold">
                {{ user.name }}
              </td>
              <ng-container *ngFor="let day of days">
                <td class="px-6 py-2 border border-[var(--border)]">
                  <select
                    class="w-full  max-w-[200px] px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--popover)]/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm text-[var(--foreground)]"
                    [ngModel]="foodNames[user._id][day]"
                    (ngModelChange)="
                      foodNames[user._id][day] = $event;
                      onFoodSelect(user._id, day)
                    "
                    [disabled]="user._id !== currentUser?._id"
                  >
                    <option value="">Select food</option>
                    <option *ngFor="let food of foods" [value]="food.name">
                      {{ food.name }}
                    </option>
                  </select>
                </td>
                <td
                  class="px-6 py-2 w-[100px] border border-[var(--border)] text-center bg-[var(--muted)]/40 text-[var(--foreground)]"
                >
                  {{ prices[user._id][day] }} €
                </td>
              </ng-container>
              <td
                class="px-6 py-3 border border-[var(--border)] font-bold text-red-600 text-center"
              >
                {{ getWeeklyTotal(user._id).toFixed(2) }} €
              </td>
              <td
                class="px-6 py-3 border border-[var(--border)] font-bold text-green-600 text-center"
              >
                {{ getWeeklyTotal(user._id).toFixed(2) }} €
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-center p-4">
          <button
            (click)="saveOrder()"
            class="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold text-sm px-6 py-2 rounded-md shadow-md transition"
          >
            Save Weekly Order
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  days: string[] = ['Ponedeljak', 'Utorak', 'Srijeda', 'Cetvrtak', 'Petak'];
  prices: { [userId: string]: { [day: string]: number } } = {};
  foodNames: { [userId: string]: { [day: string]: string } } = {};
  currentUser: any = JSON.parse(window.localStorage.getItem('user') || 'null');
  foods: { name: string; price: number }[] = [];

  constructor(
    private userService: UserService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.userService.users().subscribe({
      next: (response) => {
        this.users = response;

        // Initialize prices and foodNames for each user/day
        this.users.forEach((user) => {
          this.foodNames[user._id] = {};
          this.prices[user._id] = {};
          this.days.forEach((day) => {
            this.foodNames[user._id][day] = '';
            this.prices[user._id][day] = 0;
          });
        });
      },
      error: (error) => console.error('Error fetching users:', error),
    });

    this.foodService.getAllFoods().subscribe({
      next: (foods) => (this.foods = foods),
      error: (err) => console.error('Error fetching foods:', err),
    });
  }

  onFoodSelect(userId: string, day: string): void {
    const selectedFoodName = this.foodNames[userId][day];
    const selectedFood = this.foods.find((f) => f.name === selectedFoodName);

    // Set the price
    this.prices[userId][day] = selectedFood ? selectedFood.price : 0;
  }
  trackByUserId(index: number, user: User): string {
    return user._id;
  }

  getWeeklyTotal(userId: string): number {
    return this.days.reduce((total, day) => {
      const val = this.prices[userId][day] || 0;
      return total + val;
    }, 0);
  }

  saveOrder(): void {
    if (!this.currentUser) {
      console.error('No current user found');
      return;
    }

    const userId = this.currentUser._id;

    const orderForWeek = this.days.reduce((acc, day) => {
      acc[day] = {
        food: this.foodNames[userId][day],
        price: this.prices[userId][day],
      };
      return acc;
    }, {} as { [day: string]: { food: string; price: number } });

    localStorage.setItem('weeklyOrder', JSON.stringify(orderForWeek));
  }
}

interface User {
  _id: string;
  name: string;
}
