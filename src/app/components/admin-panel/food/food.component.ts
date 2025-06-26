import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../../services/food.service';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-xl mx-auto mt-34 space-y-8">
      <!-- Add/Edit Form -->
      <div
        class="bg-white dark:bg-[var(--card)] rounded-xl shadow-md p-6 border border-[var(--border)]"
      >
        <h2 class="text-2xl font-semibold text-[var(--foreground)] mb-4">
          {{ isEditing ? 'Edit' : 'Add' }} Food
        </h2>

        <form (ngSubmit)="onSubmit()" #foodForm="ngForm" class="space-y-4">
          <!-- Name -->
          <div>
            <label
              class="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
              >Food Name</label
            >
            <input
              type="text"
              name="name"
              [(ngModel)]="food.name"
              required
              placeholder="e.g. Pizza"
              class="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <!-- Price -->
          <div>
            <label
              class="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
              >Price (€)</label
            >
            <input
              type="number"
              name="price"
              [(ngModel)]="food.price"
              required
              min="0"
              placeholder="e.g. 9.99"
              class="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <!-- Submit Button -->
          <div class="text-center">
            <button
              type="submit"
              class="bg-[var(--primary)] cursor-pointer text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-opacity-90 transition"
            >
              {{ isEditing ? 'Update' : 'Add' }} Food
            </button>
          </div>
        </form>
      </div>

      <!-- Food List -->
      <div
        class="bg-white dark:bg-[var(--card)] rounded-xl shadow-md p-6 border border-[var(--border)]"
      >
        <h3 class="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Food List
        </h3>

        <ul class="space-y-3 max-h-[600px] overflow-y-auto">
          <li
            *ngFor="let item of foodList"
            class="flex justify-between items-center border-b border-[var(--border)] pb-2"
          >
            <div class="text-[var(--foreground)]">
              {{ item.name }} -
              <span class="font-medium">{{ item.price }}€</span>
            </div>
            <div class="flex gap-2">
              <button
                class="text-sm px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                (click)="editFood(item)"
              >
                Edit
              </button>
              <button
                class="text-sm px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                (click)="deleteFood(item)"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: ``,
})
export class FoodComponent implements OnInit {
  food = { name: '', price: 0 };
  foodList: any[] = [];
  isEditing = false;
  editingId: string | null = null;

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.loadFoods();
  }

  // 🔄 Load all foods
  loadFoods() {
    this.foodService.getAllFoods().subscribe({
      next: (res) => {
        this.foodList = res;
      },
      error: (err) => {
        console.error('Error fetching food list:', err);
      },
    });
  }

  // ✅ Add or Update
  onSubmit() {
    if (this.isEditing && this.editingId) {
      this.foodService
        .editFood({ _id: this.editingId, ...this.food })
        .subscribe({
          next: () => {
            this.loadFoods(); // refresh
            this.resetForm();
          },
          error: (err) => console.error('Update failed', err),
        });
    } else {
      this.foodService.addFood(this.food).subscribe({
        next: () => {
          this.loadFoods(); // refresh
          this.resetForm();
        },
        error: (err) => console.error('Add failed', err),
      });
    }
  }

  // ✏️ Fill form for editing
  editFood(item: any) {
    console.log('🚀 ~ FoodComponent ~ editFood ~ item:', item);
    this.food = { name: item.name, price: item.price };
    this.editingId = item._id;
    this.isEditing = true;
  }

  // ❌ Delete item
  deleteFood(item: any) {
    this.foodService.deleteFood({ _id: item._id }).subscribe({
      next: () => {
        this.loadFoods(); // refresh
        this.resetForm();
      },
      error: (err) => console.error('Delete failed', err),
    });
  }

  // ♻️ Reset the form
  resetForm() {
    this.food = { name: '', price: 0 };
    this.isEditing = false;
    this.editingId = null;
  }
}
