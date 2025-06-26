import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FoodService } from '../../services/food.service';
import { DateService } from '../../services/date.service';
import { ClockComponent } from '../../components/clock/clock.component';
import { ToastrService } from 'ngx-toastr';
import { UserOrderTableComponent } from '../../components/dashboard/user-order-table/user-order-table.component';
import { UserOrderTableMobileComponent } from '../../components/dashboard/user-order-table-mobile/user-order-table-mobile.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClockComponent,
    UserOrderTableComponent,
    UserOrderTableMobileComponent,
  ],
  template: `
    <div
      class="px-4 py-6 flex flex-col gap-6 justify-start md:justify-center items-center h-screen mt-34 md:mt-0"
    >
      <app-clock></app-clock>

      <div
        class="hidden md:block mx-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md shadow-xl overflow-x-auto transition-all"
      >
        <app-user-order-table
          [users]="users"
          [days]="days"
          [foodNames]="foodNames"
          [prices]="prices"
          [currentUser]="currentUser"
          [foods]="foods"
          (foodSelect)="onFoodSelect($event.userId, $event.day)"
        ></app-user-order-table>

        <div class="flex flex-col items-center p-4 gap-2">
          <button
            [disabled]="!currentUser || !canSaveOrder"
            (click)="saveOrder()"
            class="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold text-sm px-6 py-2 rounded-md shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Weekly Order
          </button>
          <div *ngIf="!canSaveOrder" class="text-red-600 text-sm font-semibold">
            You can save again in: {{ countdown }}
          </div>
        </div>
      </div>

      <!-- Mobile layout (current user only) -->
      <app-user-order-table-mobile
        [users]="users"
        [days]="days"
        [foodNames]="foodNames"
        [prices]="prices"
        [currentUser]="currentUser"
        [foods]="foods"
        (foodSelect)="onFoodSelect($event.userId, $event.day)"
        (saveOrder)="saveOrder()"
        [canSaveOrder]="canSaveOrder"
        [countdown]="countdown"
      ></app-user-order-table-mobile>
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

  canSaveOrder = true;
  countdown = ''; // string to show timer
  private countdownInterval?: ReturnType<typeof setInterval>;

  constructor(
    private userService: UserService,
    private foodService: FoodService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadFoods();
    this.checkLastSave();
    if (!this.canSaveOrder) this.startCountdownTimer();
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

  checkLastSave(): void {
    const lastSave = window.localStorage.getItem('lastOrderSave');
    if (!lastSave) {
      this.canSaveOrder = true;
      return;
    }
    const lastSaveDate = new Date(lastSave);
    const now = new Date();

    // Check if lastSaveDate is today
    if (
      lastSaveDate.getFullYear() === now.getFullYear() &&
      lastSaveDate.getMonth() === now.getMonth() &&
      lastSaveDate.getDate() === now.getDate()
    ) {
      this.canSaveOrder = false; // Already saved today
    } else {
      this.canSaveOrder = true;
    }
  }

  saveOrder(): void {
    if (!this.currentUser) return;

    const userId = this.currentUser._id;
    // Use a unique key per user for last save
    const lastSaveKey = `lastOrderSave_${userId}`;
    const lastSave = window.localStorage.getItem(lastSaveKey);

    // Check if already saved today
    if (lastSave) {
      const lastSaveDate = new Date(lastSave);
      const now = new Date();
      if (
        lastSaveDate.getFullYear() === now.getFullYear() &&
        lastSaveDate.getMonth() === now.getMonth() &&
        lastSaveDate.getDate() === now.getDate()
      ) {
        this.canSaveOrder = false;
        this.startCountdownTimer();
        return;
      }
    }

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
        this.toastr.success('Order saved successfully!');
        // Save timestamp of last save for this user
        window.localStorage.setItem(lastSaveKey, new Date().toISOString());
        this.canSaveOrder = false;
        this.startCountdownTimer();
      },
      error: (err) => {
        this.toastr.error('Failed to save order. Please try again.');
      },
    });
  }

  startCountdownTimer(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    const updateCountdown = () => {
      const diff = nextMidnight.getTime() - new Date().getTime();
      if (diff <= 0) {
        this.canSaveOrder = true;
        this.countdown = '';
        clearInterval(this.countdownInterval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.countdown = `${hours}h ${minutes}m ${seconds}s`;
    };

    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 1000);
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
