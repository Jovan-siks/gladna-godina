import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FoodService } from '../../services/food.service';
import { CommonModule, formatDate } from '@angular/common';
import { WeeklyOrders } from '../../components/admin-panel/orders/weekly-orders.component';
import { UsersComponent } from '../../components/admin-panel/users/users.component';
import { FoodComponent } from '../../components/admin-panel/food/food.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, WeeklyOrders, UsersComponent, FoodComponent],
  template: `
    <div
      class="flex h-[calc(100vh-3.5rem)] bg-[var(--background)] text-[var(--foreground)] w-full px-4 md:px-20"
    >
      <!-- Sidebar -->
      <aside
        class="w-64 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-lg p-4 border-r border-[var(--sidebar-border)] rounded-md"
      >
        <h2 class="text-xl font-semibold mb-6">Admin</h2>
        <nav class="flex flex-col space-y-2">
          <button
            class="px-3 py-2 rounded-md transition text-left hover:bg-[var(--sidebar-primary)] hover:text-[var(--sidebar-primary-foreground)] cursor-pointer"
            (click)="selectedTab = 'dashboard'"
            [ngClass]="buttonClass('dashboard')"
          >
            Dashboard
          </button>
          <button
            class="px-3 py-2 rounded-md transition text-left hover:bg-[var(--sidebar-primary)] hover:text-[var(--sidebar-primary-foreground)] cursor-pointer"
            (click)="selectedTab = 'users'"
            [ngClass]="buttonClass('users')"
          >
            Users
          </button>
          <button
            class="px-3 py-2 rounded-md transition text-left hover:bg-[var(--sidebar-primary)] hover:text-[var(--sidebar-primary-foreground)] cursor-pointer"
            (click)="selectedTab = 'add'"
            [ngClass]="buttonClass('add')"
          >
            Food
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col relative">
        <app-weekly-orders
          *ngIf="selectedTab === 'dashboard'"
          [weeklyEntries]="weeklyEntries"
          [monthlyTotal]="monthlyTotal"
          [user]="user"
          [onDeleteAll]="deleteAllEntries.bind(this)"
        ></app-weekly-orders>

        <app-users *ngIf="selectedTab === 'users'" [users]="users"></app-users>
        <app-food *ngIf="selectedTab === 'add'"></app-food>
      </div>
    </div>
  `,
  styles: ``,
})
export class AdminPanelComponent {
  user: any | null = null;
  users: [] = [];
  weeklyEntries: any[] = [];
  monthlyTotal = 0;

  selectedTab: 'dashboard' | 'users' | 'add' = 'dashboard';

  constructor(
    private userService: UserService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });

    if (this.user && this.user._id) {
      this.fetchWeeklyOrders();
    }
  }

  fetchWeeklyOrders(): void {
    this.foodService.getUserFoodEntries(this.user._id).subscribe((response) => {
      this.weeklyEntries = response;
      this.monthlyTotal = this.foodService.calculateMonthlyTotal(response);
    });
  }

  deleteAllEntries(): void {
    if (!this.weeklyEntries.length) return;

    const uniqueMonths = Array.from(
      new Set(
        this.weeklyEntries.map((week) =>
          formatDate(week.weekStartDate, 'yyyy-MM', 'en-US')
        )
      )
    );

    let completed = 0;

    uniqueMonths.forEach((yearMonth) => {
      this.foodService.deleteAllEntriesForMonth(yearMonth).subscribe({
        next: () => {
          console.log(`✅ Deleted entries for ${yearMonth}`);
          completed++;
          if (completed === uniqueMonths.length) {
            // All deletions done, re-fetch data from server
            this.fetchWeeklyOrders();
            window.location.reload();
          }
        },
        error: (err) =>
          console.error(`❌ Error deleting entries for ${yearMonth}:`, err),
      });
    });
  }

  buttonClass(tab: string): string {
    return `
      px-3 py-2 rounded-md transition text-left 
      ${
        this.selectedTab === tab
          ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]'
          : 'hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]'
      }
    `;
  }
}
