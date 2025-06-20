import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FoodService } from '../../services/food.service';
import { DateService } from '../../services/date.service';
import { ClockComponent } from '../../components/clock/clock.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ClockComponent],
  template: `
    <div
      class="px-4 py-6 flex flex-col gap-4 justify-start md:justify-start items-center h-screen"
    >
      <app-clock></app-clock>

      <div
        class="hidden md:block mx-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md shadow-xl overflow-x-auto transition-all"
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
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let user of users; trackBy: trackByUserId">
              <tr
                *ngIf="user.role !== 'guest'"
                class="hover:bg-[var(--muted)]/30 backdrop-blur transition-all"
              >
                <td
                  class="px-6 py-3 border border-[var(--border)] font-semibold"
                >
                  {{ user.name }}
                </td>
                <ng-container *ngFor="let day of days">
                  <td class="px-6 py-2 border border-[var(--border)]">
                    <select
                      class="w-full max-w-[200px] px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--popover)]/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm text-[var(--foreground)]"
                      [ngModel]="foodNames[user._id][day] || ''"
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
                    {{ prices[user._id][day] || 0 }} €
                  </td>
                </ng-container>
              </tr>
            </ng-container>
          </tbody>
        </table>

        <div class="flex justify-center p-4">
          <button
            [disabled]="!currentUser"
            (click)="saveOrder()"
            class="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold text-sm px-6 py-2 rounded-md shadow-md transition cursor-pointer"
          >
            Save Weekly Order
          </button>
        </div>
      </div>

      <!-- Mobile layout (current user only) -->
      <div class="block md:hidden px-4 py-4" *ngIf="currentUser">
        <div class="grid gap-4">
          <div
            *ngFor="let day of days"
            class="flex flex-col gap-1 border-b border-[var(--border)] pb-3"
          >
            <div class="text-sm text-[var(--muted-foreground)] font-medium">
              {{ day }}
            </div>

            <select
              class="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--popover)]/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm text-[var(--foreground)]"
              [ngModel]="foodNames[currentUser._id][day] || ''"
              (ngModelChange)="
                foodNames[currentUser._id][day] = $event;
                onFoodSelect(currentUser._id, day)
              "
            >
              <option value="">Select food</option>
              <option *ngFor="let food of foods" [value]="food.name">
                {{ food.name }}
              </option>
            </select>

            <div class="text-sm text-right text-[var(--foreground)] mt-1">
              {{ prices[currentUser._id][day] || 0 }} €
            </div>
          </div>
        </div>

        <!-- Totals and Save button -->
        <div class="mt-6 text-sm font-bold text-center">
          <div class="text-red-600" *ngIf="currentUser">
            Weekly Total: {{ getWeeklyTotal(currentUser._id).toFixed(2) }} €
          </div>
          <div class="text-green-600 mt-1" *ngIf="currentUser">
            Monthly Total: {{ getMonthlyTotal(currentUser._id).toFixed(2) }} €
          </div>
          <button
            [disabled]="!currentUser"
            (click)="saveOrder()"
            class="mt-4 w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold text-sm px-6 py-2 rounded-md shadow-md transition cursor-pointer"
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
  days: string[] = ['Ponedeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak'];
  prices: { [userId: string]: { [day: string]: number } } = {};
  foodNames: { [userId: string]: { [day: string]: string } } = {};
  currentUser: User | null = JSON.parse(
    window.localStorage.getItem('user') || 'null'
  );
  foods: { name: string; price: number }[] = [];

  constructor(
    private userService: UserService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadFoods();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.resetOrderState();
        this.loadWeekEntries();
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  loadFoods(): void {
    this.foodService.getAllFoods().subscribe({
      next: (foods) => (this.foods = foods),
      error: (err) => console.error('Failed to load foods', err),
    });
  }

  loadWeekEntries(): void {
    const now = new Date();
    const isFriday = now.getDay() === 5; // Friday
    const isAfter12AM = now.getHours() >= 12;

    if (!(isFriday && isAfter12AM)) {
      const monday = DateService.getMondayOfCurrentWeek(now);
      const weekStartDate = monday.toISOString().split('T')[0]; // "YYYY-MM-DD"

      this.foodService.getAllEntriesForWeek(weekStartDate).subscribe({
        next: (weeklyOrder) => {
          this.resetOrderState();

          if (!weeklyOrder.orders) {
            console.warn('No orders found for the week');
            return;
          }

          weeklyOrder.orders.forEach((entry) => {
            const userId = entry.userId;

            if (!this.foodNames[userId]) {
              this.foodNames[userId] = {};
              this.prices[userId] = {};
            }

            entry.entries.forEach((e: any) => {
              this.foodNames[userId][e.day] = e.foodName;
              this.prices[userId][e.day] = e.price;
            });
          });
        },
        error: (err) => console.error('Error fetching entries for week:', err),
      });
    } else {
      console.log('Not fetching orders: It is Friday after 10AM');
      this.resetOrderState();
    }
  }

  onFoodSelect(userId: string, day: string): void {
    const selectedFoodName = this.foodNames[userId]?.[day];
    const selectedFood = this.foods.find((f) => f.name === selectedFoodName);

    this.prices[userId] = this.prices[userId] || {};
    this.prices[userId][day] = selectedFood ? selectedFood.price : 0;
  }

  trackByUserId(index: number, user: User): string {
    return user._id;
  }

  getWeeklyTotal(userId: string): number {
    return this.days.reduce((total, day) => {
      const val = this.prices[userId]?.[day] || 0;
      return total + val;
    }, 0);
  }

  // Stub for monthly total - implement your own logic if needed
  getMonthlyTotal(userId: string): number {
    // Example: just returns weekly total for now
    return this.getWeeklyTotal(userId);
  }

  saveOrder(): void {
    if (!this.currentUser) return;

    const userId = this.currentUser._id;
    const monday = DateService.getMondayOfCurrentWeek(new Date());
    const weekStartDate = monday.toISOString();
    const endDate = DateService.addDays(monday, 4);
    const monthName = monday.toLocaleString('default', { month: 'long' });

    const weekLabel = `${monday.getDate()}-${endDate.getDate()} ${monthName} ${monday.getFullYear()}`;

    const entries = this.days.map((day) => ({
      day,
      foodName: this.foodNames[userId]?.[day] || '',
      price: this.prices[userId]?.[day] || 0,
    }));

    const payload = { userId, entries, weekStartDate, weekLabel };

    this.foodService.saveEntries(payload).subscribe({
      next: (res: any) => {
        console.log('Order saved successfully:', res);
      },
      error: (err) => console.error('Error saving order:', err),
    });
  }

  resetOrderState(): void {
    this.users.forEach((user) => {
      if (!this.foodNames[user._id]) this.foodNames[user._id] = {};
      if (!this.prices[user._id]) this.prices[user._id] = {};

      this.days.forEach((day) => {
        this.foodNames[user._id][day] = '';
        this.prices[user._id][day] = 0;
      });
    });
  }
}

export interface User {
  _id: string;
  name: string;
  role?: string;
}
