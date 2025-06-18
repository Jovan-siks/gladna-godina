import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FoodService } from '../../services/food.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel',
  imports: [CommonModule],
  template: `
    <div
      class="flex h-[calc(100vh-3.5rem)] bg-[var(--background)] text-[var(--foreground)]  w-full px-4 md:px-20"
    >
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
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
                Weekly Total: {{ getWeeklyTotal(week).toFixed(2) }} €
              </p>
            </div>
            <div
              class="mt-4 text-right text-xl font-bold text-[var(--foreground)]"
            >
              Monthly Total: {{ monthlyTotal.toFixed(2) }}€
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: ``,
})
export class PanelComponent implements OnInit {
  user: any;
  weeklyEntries: any[] = [];
  monthlyTotal = 0;

  constructor(
    private userService: UserService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();

    this.foodService.getUserFoodEntrys(this.user._id).subscribe((response) => {
      this.weeklyEntries = response;

      // ✅ Use helper service instead of inline logic
      this.monthlyTotal = this.foodService.calculateMonthlyTotal(
        this.weeklyEntries
      );
    });
  }

  getWeeklyTotal(week: any): number {
    return this.foodService.calculateWeeklyTotal(week.entries);
  }
}
