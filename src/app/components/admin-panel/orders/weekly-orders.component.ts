import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-weekly-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class=" w-full">
      <!-- Header -->
      <header
        class="bg-[var(--card)]/70 backdrop-blur-md border-b border-[var(--border)] shadow-sm p-4 flex justify-between items-center"
      >
        <h1 class="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <div class="flex items-center gap-4">
          <span class="text-[var(--muted-foreground)]">{{ user?.name }}</span>
          <img
            src="/assets/images/logo.svg"
            alt="Avatar"
            class="rounded-full w-8 h-8 border border-[var(--border)]"
          />
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6 overflow-auto">
        <div class="grid grid-cols-1  gap-6">
          <div
            *ngFor="let week of weeklyEntries"
            class="rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-lg p-4 transition"
          >
            <h2 class="text-lg font-semibold mb-2 text-[var(--foreground)]">
              {{ week.weekLabel }}
            </h2>
            <p class="mb-3 text-sm text-gray-600">
              Week starts on {{ week.weekStartDate | date : 'mediumDate' }}
            </p>
            <ul class="list-disc list-inside text-[var(--muted-foreground)]">
              <li *ngFor="let item of week.entries">
                {{ item.day }} - {{ item.foodName }} - {{ item.price }}
              </li>
            </ul>
            <p class="text-right font-semibold text-[var(--foreground)]">
              Weekly Total: {{ getWeeklyTotal(week) }}€
            </p>
          </div>
          <div
            class="mt-4 text-right text-xl font-bold text-[var(--foreground)]"
          >
            Monthly Total: {{ monthlyTotal }}€
          </div>
        </div>
      </main>
    </div>
  `,
  styles: ``,
})
export class WeeklyOrders {
  @Input() user: any;
  @Input() weeklyEntries: any[] = [];
  @Input() monthlyTotal: number = 0;

  getWeeklyTotal(week: any): number {
    return week.entries.reduce(
      (acc: number, entry: any) => acc + entry.price,
      0
    );
  }
}
