import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../pages/dashboard/dashboard.component';

@Component({
  selector: 'app-user-order-table-mobile',
  imports: [CommonModule, FormsModule],
  template: `
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
            class="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--popover)]/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm text-[var(--foreground)] cursor-pointer"
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
          [disabled]="!currentUser || !canSaveOrder"
          (click)="saveOrder.emit()"
          class="mt-4 w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-semibold text-sm px-6 py-2 rounded-md shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Weekly Order
        </button>
        <div
          *ngIf="!canSaveOrder"
          class="mt-2 text-red-600 text-center font-semibold"
        >
          You can save again in: {{ countdown }}
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class UserOrderTableMobileComponent {
  @Input() users: User[] = [];
  @Input() foods: { name: string; price: number }[] = [];
  @Input() days: string[] = [];
  @Input() foodNames: Record<string, Record<string, string>> = {};
  @Input() prices: Record<string, Record<string, number>> = {};
  @Input() currentUser?: User | null = null;
  @Input() canSaveOrder: boolean = false;
  @Input() countdown: string = '';
  @Output() saveOrder = new EventEmitter<void>();
  getWeeklyTotal(userId: string): number {
    return this.days.reduce((total, day) => {
      return total + (this.prices[userId][day] || 0);
    }, 0);
  }
  getMonthlyTotal(userId: string): number {
    return this.getWeeklyTotal(userId) * 4; // Assuming 4 weeks in a month
  }

  @Output() foodSelect = new EventEmitter<{ userId: string; day: string }>();

  trackByUserId(index: number, user: User): string {
    return user._id;
  }

  onFoodSelect(userId: string, day: string): void {
    this.foodSelect.emit({ userId, day });
  }
}
