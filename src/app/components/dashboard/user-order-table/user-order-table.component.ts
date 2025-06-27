// user-order-table.component.ts
import { Component, Input, Output, EventEmitter, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../pages/dashboard/dashboard.component';

@Component({
  selector: 'app-user-order-table',
  imports: [CommonModule, FormsModule],
  template: `
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
            class="hover:bg-[var(--muted)] backdrop-blur transition-all"
          >
            <td class="px-6 py-3 border border-[var(--border)] font-semibold">
              {{ user.name }}
            </td>
            <ng-container *ngFor="let day of days">
              <td class="px-6 py-2 border border-[var(--border)]">
                <select
                  class="w-full max-w-[200px] px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--popover)]/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-sm text-[var(--foreground)] "
                  [ngModel]="foodNames[user._id][day] || ''"
                  [ngClass]="
                    user._id !== currentUser?._id
                      ? 'opacity-90 cursor-not-allowed'
                      : 'cursor-pointer'
                  "
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
                <!-- <app-food-select
                  [foods]="foods"
                  [selected]="foodNames[user._id][day]"
                  [disabled]="user._id !== currentUser?._id"
                  (selectionChange)="
                    foodNames[user._id][day] = $event;
                    onFoodSelect(user._id, day)
                  "
                ></app-food-select> -->
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
  `,
})
export class UserOrderTableComponent {
  @Input() users: User[] = [];
  @Input() foods: { name: string; price: number }[] = [];
  @Input() days: string[] = [];
  @Input() foodNames: Record<string, Record<string, string>> = {};
  @Input() prices: Record<string, Record<string, number>> = {};
  @Input() currentUser?: User | null = null;

  @Output() foodSelect = new EventEmitter<{ userId: string; day: string }>();

  trackByUserId(index: number, user: User): string {
    return user._id;
  }

  onFoodSelect(userId: string, day: string): void {
    this.foodSelect.emit({ userId, day });
  }
}
