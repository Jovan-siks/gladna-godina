import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FoodService } from '../../services/food.service';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div
      class="px-4 py-6 flex flex-col gap-4 justify-start md:justify-center items-center h-screen"
    >
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
            </tr>
          </tbody>
        </table>

        <div class="flex justify-center p-4">
          <button
            (click)="saveOrder()"
            class="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold text-sm px-6 py-2 rounded-md shadow-md transition cursor-pointer"
          >
            Save Weekly Order
          </button>
        </div>
      </div>
      <!-- Mobile layout (current user only) -->
      <div class="block md:hidden px-4 py-4">
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
              [ngModel]="foodNames[currentUser?._id][day] || ''"
              (ngModelChange)="
                foodNames[currentUser?._id][day] = $event;
                onFoodSelect(currentUser?._id, day)
              "
            >
              <option value="">Select food</option>
              <option *ngFor="let food of foods" [value]="food.name">
                {{ food.name }}
              </option>
            </select>

            <div class="text-sm text-right text-[var(--foreground)] mt-1">
              {{ prices[currentUser?._id][day] }} €
            </div>
          </div>
        </div>

        <!-- Totals and Save button -->
        <div class="mt-6 text-sm font-bold text-center">
          <div class="text-red-600">
            <!-- Weekly Total: {{ getWeeklyTotal(currentUser?._id).toFixed(2) }} € -->
          </div>
          <div class="text-green-600 mt-1">
            <!-- Monthly Total: {{ getMonthlyTotal(currentUser?._id).toFixed(2) }} € -->
          </div>
          <button
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
        if (this.currentUser?._id && !this.foodNames[this.currentUser._id]) {
          this.foodNames[this.currentUser._id] = {};
          this.prices[this.currentUser._id] = {};
          this.days.forEach((day) => {
            this.foodNames[this.currentUser._id][day] = '';
            this.prices[this.currentUser._id][day] = 0;
          });
        }
        // Initialize prices and foodNames for each user/day
        this.users.forEach((user) => {
          if (!this.foodNames[user._id]) this.foodNames[user._id] = {};
          if (!this.prices[user._id]) this.prices[user._id] = {};

          // Only overwrite if not already populated
          this.days.forEach((day) => {
            if (!this.foodNames[user._id][day])
              this.foodNames[user._id][day] = '';
            if (!this.prices[user._id][day]) this.prices[user._id][day] = 0;
          });
        });
      },
      error: (error) => console.error('Error fetching users:', error),
    });

    this.foodService.getAllFoods().subscribe({
      next: (foods) => (this.foods = foods),
      error: (err) => console.error('Error fetching foods:', err),
    });
    this.checkAndClearExpiredOrder();
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
    if (!this.currentUser) return;

    const userId = this.currentUser._id;
    const monday = DateService.getMondayOfCurrentWeek(new Date());
    const weekStartDate = monday.toISOString();
    const endDate = DateService.addDays(monday, 4);
    const monthName = monday.toLocaleString('default', { month: 'long' });

    const weekLabel = `${monday.getDate()}-${endDate.getDate()} ${monthName} ${monday.getFullYear()}`;

    const entries = this.days.map((day) => ({
      day,
      foodName: this.foodNames[userId][day],
      price: this.prices[userId][day],
    }));

    const newPayload = { userId, entries, weekStartDate, weekLabel };

    const stored = localStorage.getItem('weeklyOrder');
    const previous = stored ? JSON.parse(stored) : null;

    const allEmpty = entries.every((e) => !e.foodName);

    function deepEqual(a: any, b: any): boolean {
      return JSON.stringify(sortEntries(a)) === JSON.stringify(sortEntries(b));
    }

    function sortEntries(entries: any[]) {
      return entries
        .map(({ day, foodName, price }) => ({
          day: day.trim(),
          foodName: foodName.trim(),
          price: Number(price),
        }))
        .sort((a, b) => a.day.localeCompare(b.day));
    }

    const isSame =
      previous &&
      previous.userId === newPayload.userId &&
      previous.weekStartDate === newPayload.weekStartDate &&
      deepEqual(previous.entries, newPayload.entries);

    if (isSame && !allEmpty) {
      console.log('No changes detected. Skip save.');
      return;
    }

    const saveFn = previous
      ? this.foodService.updateFoodEntry
      : this.foodService.saveEntries;

    saveFn.call(this.foodService, newPayload).subscribe({
      next: (res: any) => {
        console.log(previous ? 'Order updated:' : 'Order created:', res);
        const cleanRes = {
          ...res,
          entries: res.entries,
        };
        localStorage.setItem('weeklyOrder', JSON.stringify(cleanRes));
      },
      error: (err) => console.error('Error saving/updating order:', err),
    });
  }

  checkAndClearExpiredOrder(): void {
    const now = new Date();
    const isFriday = now.getDay() === 5; // 0 = Sunday, 5 = Friday
    const isAfter10AM = now.getHours() >= 10;

    // Optional: store last cleared date to avoid clearing multiple times on same Friday
    const lastCleared = localStorage.getItem('lastCleared');
    const todayDate = now.toISOString().split('T')[0];

    if (isFriday && isAfter10AM && lastCleared !== todayDate) {
      localStorage.removeItem('weeklyOrder');
      localStorage.setItem('lastCleared', todayDate);
      console.log('Weekly order cleared after 10AM on Friday');
    }
  }
}

export default interface User {
  _id: string;
  name: string;
}
